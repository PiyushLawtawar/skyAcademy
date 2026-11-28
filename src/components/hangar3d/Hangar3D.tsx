import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FIGHTER_SPECS, GROUND_Y, buildFighter, partsForSpec } from './fighterModel';
import { PARTS, PART_EXTRAS, type PartId } from '../../content/aircraftParts';
import { useProgressStore } from '../../store/progressStore';
import { soundManager } from '../../lib/sound';
import { ReadAloudButton } from '../ReadAloudButton';

const PART_ORDER = Object.keys(PARTS) as PartId[];
const DEFAULT_TARGET = new THREE.Vector3(0, -0.3, 0);
const DEFAULT_DIST = 15.5;
/** Pull the camera back on portrait screens so the whole jet fits across. */
const defaultDist = (aspect: number) => (aspect < 1 ? DEFAULT_DIST / Math.max(0.55, aspect) : DEFAULT_DIST);

type Tween = { fromPos: THREE.Vector3; toPos: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3; t: number; dur: number; done?: () => void };

interface MatState {
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
}

/**
 * Interactive 3D hangar: a big, slowly rotating fighter the cadet can spin,
 * zoom and tap. Tapping a part flies the camera to it, ghosts everything
 * else, and opens an info card; tapping empty space (or ✕) flies back out
 * and the jet resumes rotating.
 */
export function Hangar3D({ aircraftId, height = 560 }: { aircraftId: string; height?: number }) {
  const spec = FIGHTER_SPECS[aircraftId];
  const wrapRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef(new Map<PartId, HTMLButtonElement>());
  const api = useRef<{ focusPart: (p: PartId) => void; unfocus: () => void } | null>(null);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [hover, setHover] = useState<{ part: PartId; x: number; y: number } | null>(null);
  const [hint, setHint] = useState(true);
  const sfx = useProgressStore((s) => s.settings.sfx);
  const explored = useProgressStore((s) => s.exploredIds);
  const markExplored = useProgressStore((s) => s.markExplored);
  const sfxRef = useRef(sfx);
  useEffect(() => {
    sfxRef.current = sfx;
  }, [sfx]);

  useEffect(() => {
    if (!spec) return;
    const wrap = wrapRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.display = 'block';
    wrap.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);
    const aspect0 = wrap.clientWidth / Math.max(1, wrap.clientHeight);
    camera.position.copy(new THREE.Vector3(1, 0.42, 1.15).normalize().multiplyScalar(defaultDist(aspect0)).add(DEFAULT_TARGET));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(DEFAULT_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 34;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;
    controls.update();

    // lights
    scene.add(new THREE.HemisphereLight('#dbeafe', '#1e293b', 0.35));
    const sun = new THREE.DirectionalLight('#fff6e8', 1.7);
    sun.position.set(6, 12, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -9;
    sc.right = 9;
    sc.top = 9;
    sc.bottom = -9;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    const rim = new THREE.DirectionalLight('#7dd3fc', 1.1);
    rim.position.set(-8, 4, -6);
    scene.add(rim);

    // hangar floor: soft shadow + glowing turntable rings
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.38 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = GROUND_Y - 0.01;
    floor.receiveShadow = true;
    scene.add(floor);
    const grid = new THREE.PolarGridHelper(8.5, 16, 6, 64, '#38bdf8', '#1e3a5f');
    grid.position.y = GROUND_Y;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);
    const glowRing = new THREE.Mesh(new THREE.RingGeometry(8.4, 8.6, 96), new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = GROUND_Y + 0.005;
    scene.add(glowRing);

    // model
    const model = buildFighter(spec);
    scene.add(model.group);

    const allMeshes: THREE.Mesh[] = [];
    model.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const mat = m.material as THREE.Material;
        mat.userData.base = { opacity: mat.opacity, transparent: mat.transparent, depthWrite: mat.depthWrite } satisfies MatState;
        allMeshes.push(m);
      }
    });
    const partOf = (o: THREE.Object3D | null): PartId | null => {
      while (o) {
        if (o.userData.part) return o.userData.part as PartId;
        o = o.parent;
      }
      return null;
    };

    // ---------------- highlight / ghost ----------------
    let selectedPart: PartId | null = null;
    let hoverPart: PartId | null = null;
    const setEmissive = (m: THREE.Mesh, color: string, k: number) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.emissive) {
        mat.emissive.set(color);
        mat.emissiveIntensity = k;
      }
    };
    const applyLook = (t: number) => {
      for (const m of allMeshes) {
        const part = partOf(m);
        const mat = m.material as THREE.Material;
        const base = mat.userData.base as MatState;
        const ghost = !!selectedPart && part !== selectedPart;
        if (mat.userData.ghost !== ghost) {
          // switching transparency changes the shader, so the material must recompile
          mat.userData.ghost = ghost;
          mat.transparent = ghost ? true : base.transparent;
          mat.depthWrite = ghost ? false : base.depthWrite;
          mat.needsUpdate = true;
        }
        if (ghost) {
          mat.opacity = 0.12;
          setEmissive(m, '#000000', 0);
        } else {
          mat.opacity = base.opacity;
          if (selectedPart && part === selectedPart) setEmissive(m, '#ff9a3c', 0.35 + 0.25 * Math.sin(t * 5));
          else if (hoverPart && part === hoverPart) setEmissive(m, '#38bdf8', 0.45);
          else setEmissive(m, '#000000', 0);
        }
      }
    };

    // ---------------- camera tween ----------------
    let tween: Tween | null = null;
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const flyTo = (pos: THREE.Vector3, target: THREE.Vector3, dur = 1.0, done?: () => void) => {
      tween = { fromPos: camera.position.clone(), toPos: pos, fromT: controls.target.clone(), toT: target, t: 0, dur, done };
    };

    const focusMesh = (part: PartId, mesh: THREE.Mesh) => {
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      const v = PARTS[part].view;
      const dir = new THREE.Vector3(v[0], v[1], center.z < -0.05 ? -v[2] : v[2]).normalize();
      const dist = THREE.MathUtils.clamp(size * 1.35 + 2.4, 3.2, 9);
      controls.autoRotate = false;
      selectedPart = part;
      setSelected(part);
      setHint(false);
      flyTo(center.clone().add(dir.multiplyScalar(dist)), center, 1.1);
      soundManager.unlock();
      soundManager.play('radarPing', { sfxEnabled: sfxRef.current });
    };
    const focusPart = (part: PartId) => {
      const meshes = model.meshesByPart.get(part);
      if (!meshes?.length) return;
      // prefer the copy nearest the camera (e.g. the wing facing us)
      const best = [...meshes].sort((a, b) => a.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position) - b.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position))[0];
      focusMesh(part, best);
    };
    const unfocus = () => {
      if (!selectedPart) return;
      selectedPart = null;
      setSelected(null);
      const dir = camera.position.clone().sub(controls.target).normalize();
      dir.y = THREE.MathUtils.clamp(dir.y, 0.15, 0.6);
      dir.normalize();
      flyTo(DEFAULT_TARGET.clone().add(dir.multiplyScalar(defaultDist(camera.aspect))), DEFAULT_TARGET.clone(), 1.1, () => (controls.autoRotate = true));
      soundManager.play('tap', { sfxEnabled: sfxRef.current });
    };
    api.current = { focusPart, unfocus };

    // ---------------- picking ----------------
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (clientX: number, clientY: number) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      // when focused, only the selected part is solid; let rays pass through ghosts
      const hits = raycaster.intersectObjects(model.group.children, true);
      for (const h of hits) {
        const p = partOf(h.object);
        if (!p) continue;
        if (selectedPart && p !== selectedPart) {
          const mat = (h.object as THREE.Mesh).material as THREE.Material;
          if (mat.opacity < 0.5) continue;
        }
        return { part: p, mesh: h.object as THREE.Mesh };
      }
      return null;
    };
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY };
      setHint(false);
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved > 6) return;
      const hit = pick(e.clientX, e.clientY);
      if (hit) focusMesh(hit.part, hit.mesh);
      else unfocus();
    };
    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const now = performance.now();
      if (now - lastMove < 40) return;
      lastMove = now;
      const hit = down ? null : pick(e.clientX, e.clientY);
      hoverPart = hit?.part ?? null;
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      const r = wrap.getBoundingClientRect();
      setHover(hit ? { part: hit.part, x: e.clientX - r.left, y: e.clientY - r.top } : null);
    };
    const onLeave = () => {
      hoverPart = null;
      setHover(null);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerleave', onLeave);

    // ---------------- sizing + visibility ----------------
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      // keep the whole jet in frame on narrow (portrait) screens
      camera.fov = w / h < 1 ? 50 : 34;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    // ---------------- loop ----------------
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    const centerDist = () => camera.position.distanceTo(model.group.position);
    // Shift the framing so a zoomed-in part sits in the area the info card
    // doesn't cover (left on wide screens, upper part on phones).
    let offX = 0;
    let offY = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(0.05, clock.getDelta());
      const t = clock.elapsedTime;
      if (tween) {
        tween.t = Math.min(1, tween.t + dt / tween.dur);
        const k = ease(tween.t);
        camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
        controls.target.lerpVectors(tween.fromT, tween.toT, k);
        if (tween.t >= 1) {
          const done = tween.done;
          tween = null;
          done?.();
        }
      }
      controls.update();
      const vw = wrap.clientWidth;
      const vh = wrap.clientHeight;
      const wantX = selectedPart && vw >= 640 ? 175 : 0;
      const wantY = selectedPart && vw < 640 ? vh * 0.24 : 0;
      offX += (wantX - offX) * Math.min(1, dt * 5);
      offY += (wantY - offY) * Math.min(1, dt * 5);
      if (Math.abs(offX) > 0.5 || Math.abs(offY) > 0.5) camera.setViewOffset(vw, vh, offX, offY, vw, vh);
      else if (camera.view) camera.clearViewOffset();
      applyLook(t);
      glowRing.material.opacity = 0.45 + 0.25 * Math.sin(t * 2);

      // hotspot markers follow their parts on screen
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const cd = centerDist();
      model.anchors.forEach((local, part) => {
        const el = hotspotRefs.current.get(part);
        if (!el) return;
        tmp.copy(local).applyMatrix4(model.group.matrixWorld);
        const behind = camera.position.distanceTo(tmp) > cd + 0.6;
        tmp.project(camera);
        const x = (tmp.x * 0.5 + 0.5) * w;
        const y = (-tmp.y * 0.5 + 0.5) * h;
        const hidden = selectedPart !== null || tmp.z > 1;
        el.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
        el.style.opacity = hidden ? '0' : behind ? '0.25' : '1';
        el.style.pointerEvents = hidden || behind ? 'none' : 'auto';
      });
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerleave', onLeave);
      controls.dispose();
      model.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
      setSelected(null);
    };
  }, [spec]);

  useEffect(() => {
    if (selected) markExplored(`part:${aircraftId}:${selected}`);
  }, [selected, aircraftId, markExplored]);

  const parts = useMemo(() => (spec ? PART_ORDER.filter((p) => partsForSpec(spec).includes(p)) : []), [spec]);
  const info = selected ? PARTS[selected] : null;
  const extra = selected ? PART_EXTRAS[aircraftId]?.[selected] : undefined;
  const seen = useMemo(() => new Set(explored.filter((e) => e.startsWith(`part:${aircraftId}:`)).map((e) => e.split(':')[2])), [explored, aircraftId]);
  const nextPart = selected ? parts[(parts.indexOf(selected) + 1) % parts.length] : null;

  if (!spec) return null;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden rounded-3xl border border-sky-400/30 shadow-2xl"
        style={{ height, background: 'radial-gradient(ellipse at 50% 35%, #1f3b63 0%, #0b1629 55%, #050a14 100%)' }}
      >
        {/* hotspots (positioned every frame by the render loop) */}
        {parts.map((p) => (
          <button
            key={p}
            ref={(el) => {
              if (el) hotspotRefs.current.set(p, el);
              else hotspotRefs.current.delete(p);
            }}
            onClick={() => api.current?.focusPart(p)}
            aria-label={`Zoom in on the ${PARTS[p].name}`}
            className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full transition-opacity"
            style={{ opacity: 0 }}
          >
            <span className="absolute inset-0 hidden animate-ping rounded-full bg-amber-300/60 sm:block" />
            <span className={`relative h-2.5 w-2.5 rounded-full border border-white sm:h-3.5 sm:w-3.5 sm:border-2 ${seen.has(p) ? 'bg-emerald-400' : 'bg-amber-400'} shadow-[0_0_10px_3px_rgba(251,191,36,0.7)]`} />
          </button>
        ))}

        <div className="pointer-events-none absolute left-4 top-3 text-white">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-sky-300">3D Hangar</p>
          <p className="font-display text-2xl font-extrabold drop-shadow">{spec.name}</p>
          <p className="text-xs font-semibold text-slate-300">
            {seen.size}/{parts.length} parts explored
          </p>
        </div>

        <AnimatePresence>
          {hint && !selected && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-4 py-2 text-sm font-bold text-white"
            >
              👆 Drag to spin · Pinch to zoom · Tap a glowing dot
            </motion.p>
          )}
        </AnimatePresence>

        {hover && !selected && (
          <div className="pointer-events-none absolute rounded-lg bg-black/75 px-2 py-1 text-xs font-bold text-white" style={{ left: hover.x + 14, top: hover.y + 10 }}>
            {PARTS[hover.part].emoji} {PARTS[hover.part].name}
          </div>
        )}

        <AnimatePresence>
          {info && (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', damping: 22, stiffness: 240 }}
              className="absolute bottom-3 left-3 right-3 max-h-[56%] overflow-y-auto rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur sm:bottom-4 sm:left-auto sm:right-4 sm:top-4 sm:max-h-none sm:w-[340px]"
            >
              <button
                onClick={() => api.current?.unfocus()}
                aria-label="Close and zoom out"
                className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 active:scale-95"
              >
                ✕
              </button>
              <p className="text-3xl">{info.emoji}</p>
              <h3 className="pr-10 font-display text-xl font-extrabold text-slate-900">{info.name}</h3>
              <p className="mt-2 text-slate-800">{info.what}</p>
              <p className="mt-2 rounded-xl bg-sky-50 p-3 text-sm text-slate-800">
                <b className="text-sky-800">Its job: </b>
                {info.role}
              </p>
              {extra && <p className="mt-2 rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-900">⭐ {extra}</p>}
              <p className="mt-2 text-sm text-slate-600">🤩 {info.fact}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <ReadAloudButton text={`${info.name}. ${info.what} ${info.role}`} />
                {nextPart && (
                  <button
                    onClick={() => api.current?.focusPart(nextPart)}
                    className="min-h-12 rounded-2xl bg-saffron px-4 font-display font-bold text-white active:scale-95"
                  >
                    Next: {PARTS[nextPart].emoji} {PARTS[nextPart].name.split(' (')[0]} →
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* part chips: another way in, and a checklist */}
      <div className="flex flex-wrap gap-2">
        {parts.map((p) => (
          <button
            key={p}
            onClick={() => (selected === p ? api.current?.unfocus() : api.current?.focusPart(p))}
            className={`min-h-11 rounded-full px-3 text-sm font-bold shadow transition ${
              selected === p ? 'bg-saffron text-white' : seen.has(p) ? 'bg-emerald-100 text-emerald-900' : 'bg-white/90 text-slate-700'
            }`}
          >
            {PARTS[p].emoji} {PARTS[p].name.split(' (')[0]} {seen.has(p) && selected !== p ? '✓' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
