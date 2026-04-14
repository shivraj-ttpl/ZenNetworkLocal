import { useMemo, useState } from 'react';
import {
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Icon from '@/components/icons/Icon';
import { ROLES } from '@/constants/roles';
import {
  providerGroupsData,
  subOrganizationsData,
} from '@/data/subOrganizationsData';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';

export default function ProviderGroupDetailContainer() {
  const { subOrgId, providerGroupId } = useParams();
  const navigate = useNavigate();
  const { subOrgName: subOrgNameFromOutlet } = useOutletContext() ?? {};
  const [searchParams] = useSearchParams();
  const subOrgNameFromUrl = searchParams.get('name');
  const pgName = searchParams.get('pgName');
  const [toolbar, setToolbar] = useState(null);
  const { currentUserRole } = useCurrentUserRole();

  if (currentUserRole === ROLES.ORG_ADMIN) {
    return (
      <Navigate to={`/sub-organizations/${subOrgId}/provider-groups`} replace />
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const orgName = useMemo(
    () =>
      subOrgNameFromUrl ??
      subOrgNameFromOutlet ??
      subOrganizationsData.find((o) => o.id === subOrgId)?.name,
    [subOrgNameFromUrl, subOrgNameFromOutlet, subOrgId],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const providerGroupName = useMemo(
    () =>
      pgName ?? providerGroupsData.find((p) => p.id === providerGroupId)?.name,
    [pgName, providerGroupId],
  );

  const basePath = `/sub-organizations/${subOrgId}/provider-groups/${providerGroupId}`;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (orgName) params.set('name', orgName);
    if (providerGroupName) params.set('pgName', providerGroupName);
    return params.toString();
  }, [orgName, providerGroupName]);

  const buildTabPath = (path) => `${path}?${queryString}`;

  const TABS = [
    { label: 'Profile', path: buildTabPath(basePath), end: true },
    { label: 'Providers', path: buildTabPath(`${basePath}/providers`) },
    { label: 'Patients', path: buildTabPath(`${basePath}/patients`) },
    { label: 'Users', path: buildTabPath(`${basePath}/users`) },
    { label: 'Configuration', path: buildTabPath(`${basePath}/configuration`) },
    {
      label: 'Provider Availability',
      path: buildTabPath(`${basePath}/provider-availability`),
    },
    { label: 'Fee Schedule', path: buildTabPath(`${basePath}/fee-schedule`) },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border-light overflow-hidden h-full min-h-0 flex flex-col">
      <div className="px-5 pt-4 pb-3 space-y-3 shrink-0">
        {/* Row 1: Back button + Org name | Provider Group name */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigate(
                `/sub-organizations/${subOrgId}/provider-groups${orgName ? `?name=${encodeURIComponent(orgName)}` : ''}`,
              )
            }
            className="flex items-center gap-2 text-text-primary hover:text-primary-700 transition-colors cursor-pointer shrink-0"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-base font-medium">{orgName}</span>
          </button>
          <span className="text-neutral-300 shrink-0">|</span>
          <span className="text-base font-medium text-text-primary truncate">
            {providerGroupName || 'Provider Group'}
          </span>
        </div>

        {/* Row 2: Tabs + Toolbar */}
        <div className="flex items-center justify-between gap-3 max-[1149px]:flex-wrap">
          <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200 shrink-0 max-[1149px]:shrink max-[1149px]:min-w-0 max-[1149px]:overflow-x-auto">
            {TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={({ isActive }) =>
                  [
                    'px-3 py-1.5 text-sm font-normal transition-colors cursor-pointer whitespace-nowrap',
                    isActive
                      ? 'bg-neutral-250 text-primary-700'
                      : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50',
                  ].join(' ')
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
          {toolbar && (
            <div className="flex items-center gap-3 max-[1149px]:w-full max-[1149px]:flex-wrap">
              {toolbar}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Outlet
          context={{
            setToolbar,
            subOrgName: orgName,
            providerGroupName,
          }}
        />
      </div>
    </div>
  );
}
