import { useState, useMemo } from "react";
import { NavLink, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/icons/Icon";
import { subOrganizationsData } from "@/data/subOrganizationsData";

export default function SubOrgDetailContainer() {
  const { subOrgId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [toolbar, setToolbar] = useState(null);

  const org = useMemo(
    () => subOrganizationsData.find((o) => o.id === subOrgId),
    [subOrgId]
  );

  const isProviderGroupDetail = /\/provider-groups\/[^/]+/.test(pathname);

  const TABS = useMemo(
    () => [
      { path: `/sub-organizations/${subOrgId}`, label: "Profile", end: true },
      { path: `/sub-organizations/${subOrgId}/provider-groups`, label: "Provider Group", end: false },
    ],
    [subOrgId]
  );

  if (isProviderGroupDetail) {
    return <Outlet context={{ subOrgName: org?.name }} />;
  }

  return (
    <div className="bg-surface rounded-xl border border-border-light overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigate("/sub-organizations")}
            className="flex items-center gap-2 text-text-primary hover:text-primary-700 transition-colors cursor-pointer"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-base font-medium">{org?.name || "Sub-Organization"}</span>
          </button>
          <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200">
            {TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
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
        </div>
        {toolbar && <div className="flex items-center gap-3 flex-wrap min-w-0">{toolbar}</div>}
      </div>
      <Outlet context={{ setToolbar, subOrgName: org?.name }} />
    </div>
  );
}
