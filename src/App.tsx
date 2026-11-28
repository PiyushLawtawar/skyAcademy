import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SkyBackground } from './components/SkyBackground';
import { CallSignPicker } from './screens/CallSignPicker';
import { AvatarBuilder } from './screens/AvatarBuilder';
import { WorldMap } from './screens/WorldMap';
import { StageIsland } from './screens/StageIsland';
import { Lesson } from './screens/Lesson';
import { AircraftGallery } from './screens/AircraftGallery';
import { AircraftDetail } from './screens/AircraftDetail';
import { AircraftCompare } from './screens/AircraftCompare';
import { Settings } from './screens/Settings';
import { ParentCorner } from './screens/ParentCorner';
import { useProgressStore } from './store/progressStore';
import { FactStar } from './components/FactStar';

// The IAF zones are bigger (canvas game, lots of content), so they load on demand.
const Armoury = lazy(() => import('./screens/Armoury').then((m) => ({ default: m.Armoury })));
const WarRoom = lazy(() => import('./screens/WarRoom').then((m) => ({ default: m.WarRoom })));
const WarStory = lazy(() => import('./screens/WarRoom').then((m) => ({ default: m.WarStory })));
const FlightSchool = lazy(() => import('./screens/FlightSchool').then((m) => ({ default: m.FlightSchool })));
const MissionPlanner = lazy(() => import('./screens/MissionPlanner').then((m) => ({ default: m.MissionPlanner })));
const Sortie = lazy(() => import('./screens/Sortie').then((m) => ({ default: m.Sortie })));
const Hangar3DScreen = lazy(() => import('./screens/Hangar3DScreen').then((m) => ({ default: m.Hangar3DScreen })));
const JoinIAF = lazy(() => import('./screens/JoinIAF').then((m) => ({ default: m.JoinIAF })));

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="anim-float rounded-full bg-white/90 px-6 py-3 font-display text-xl font-bold text-slate-700 shadow">✈️ Taxiing to runway…</p>
    </div>
  );
}

function Home() {
  const callSignId = useProgressStore((s) => s.callSignId);
  return <Navigate to={callSignId ? '/map' : '/callsign'} replace />;
}

export default function App() {
  const calmMode = useProgressStore((s) => s.settings.calmMode);
  const touchDailyStreak = useProgressStore((s) => s.touchDailyStreak);
  const callSignId = useProgressStore((s) => s.callSignId);

  useEffect(() => {
    if (callSignId) touchDailyStreak();
  }, [callSignId, touchDailyStreak]);

  useEffect(() => {
    document.documentElement.classList.toggle('calm-mode', calmMode);
  }, [calmMode]);

  return (
    <HashRouter>
      <SkyBackground calmMode={calmMode}>
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callsign" element={<CallSignPicker />} />
          <Route path="/avatar" element={<AvatarBuilder />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/stage/hangar-of-fame" element={<AircraftGallery />} />
          <Route path="/stage/:stageId/compare" element={<AircraftCompare />} />
          <Route path="/stage/:stageId/aircraft/:aircraftId" element={<AircraftDetail />} />
          <Route path="/stage/:stageId" element={<StageIsland />} />
          <Route path="/stage/:stageId/lesson/:lessonId" element={<Lesson />} />
          <Route path="/armoury" element={<Armoury />} />
          <Route path="/war-room" element={<WarRoom />} />
          <Route path="/war-room/:eventId" element={<WarStory />} />
          <Route path="/flight-school" element={<FlightSchool />} />
          <Route path="/mission-planner" element={<MissionPlanner />} />
          <Route path="/sortie" element={<Sortie />} />
          <Route path="/join-iaf" element={<JoinIAF />} />
          <Route path="/hangar-3d" element={<Hangar3DScreen />} />
          <Route path="/hangar-3d/:aircraftId" element={<Hangar3DScreen />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/parent-corner" element={<ParentCorner />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        {callSignId && <FactStar />}
        <ScrollToTop />
      </SkyBackground>
    </HashRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}
