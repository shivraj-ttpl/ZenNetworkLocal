import { useState, useMemo } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';

import { ROLES } from '@/constants/roles';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';

const ALL_TABS = [
  { key: 'profile', label: 'Profile', path: '/settings/profile' },
  { key: 'users', label: 'Users', path: '/settings/users' },
  {
    key: 'roles-permissions',
    label: 'Roles & Permissions',
    path: '/settings/roles-permissions',
    orgAdminOnly: true,
  },
  {
    key: 'reports',
    label: 'Reports',
    path: '/settings/reports',
    orgAdminOnly: true,
  },
  {
    key: 'labels',
    label: 'Labels',
    path: '/settings/labels',
    orgAdminOnly: true,
  },
  { key: 'audit-log', label: 'Audit Log', path: '/settings/audit-log' },
];

export default function SettingsContainer() {
  const { pathname } = useLocation();
  const [toolbar, setToolbar] = useState(null);
  const { currentUserRole } = useCurrentUserRole();

  const TABS = useMemo(() => {
    if (currentUserRole === ROLES.ORG_ADMIN) return ALL_TABS;
    return ALL_TABS.filter((tab) => !tab.orgAdminOnly);
  }, [currentUserRole]);

  if (pathname === '/settings') {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <div className="bg-surface h-[calc(100vh-120px)] rounded-xl border border-border-light overflow-y-auto">
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 flex-wrap">
        <div className="flex rounded-lg overflow-hidden items-center border border-neutral-200 w-fit shrink-0">
          {TABS.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.path}
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
          <div className="flex items-center gap-3 shrink-0">{toolbar}</div>
        )}
      </div>
      <Outlet context={{ setToolbar }} />
    </div>
  );
}
