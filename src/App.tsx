import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/firebase';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { Modal } from '@/components/common/Modal';
// import { ModalNotification } from '@/components/common/ModalNotification';
import { ModalInstall } from '@/components/common/ModalInstall';
import { SplashPage } from '@/pages/login/SplashPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { SignupPage } from '@/pages/signup/SignupPage';
import { UserRoute } from '@/route/UserRoute';
import { AdminRoute } from '@/route/AdminRoute';
import { ErrorPage } from '@/pages/ErrorPage';
import { MaintenancePage } from '@/pages/MaintenancePage';

function App() {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isPWA = () => window.matchMedia('(display-mode: standalone)').matches;
  const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent);

  useEffect(() => {
    if (isIos() && !isPWA()) {
      setShowGuide(true);
    } else if (isPWA() && Notification.permission === 'default') {
      // setIsModalOpen(true);
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground Message:', payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });

    return () => unsubscribe();
  }, []);

  // const isTouchDevice = 'ontouchstart' in window;
  // const isNotification = 'Notification' in window;

  // useEffect(() => {
  //   if (
  //     isNotification &&
  //     Notification.permission === 'default' &&
  //     isPWA() &&
  //     isTouchDevice
  //   ) {
  //     setIsModalOpen(true);
  //   }
  // }, []);

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
    <>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/maintenance" element={<MaintenancePage />} />

        <Route path="/user/*" element={<UserRoute />} />

        <Route path="/admin/*" element={<AdminRoute />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {/* 
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalNotification onClose={() => setIsModalOpen(false)} />
      </Modal> */}

      <Modal isOpen={showGuide} onClose={() => setShowGuide(false)}>
        <ModalInstall onClose={() => setShowGuide(false)} />
      </Modal>
    </>
  );
}

export default App;
