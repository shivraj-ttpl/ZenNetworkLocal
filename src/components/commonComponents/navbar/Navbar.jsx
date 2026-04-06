import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import OneTeamLogo from '@/assets/brand/OneTeam-Logo.png';
import Avatar from '@/components/commonComponents/avatar/Avatar';
import Icon from '@/components/icons/Icon';
import { componentKey } from '@/pages/Auth/authSlice';
import { routeConfig } from '@/routes/routeConfig';

const navRoutes = routeConfig.filter((r) => r.nav);

function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state[componentKey] ?? {});

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((p) => !p)} className="cursor-pointer">
        <Avatar
          name={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
          size="sm"
          online
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border-light rounded-lg shadow-lg z-50 py-1">
          <button
            type="button"
            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 text-text-primary"
            onClick={() => {
              navigate('/user-profile');
              setOpen(false);
            }}
          >
            <Icon name="User" size={14} className="text-neutral-500" />
            Profile
          </button>
          <button
            type="button"
            className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm hover:bg-error-50 text-error-500"
            onClick={() => {
              window.__handleLogout();
              setOpen(false);
            }}
          >
            <Icon name="LogOut" size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-border-light">
      {/* Top bar — logo + avatar */}
      <div className="flex items-center bg-neutral-250 justify-between px-6 h-8 py-6">
        <img src={OneTeamLogo} alt="OneTeam" className="h-8" />
        <AvatarDropdown />
      </div>

      {/* Tab bar — navigation links */}
      <div className="flex items-center gap-6 px-6">
        {navRoutes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`
            }
          >
            {route.icon && <Icon name={route.icon} size={16} />}
            {route.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
