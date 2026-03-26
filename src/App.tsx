import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MealPage } from './pages/MealPage';
import { NoticePage, NoticeDetailPage } from './pages/NoticePage';
import { RemainsPage } from './pages/RemainsPage';
import { OutingPage } from './pages/OutingPage';
import { PointPage } from './pages/PointPage';
import { VotingPage } from './pages/VotingPage';
import { MyPage } from './pages/MyPage';
import { SettingsPage } from './pages/SettingsPage';
import { StudentsPage } from './pages/StudentsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/meal"        element={<MealPage />} />
        <Route path="/notice"      element={<NoticePage />} />
        <Route path="/notice/:id"  element={<NoticeDetailPage />} />
        <Route path="/remains"     element={<RemainsPage />} />
        <Route path="/outing"      element={<OutingPage />} />
        <Route path="/point"       element={<PointPage />} />
        <Route path="/voting"      element={<VotingPage />} />
        <Route path="/students"    element={<StudentsPage />} />
        <Route path="/mypage"      element={<MyPage />} />
        <Route path="/settings"    element={<SettingsPage />} />
      </Route>
      <Route path="/app/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
