import { useMemo, useState } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import Icon from '@/components/icons/Icon';
import { ROLES } from '@/constants/roles';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';

const BASE_TABS = [
  {
    key: 'profile',
    label: 'Profile',
    end: true,
    buildPath: (id, name) =>
      `/sub-organizations/${id}?name=${encodeURIComponent(name)}`,
  },
  {
    key: 'provider-groups',
    label: 'Provider Group',
    end: false,
    buildPath: (id, name) =>
      `/sub-organizations/${id}/provider-groups?name=${encodeURIComponent(name)}`,
  },
];

const SUB_ORG_ADMIN_TABS = [
  {
    key: 'roles-permissions',
    label: 'Roles & Permissions',
    end: false,
    buildPath: (id, name) =>
      `/sub-organizations/${id}/roles-permissions?name=${encodeURIComponent(name)}`,
  },
  {
    key: 'reports',
    label: 'Reports',
    end: false,
    buildPath: (id, name) =>
      `/sub-organizations/${id}/reports?name=${encodeURIComponent(name)}`,
  },
  {
    key: 'labels',
    label: 'Labels',
    end: false,
    buildPath: (id, name) =>
      `/sub-organizations/${id}/labels?name=${encodeURIComponent(name)}`,
  },
];

export default function SubOrgDetailContainer() {
  const { subOrgId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [toolbar, setToolbar] = useState(null);
  const { currentUserRole } = useCurrentUserRole();

  const subOrgName = searchParams.get('name') || 'Sub-Organization';

  const isProviderGroupDetail = /\/provider-groups\/[^/]+/.test(pathname);
  const isRolePermissionDetail = /\/roles-permissions\/[^/]+/.test(pathname);

  const TABS = useMemo(() => {
    const tabs = BASE_TABS.map((t) => ({
      ...t,
      path: t.buildPath(subOrgId, subOrgName),
    }));

    if (currentUserRole === ROLES.SUB_ORG_ADMIN) {
      SUB_ORG_ADMIN_TABS.forEach((t) => {
        tabs.push({ ...t, path: t.buildPath(subOrgId, subOrgName) });
      });
    }

    return tabs;
  }, [subOrgId, subOrgName, currentUserRole]);

  if (isProviderGroupDetail || isRolePermissionDetail) {
    return <Outlet context={{ setToolbar, subOrgName }} />;
  }

  return (
    <div className="bg-surface rounded-xl border border-border-light overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 max-[1149px]:flex-wrap">
        <div className="flex items-center gap-4 shrink-0 max-[1149px]:shrink max-[1149px]:min-w-0">
          <button
            onClick={() => navigate('/sub-organizations')}
            className="flex items-center gap-2 text-text-primary hover:text-primary-700 transition-colors cursor-pointer"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-base font-medium">{subOrgName}</span>
          </button>
          <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200 max-[1149px]:overflow-x-auto">
            {TABS.map((tab) => (
              <NavLink
                key={tab.key}
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
        </div>
        {toolbar && (
          <div className="flex items-center gap-3 max-[1149px]:w-full max-[1149px]:flex-wrap">
            {toolbar}
          </div>
        )}
      </div>
      <Outlet context={{ setToolbar, subOrgName }} />
    </div>
  );
}
