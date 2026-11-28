import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { PartId } from '../../content/aircraftParts';

// Procedural 3D fighter models, built from each aircraft's real layout
// (wing planform, canards, single/twin fins, intake position, 1–2 engines).
// Units: the jet is ~10 long, nose at +X, up is +Y, right wing is +Z.
// Every mesh carries userData.part so taps can be mapped to a part.

import type { FighterSpec } from './fighterSpecs';

export { FIGHTER_SPECS, hasModel, partsForSpec, type FighterSpec } from './fighterSpecs';

// ---------------------------------------------------------------------------

type Mat = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | THREE.MeshBasicMaterial;

export interface BuiltModel {
  group: THREE.Group;
  meshesByPart: Map<PartId, THREE.Mesh[]>;
  /** Local position of each part's hotspot marker (right-hand side). */
  anchors: Map<PartId, THREE.Vector3>;
  dispose: () => void;
}

export function buildFighter(spec: FighterSpec): BuiltModel {
  const group = new THREE.Group();
  const meshesByPart = new Map<PartId, THREE.Mesh[]>();
  const anchors = new Map<PartId, THREE.Vector3>();
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];

  const body = (color = spec.color, rough = 0.55, metal = 0.35) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const shade = (hex: string, k: number) => '#' + new THREE.Color(hex).multiplyScalar(k).getHexString();

  const add = (part: PartId, geo: THREE.BufferGeometry, mat: Mat, setup?: (m: THREE.Mesh) => void, anchor = false) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.userData.part = part;
    setup?.(m);
    group.add(m);
    geos.push(geo);
    mats.push(mat);
    if (!meshesByPart.has(part)) meshesByPart.set(part, []);
    meshesByPart.get(part)!.push(m);
    if (anchor && !anchors.has(part)) {
      m.updateMatrix();
      const box = new THREE.Box3().setFromBufferAttribute(geo.getAttribute('position') as THREE.BufferAttribute);
      anchors.set(part, box.getCenter(new THREE.Vector3()).applyMatrix4(m.matrix));
    }
    return m;
  };
  const setAnchor = (part: PartId, v: THREE.Vector3) => anchors.set(part, v);

  const { rMax, widthScale: ws, heightScale: hs } = spec;
  const bodyHalfW = rMax * ws;
  const bodyHalfH = rMax * hs;

  // ---------------- fuselage (lathe), radome, pitot ----------------
  const radius = (x: number) => {
    if (spec.noseIntake) {
      if (x > 4.6) return rMax * 0.86;
      if (x > 3.0) return rMax * (0.86 + ((4.6 - x) / 1.6) * 0.14);
    } else if (x > spec.noseStart) {
      const t = (x - spec.noseStart) / (5 - spec.noseStart);
      return rMax * Math.pow(Math.max(0, 1 - t), 0.75);
    }
    if (x < -3.8) return spec.tailR + (rMax - spec.tailR) * ((x + 5) / 1.2);
    return rMax;
  };
  const lathe = (from: number, to: number, steps: number) => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = from + ((to - from) * i) / steps;
      pts.push(new THREE.Vector2(Math.max(0.0001, radius(x)), x));
    }
    const g = new THREE.LatheGeometry(pts, 40);
    g.rotateZ(-Math.PI / 2);
    return g;
  };
  const noseEnd = spec.noseIntake ? 4.6 : spec.radomeStart;
  add('fuselage', lathe(-5, noseEnd, 60), body(), (m) => m.scale.set(1, hs, ws));
  setAnchor('fuselage', new THREE.Vector3(-0.8, bodyHalfH * 0.4, bodyHalfW + 0.05));

  if (spec.noseIntake) {
    // nose ring intake + shock cone (radome inside)
    add('intake', lathe(4.6, 5.0, 4), body(shade(spec.color, 0.85)));
    add('intake', new THREE.CircleGeometry(rMax * 0.8, 32), new THREE.MeshStandardMaterial({ color: '#111418', roughness: 0.9 }), (m) => {
      m.rotation.y = Math.PI / 2;
      m.position.x = 4.75;
    });
    setAnchor('intake', new THREE.Vector3(5.0, rMax * 0.55, rMax * 0.55));
    const cone = new THREE.ConeGeometry(rMax * 0.55, 1.1, 32);
    cone.rotateZ(-Math.PI / 2);
    add('radome', cone, body('#5f6a78', 0.35, 0.3), (m) => (m.position.x = 5.2), true);
  } else {
    add('radome', lathe(spec.radomeStart, 5, 20), body(shade(spec.color, 0.72), 0.35, 0.25), (m) => m.scale.set(1, hs, ws), true);
  }
  const pitot = new THREE.CylinderGeometry(0.018, 0.025, 0.9, 8);
  pitot.rotateZ(-Math.PI / 2);
  add('pitot', pitot, body('#3b4350', 0.4, 0.8), (m) => {
    m.position.set(spec.noseIntake ? 5.4 : 5.4, spec.noseIntake ? rMax * 0.75 : 0, 0);
  }, true);

  // ---------------- canopy + cockpit ----------------
  const canopyGeo = new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#7fb2dd', roughness: 0.05, metalness: 0.1, transmission: 0, transparent: true, opacity: 0.6, clearcoat: 1 });
  add('canopy', canopyGeo, glass, (m) => {
    m.scale.set(spec.canopy.len / 2, rMax * 0.75, rMax * 0.62);
    m.position.set(spec.canopy.x, bodyHalfH * 0.78, 0);
  }, true);
  // seats + HUD glimpsed through the glass
  for (let s = 0; s < spec.canopy.seats; s++) {
    const off = spec.canopy.seats === 2 ? (s === 0 ? 0.22 : -0.22) * spec.canopy.len : -0.05 * spec.canopy.len;
    add('canopy', new RoundedBoxGeometry(0.3, 0.34, 0.28, 2, 0.05), body('#22272e', 0.8, 0.1), (m) =>
      m.position.set(spec.canopy.x + off, bodyHalfH * 0.82 + 0.15, 0),
    );
  }
  add('canopy', new THREE.PlaneGeometry(0.22, 0.16), new THREE.MeshBasicMaterial({ color: '#5cff9d', transparent: true, opacity: 0.5, side: THREE.DoubleSide }), (m) => {
    m.position.set(spec.canopy.x + spec.canopy.len * 0.33, bodyHalfH * 1.12, 0);
    m.rotation.y = Math.PI / 2;
    m.rotation.x = 0.4;
  });

  // ---------------- flat surfaces (wings, tails, canards) ----------------
  const slab = (pts: [number, number][], thickness: number) => {
    const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.02, bevelSegments: 2 });
    g.rotateX(Math.PI / 2);
    g.translate(0, thickness / 2, 0);
    return g;
  };
  const mirrorZ = (pts: [number, number][]): [number, number][] => pts.map(([x, z]) => [x, -z]);

  const w = spec.wing;
  const z0 = bodyHalfW * 0.82;
  const leAt = (z: number) => {
    if (w.crank && z <= w.crank.z) return w.rootLE + ((z - z0) / (w.crank.z - z0)) * (w.crank.x - w.rootLE);
    const fromX = w.crank ? w.crank.x : w.rootLE;
    const fromZ = w.crank ? w.crank.z : z0;
    return fromX + ((z - fromZ) / (w.span - fromZ)) * (w.tipLE - fromX);
  };
  const teAt = (z: number) => w.rootTE + ((z - z0) / (w.span - z0)) * (w.tipTE - w.rootTE);
  const wingPts: [number, number][] = [[w.rootLE, z0], ...(w.crank ? ([[w.crank.x, w.crank.z]] as [number, number][]) : []), [w.tipLE, w.span], [w.tipTE, w.span], [w.rootTE, z0]];
  const wingMat = body(shade(spec.color, 0.95));
  for (const side of [1, -1]) {
    add('wing', slab(side > 0 ? wingPts : mirrorZ(wingPts), 0.09), wingMat.clone(), (m) => (m.position.y = w.y));
  }
  setAnchor('wing', new THREE.Vector3((leAt(w.span * 0.6) + teAt(w.span * 0.6)) / 2, w.y + 0.06, w.span * 0.6));

  // control surfaces along the trailing edge
  const strip = (fromF: number, toF: number, depth: number): [number, number][] => {
    const za = z0 + (w.span - z0) * fromF;
    const zb = z0 + (w.span - z0) * toF;
    const ca = leAt(za) - teAt(za);
    const cb = leAt(zb) - teAt(zb);
    return [
      [teAt(za) + ca * depth, za],
      [teAt(zb) + cb * depth, zb],
      [teAt(zb) - 0.02, zb],
      [teAt(za) - 0.02, za],
    ];
  };
  const surfMat = body(shade(spec.color, 1.12), 0.5, 0.45);
  const surfaces: [PartId, number, number, number][] =
    spec.surfaces === 'elevons'
      ? [
          ['elevon', 0.06, 0.46, 0.2],
          ['elevon', 0.5, 0.94, 0.28],
        ]
      : [
          ['flaps', 0.06, 0.5, 0.24],
          ['aileron', 0.55, 0.95, 0.26],
        ];
  for (const [part, a, b, d] of surfaces) {
    for (const side of [1, -1]) {
      const pts = strip(a, b, d);
      add(part, slab(side > 0 ? pts : mirrorZ(pts), 0.11), surfMat.clone(), (m) => (m.position.y = w.y), side > 0);
    }
  }

  const smallSurface = (part: PartId, s: { x: number; rootChord: number; tipChord: number; span: number; sweep: number; y: number }, rootZ: number) => {
    const pts: [number, number][] = [
      [s.x, rootZ],
      [s.x - s.sweep, rootZ + s.span],
      [s.x - s.sweep - s.tipChord, rootZ + s.span],
      [s.x - s.rootChord, rootZ],
    ];
    const mat = body(shade(spec.color, 0.98));
    for (const side of [1, -1]) add(part, slab(side > 0 ? pts : mirrorZ(pts), 0.07), mat.clone(), (m) => (m.position.y = s.y), side > 0);
  };
  if (spec.canard) smallSurface('canard', spec.canard, bodyHalfW * 0.8);
  if (spec.tailplane) smallSurface('tailplane', spec.tailplane, spec.engines.nacelles ? bodyHalfW * 0.95 : bodyHalfW * 0.6);

  // ---------------- vertical fin(s) + rudder + fin flash ----------------
  const f = spec.fins;
  const finBase = bodyHalfH * 0.55;
  const finPts: [number, number][] = [
    [f.x, 0],
    [f.x - f.sweep, f.height],
    [f.x - f.sweep - f.tipChord, f.height],
    [f.x - f.rootChord, 0],
  ];
  // fin leading/trailing edge x at height h
  const finLE = (h: number) => f.x - (f.sweep * h) / f.height;
  const finTE = (h: number) => f.x - f.rootChord + ((f.rootChord - f.sweep - f.tipChord) * h) / f.height;
  const rudderPts: [number, number][] = [0.08, 0.85].flatMap((k) => {
    const h = f.height * k;
    return [[finTE(h) + (finLE(h) - finTE(h)) * 0.3, h] as [number, number]];
  });
  rudderPts.push([finTE(f.height * 0.85) - 0.02, f.height * 0.85], [finTE(f.height * 0.08) - 0.02, f.height * 0.08]);
  const finGeo = (pts: [number, number][], t: number) => {
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.015, bevelSegments: 2 });
    g.translate(0, 0, -t / 2);
    return g;
  };
  const finZs = f.count === 2 ? [f.z ?? 0.6, -(f.z ?? 0.6)] : [0];
  finZs.forEach((fz, i) => {
    const cant = f.count === 2 ? (fz > 0 ? -1 : 1) * (f.cant ?? 0.12) : 0;
    const place = (m: THREE.Mesh) => {
      m.position.set(0, finBase, fz);
      m.rotation.x = cant;
    };
    const finMesh = add('fin', finGeo(finPts, 0.08), body(), place, i === 0);
    add('rudder', finGeo(rudderPts, 0.1), body(shade(spec.color, 1.12), 0.5, 0.45), place, i === 0);
    // tricolour fin flash on both faces, as children of the fin so they follow its cant
    const h = f.height * 0.6;
    const flashH = f.height * 0.18;
    const x0 = finTE(h) + (finLE(h) - finTE(h)) * 0.4;
    ['#ff9933', '#ffffff', '#138808'].forEach((c, k) => {
      for (const face of [1, -1]) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(0.17, flashH), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, side: THREE.DoubleSide }));
        m.position.set(x0 + k * 0.17, h, face * 0.056);
        m.rotation.z = -Math.atan2(f.sweep, f.height) * 0.6;
        m.userData.part = 'fin';
        finMesh.add(m);
        meshesByPart.get('fin')!.push(m);
      }
    });
  });

  // ---------------- intakes ----------------
  const dark = new THREE.MeshStandardMaterial({ color: '#101317', roughness: 0.95 });
  const engZ = spec.engines.count === 2 ? spec.engines.z ?? 0.4 : 0;
  if (spec.intake === 'side') {
    for (const side of [1, -1]) {
      add('intake', new RoundedBoxGeometry(1.7, rMax * 1.05, 0.34, 3, 0.1), body(shade(spec.color, 0.92)), (m) =>
        m.position.set(spec.intakeX - 0.85, -rMax * 0.12, side * (bodyHalfW + 0.12)),
        side > 0,
      );
      add('intake', new THREE.PlaneGeometry(0.3, rMax * 0.95), dark.clone(), (m) => {
        m.position.set(spec.intakeX + 0.006, -rMax * 0.12, side * (bodyHalfW + 0.12));
        m.rotation.y = Math.PI / 2;
      });
    }
  } else if (spec.intake === 'under') {
    const zs = spec.engines.count === 2 ? [engZ, -engZ] : [0.3, -0.3];
    const ductY = -bodyHalfH - 0.12;
    for (const z of zs) {
      add('intake', new RoundedBoxGeometry(1.4, 0.5, 0.56, 3, 0.14), body(shade(spec.color, 0.9)), (m) => {
        m.position.set(spec.intakeX - 0.7, ductY, z);
        m.rotation.z = -0.06;
      }, z > 0);
      add('intake', new THREE.PlaneGeometry(0.5, 0.4), dark.clone(), (m) => {
        m.position.set(spec.intakeX + 0.02, ductY, z);
        m.rotation.y = Math.PI / 2;
      });
    }
  }

  // ---------------- engines / nozzles ----------------
  const nacY = spec.engines.nacelles ? -bodyHalfH - 0.12 : 0;
  const nozzleZs = spec.engines.count === 2 ? [engZ, -engZ] : [0];
  for (const z of nozzleZs) {
    if (spec.engines.nacelles) {
      add('engine', new RoundedBoxGeometry(spec.intakeX - 1.4 + 4.6, 0.5, 0.56, 3, 0.2), body(shade(spec.color, 0.88)), (m) =>
        m.position.set((spec.intakeX - 1.4 - 4.6) / 2, nacY, z),
      );
    }
    const noz = new THREE.CylinderGeometry(spec.engines.r, spec.engines.r * 0.92, 0.7, 28, 1, true);
    noz.rotateZ(Math.PI / 2);
    add('engine', noz, new THREE.MeshStandardMaterial({ color: '#3a3f46', roughness: 0.35, metalness: 0.9, side: THREE.DoubleSide }), (m) =>
      m.position.set(-5.2, nacY, z),
      z >= 0,
    );
    // petals ring
    const ring = new THREE.TorusGeometry(spec.engines.r * 0.97, 0.03, 8, 28);
    ring.rotateY(Math.PI / 2);
    add('engine', ring, new THREE.MeshStandardMaterial({ color: '#6b7280', roughness: 0.3, metalness: 0.95 }), (m) => m.position.set(-5.55, nacY, z));
    // afterburner glow deep inside the nozzle
    add('engine', new THREE.CircleGeometry(spec.engines.r * 0.8, 24), new THREE.MeshBasicMaterial({ color: '#ff8a3d' }), (m) => {
      m.position.set(-5.05, nacY, z);
      m.rotation.y = -Math.PI / 2;
    });
  }

  // tail "stinger" between widely spaced engines (Su-30MKI, MiG-29)
  if (spec.engines.nacelles) {
    const sting = new THREE.ConeGeometry(spec.tailR * 0.95, 1.3, 24);
    sting.rotateZ(Math.PI / 2);
    add('fuselage', sting, body(), (m) => {
      m.position.set(-5.6, 0, 0);
      m.scale.set(1, hs, Math.min(ws, 1.2));
    });
  }

  // ---------------- landing gear ----------------
  const groundY = -1.35;
  const gearMat = body('#cfd5dc', 0.4, 0.7);
  const tyre = new THREE.MeshStandardMaterial({ color: '#16181b', roughness: 0.9 });
  const leg = (x: number, z: number, topY: number, wheelR: number) => {
    const h = topY - (groundY + wheelR);
    add('gear', new THREE.CylinderGeometry(0.045, 0.045, h, 10), gearMat.clone(), (m) => m.position.set(x, groundY + wheelR + h / 2, z));
    const wheel = new THREE.CylinderGeometry(wheelR, wheelR, 0.16, 20);
    wheel.rotateX(Math.PI / 2);
    add('gear', wheel, tyre.clone(), (m) => m.position.set(x, groundY + wheelR, z), z >= 0 && x < 0);
  };
  leg(spec.canopy.x + 0.4, 0, -bodyHalfH * 0.8, 0.17);
  const mainZ = Math.max(bodyHalfW * 0.9, 0.75);
  leg(-1.3, mainZ, w.y > 0.2 ? -bodyHalfH * 0.6 : w.y, 0.24);
  leg(-1.3, -mainZ, w.y > 0.2 ? -bodyHalfH * 0.6 : w.y, 0.24);

  // ---------------- refuelling probe ----------------
  if (spec.probe) {
    const p = new THREE.CylinderGeometry(0.04, 0.05, 1.1, 10);
    p.rotateZ(-Math.PI / 2);
    add('probe', p, body('#4b5563', 0.4, 0.8), (m) => m.position.set(spec.canopy.x + spec.canopy.len * 0.55, bodyHalfH * 0.75, bodyHalfW * 0.55), true);
  }

  // ---------------- weapons ----------------
  const missileMat = body('#eef1f4', 0.45, 0.2);
  const seekerMat = body('#30363d', 0.3, 0.4);
  const finMat = body('#9aa3ad', 0.5, 0.4);
  const missile = (x: number, y: number, z: number, len = 1.5) => {
    const r = 0.06;
    const tube = new THREE.CylinderGeometry(r, r, len, 14);
    tube.rotateZ(Math.PI / 2);
    add('missile', tube, missileMat.clone(), (m) => m.position.set(x, y, z), z > 0 && !anchors.has('missile'));
    const nose = new THREE.ConeGeometry(r, 0.22, 14);
    nose.rotateZ(-Math.PI / 2);
    add('missile', nose, seekerMat.clone(), (m) => m.position.set(x + len / 2 + 0.11, y, z));
    for (let k = 0; k < 4; k++) {
      add('missile', new THREE.BoxGeometry(0.22, 0.008, 0.2), finMat.clone(), (m) => {
        m.position.set(x - len / 2 + 0.12, y, z);
        m.rotation.x = (k * Math.PI) / 4 + Math.PI / 4;
      });
    }
  };
  for (const mp of spec.missiles) {
    for (const side of [1, -1]) {
      const z = mp.z * side;
      const wingY = w.y;
      const atTip = Math.abs(mp.z) >= w.span - 0.1;
      if (!atTip) {
        const top = mp.over ? wingY + 0.05 : wingY - 0.05;
        const bottom = mp.y + (mp.over ? -0.07 : 0.07);
        const h = Math.abs(top - bottom);
        add('pylon', new RoundedBoxGeometry(0.6, Math.max(h, 0.06), 0.06, 2, 0.025), body(shade(spec.color, 0.85)), (m) => m.position.set(mp.x, (top + bottom) / 2, z), side > 0 && !anchors.has('pylon'));
      }
      missile(mp.x, mp.y, z);
    }
  }
  if (spec.dropTank) {
    const tank = new THREE.SphereGeometry(1, 28, 16);
    const ty = -bodyHalfH - 0.5;
    add('droptank', tank, body(shade(spec.color, 0.95)), (m) => {
      m.scale.set(1.15, 0.24, 0.24);
      m.position.set(-0.6, ty, 0);
    }, true);
    add('pylon', new THREE.BoxGeometry(0.6, 0.28, 0.05), body(shade(spec.color, 0.85)), (m) => m.position.set(-0.6, -bodyHalfH - 0.16, 0), !anchors.has('pylon'));
  }

  // ---------------- roundels (wing tops + fuselage sides) ----------------
  const roundel = (r: number) => {
    const g = new THREE.Group();
    ['#ff9933', '#ffffff', '#138808'].forEach((c, i) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r * (1 - i * 0.33), 32), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -1 - i }));
      m.position.z = i * 0.002;
      g.add(m);
    });
    return g;
  };
  for (const side of [1, -1]) {
    const rz = w.span * 0.62 * side;
    const rx = (leAt(w.span * 0.62) + teAt(w.span * 0.62)) / 2;
    const r = roundel(0.3);
    r.rotation.x = -Math.PI / 2;
    r.position.set(rx, w.y + 0.07, rz);
    r.children.forEach((c) => (c.userData.part = 'wing'));
    group.add(r);
    const rs = roundel(0.2);
    rs.position.set(-0.4, 0.05, side * (bodyHalfW + 0.035));
    if (side < 0) rs.rotation.y = Math.PI;
    rs.children.forEach((c) => (c.userData.part = 'fuselage'));
    group.add(rs);
  }

  // lift the whole jet so wheels touch y = groundY
  group.position.y = 0;

  return {
    group,
    meshesByPart,
    anchors,
    dispose: () => {
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => mt.dispose());
        }
      });
      geos.length = 0;
      mats.length = 0;
    },
  };
}

export const GROUND_Y = -1.35;
