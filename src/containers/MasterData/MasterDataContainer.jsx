import { useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";

const TABS = [
  { label: "Codes", path: "/master-data/codes" },
  { label: "Condition", path: "/master-data/conditions" },
  { label: "Care Plans", path: "/master-data/care-plans" },
  { label: "Assessments", path: "/master-data/assessments" },
  { label: "Payers", path: "/master-data/payers" },
  { label: "Education", path: "/master-data/education" },
];

export default function MasterDataContainer() {
  const { pathname } = useLocation();
  const [toolbar, setToolbar] = useState(null);

  if (pathname === "/master-data") {
    return <Navigate to="/master-data/codes" replace />;
  }

  return (
    <div className="bg-surface h-full rounded-xl border border-border-light overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 max-[1149px]:flex-wrap max-[1149px]:gap-3">
        <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200 w-fit max-[1149px]:overflow-x-auto">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 text-sm font-normal transition-colors cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-neutral-250 text-primary-700"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        {toolbar && (
          <div className="flex items-center gap-3 max-[1149px]:w-full max-[1149px]:flex-wrap">{toolbar}</div>
        )}
      </div>
        <Outlet context={{ setToolbar }} />
    </div>
  );
}
