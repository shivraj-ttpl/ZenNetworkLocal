import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "@/core/store/loadingSlice";
import Navbar from "@/components/commonComponents/navbar/Navbar";

function GlobalLoader() {
  return <div className="fixed inset-0 z-1000 backdrop-blur-[0.2px] bg-white/40" />;
}

export default function MainAppLayout() {
  const isGlobalLoading = useSelector(selectGlobalLoading);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-auto p-3 max-h-[calc(100vh-64px)] bg-page-bg">
          <Outlet />
        </main>
      </div>

      {isGlobalLoading && <GlobalLoader />}
    </div>
  );
}
