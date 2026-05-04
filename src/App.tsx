import { Route, Routes } from 'react-router-dom';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { SplashPage } from '@/pages/login/SplashPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { SignupPage } from '@/pages/signup/SignupPage';
import { UserRoute } from '@/route/UserRoute';
import { AdminRoute } from '@/route/AdminRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { useEffect } from 'react';

function App() {
  const { isMaintenance, setMaintenance } = useMaintenance();

  useEffect(() => {
    const handleMaintenance = () => setMaintenance(true);

    // 이벤트 리스너 등록
    window.addEventListener('maintenance-mode', handleMaintenance);
    return () =>
      window.removeEventListener('maintenance-mode', handleMaintenance);
  }, [setMaintenance]);

  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/maintenance" element={<MaintenancePage />} />

      <Route path="/user/*" element={<UserRoute />} />

      <Route path="/admin/*" element={<AdminRoute />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
