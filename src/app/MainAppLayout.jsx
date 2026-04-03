import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from '@/components/commonComponents/navbar/Navbar';
import SessionWarningModal from '@/components/SessionWarningModal';
import { selectGlobalLoading } from '@/core/store/loadingSlice';
import useSessionTimeout from '@/hooks/useSessionTimeout';

function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-1000 backdrop-blur-[0.2px] bg-white/10" />
  );
}

export default function MainAppLayout() {
  const isGlobalLoading = useSelector(selectGlobalLoading);

  const handleTimeout = useCallback(() => {
    console.log('Session expired. Logging out.');
    window.__handleLogout?.();
  }, []);

  const { showWarning, extendSession } = useSessionTimeout(handleTimeout);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-auto p-3 max-h-[calc(100vh-64px)] bg-page-bg">
          <Outlet />
        </main>
      </div>

      {isGlobalLoading && <GlobalLoader />}
      <SessionWarningModal
        open={showWarning}
        onExtend={extendSession}
        onLogout={handleTimeout}
      />
    </div>
  );
}
