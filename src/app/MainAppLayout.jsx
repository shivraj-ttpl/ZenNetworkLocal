import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "@/core/store/loadingSlice";

// Global full-screen loader
function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
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
        {/* Navbar placeholder */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0">
          <span className="text-gray-700 font-medium">Navbar</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          {isGlobalLoading && <GlobalLoader />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
