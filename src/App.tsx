import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
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
          <Route path="/settings" element={<Settings />} />
          <Route path="/parent-corner" element={<ParentCorner />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SkyBackground>
    </HashRouter>
  );
}
