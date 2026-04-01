import { useState, useMemo } from "react";
import { NavLink, Navigate, Outlet, useParams, useNavigate, useOutletContext } from "react-router-dom";
import Icon from "@/components/icons/Icon";
import { ROLES } from "@/constants/roles";
import useCurrentUserRole from "@/hooks/getCurrentUserRole";
import { subOrganizationsData, providerGroupsData } from "@/data/subOrganizationsData";

export default function ProviderGroupDetailContainer() {
  const { subOrgId, providerGroupId } = useParams();
  const navigate = useNavigate();
  const { subOrgName: subOrgNameFromOutlet } = useOutletContext() ?? {};
  const [toolbar, setToolbar] = useState(null);
  const { currentUserRole } = useCurrentUserRole();

  if (currentUserRole === ROLES.ORG_ADMIN) {
    return <Navigate to={`/sub-organizations/${subOrgId}/provider-groups`} replace />;
  }

  const orgName = useMemo(
    () =>
      subOrgNameFromOutlet ?? subOrganizationsData.find((o) => o.id === subOrgId)?.name,
    [subOrgNameFromOutlet, subOrgId]
  );

  const pg = useMemo(
    () => providerGroupsData.find((p) => p.id === providerGroupId),
    [providerGroupId]
  );

  const basePath = `/sub-organizations/${subOrgId}/provider-groups/${providerGroupId}`;
  const TABS = [
    { label: "Profile", path: basePath, end: true },
    { label: "Providers", path: `${basePath}/providers` },
    { label: "Patients", path: `${basePath}/patients` },
    { label: "Users", path: `${basePath}/users` },
    { label: "Configuration", path: `${basePath}/configuration` },
    { label: "Provider Availability", path: `${basePath}/provider-availability` },
    { label: "Fee Schedule", path: `${basePath}/fee-schedule` },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border-light overflow-hidden">
      <div className="px-5 pt-4 pb-3 space-y-3">
        {/* Row 1: Back button + Org name | Provider Group name */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/sub-organizations/${subOrgId}/provider-groups`)}
            className="flex items-center gap-2 text-text-primary hover:text-primary-700 transition-colors cursor-pointer shrink-0"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-base font-medium">{orgName}</span>
          </button>
          <span className="text-neutral-300 shrink-0">|</span>
          <span className="text-base font-medium text-text-primary truncate">{pg?.name || "Provider Group"}</span>
        </div>

        {/* Row 2: Tabs + Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200 shrink-0">
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
          {toolbar && <div className="flex items-center gap-3 flex-wrap min-w-0">{toolbar}</div>}
        </div>
      </div>
      <Outlet context={{ setToolbar, subOrgName: orgName, providerGroupName: pg?.name }} />
    </div>
  );
}
