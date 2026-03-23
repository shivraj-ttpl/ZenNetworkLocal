import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "@/core/store/loadingSlice";
import Navbar from "@/components/commonComponents/navbar/Navbar";

// Global full-screen loader
function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/40">
      <div className="text-white text-lg">Loading...</div>
    </div>
  );
}

export default function MainAppLayout() {
  const isGlobalLoading = useSelector(selectGlobalLoading);

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 max-h-[calc(100vh-64px)] bg-page-bg">
          {isGlobalLoading && <GlobalLoader />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
