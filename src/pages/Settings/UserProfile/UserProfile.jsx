import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import {
  componentKey,
  setCloseDrawer,
  setOpenEditDrawer,
} from './userProfileSlice';
import './userProfileSaga';
import { userProfileActions } from './userProfileSaga';
import EditSubOrganizationProfileDrawer from './Components/EditSubOrganizationProfileDrawer';
import EditOrganizationUserProfileDrawer from './Components/EditOrganizationUserProfileDrawer';

function formatAddress(val) {
  if (!val || typeof val !== 'object') return val;
  return (
    [
      val.addressLine1,
      val.addressLine2,
      val.city,
      val.state,
      val.zipCode,
      val.country,
    ]
      .filter(Boolean)
      .join(', ') || '—'
  );
}

function LabelValue({ label, value, isLink }) {
  const display =
    value && typeof value === 'object' ? formatAddress(value) : value;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-neutral-500 min-w-36 shrink-0">{label}</span>
      <span className="text-neutral-500">:</span>
      {isLink ? (
        <a href="#" className="text-primary-700 hover:underline">
          {display}
        </a>
      ) : (
        <span className="text-text-primary">{display}</span>
      )}
    </div>
  );
}

function OrgAdminProfile({ profile }) {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '—';

  return (
    <div className="space-y-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="flex items-start gap-4">
          <Avatar name={fullName} size="xl" variant="square" />
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="space-y-2">
              <LabelValue label="Name" value={fullName} />
              <LabelValue label="Email Address" value={profile?.email} isLink />
              <LabelValue label="Address" value={profile?.address} />
            </div>
            <div className="space-y-2">
              <LabelValue label="Role Name" value={profile?.userType} />
              <LabelValue
                label="Contact Number"
                value={profile?.contactNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          {
            icon: 'Building2',
            label: 'Sub-Organizations',
            value: profile?.analytics?.subOrganizations,
          },
          {
            icon: 'users-round',
            label: 'Provider Group',
            value: profile?.analytics?.providerGroups,
          },
          {
            icon: 'Stethoscope',
            label: 'Total Providers',
            value: profile?.analytics?.providers,
          },
          {
            icon: 'user-round-check',
            label: 'Total Patient',
            value: profile?.analytics?.patients,
          },
          {
            icon: 'users-round',
            label: 'System Users',
            value: profile?.analytics?.users,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border-light rounded-lg p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Icon name={stat.icon} size={20} className="text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 truncate">{stat.label}</p>
              <p className="text-xl font-bold text-text-primary leading-tight">
                {stat.value ?? '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
            Contact Information
          </h3>
          <div className="space-y-3">
            <LabelValue label="Email Address" value={profile?.email} isLink />
            <LabelValue label="Contact Number" value={profile?.contactNumber} />
            <LabelValue label="Fax" value={profile?.fax} />
            <LabelValue label="Website" value={profile?.website} isLink />
            <LabelValue label="Address" value={profile?.address} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
            Sub-Organizations
          </h3>
          <div className="space-y-1">
            {(profile?.assignedSubOrgs ?? []).map((org, i) => (
              <p key={i} className="text-sm text-text-primary">
                {org}
              </p>
            ))}
            {!profile?.assignedSubOrgs?.length && (
              <p className="text-sm text-neutral-500">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const USER_TYPE_LABELS = {
  SUB_ORG_ADMIN: 'Sub-Organization Admin',
  ORG_ADMIN: 'Organization Admin',
};

function formatStatus(status) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function SubOrgAdminProfile({ profile, isOrgAdmin }) {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '—';
  const roleLabel =
    USER_TYPE_LABELS[profile?.userType] ?? profile?.userType ?? '—';
  const statusLabel = formatStatus(profile?.status);
  const subOrgNames = (profile?.subOrganizations ?? []).map((o) => o.name);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            icon: 'Building2',
            label: 'Sub-Organizations',
            key: 'subOrganizations',
          },
          {
            icon: 'users-round',
            label: 'Provider Group',
            key: 'providerGroups',
          },
          { icon: 'Stethoscope', label: 'Total Providers', key: 'providers' },
          { icon: 'user-round-check', label: 'Total Patient', key: 'patients' },
          { icon: 'Monitor', label: 'System Users', key: 'users' },
        ].map((stat) => (
          <div
            key={stat.key}
            className="border border-border-light rounded-lg p-3 sm:p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Icon name={stat.icon} size={20} className="text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 truncate">{stat.label}</p>
              <p className="text-lg sm:text-xl font-bold text-text-primary leading-tight">
                {profile?.analytics?.[stat.key] ?? '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="border border-border-light rounded-lg p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar
              src={profile?.profilePhotoUrl}
              name={fullName}
              size="xl"
              variant="square"
            />
            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-start gap-2 text-sm">
                <span className="text-neutral-500 min-w-28 sm:min-w-36 shrink-0">Name</span>
                <span className="text-neutral-500">:</span>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-text-primary">{fullName}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#287F7C] bg-[#EAF5F5] px-2 py-0.5 rounded-full whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#287F7C]" />
                    {statusLabel}
                  </span>
                </div>
              </div>
              <LabelValue label="Email Address" value={profile?.email} isLink />
              <LabelValue
                label="Contact Number"
                value={profile?.contactNumber}
              />
              <LabelValue label="Address" value={profile?.address} />
            </div>
          </div>
        </div>
        {!isOrgAdmin && (
          <div className="border border-border-light rounded-lg p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Other
            </h3>
            <div className="space-y-3">
              <LabelValue label="Role" value={roleLabel} />
              <div className="flex items-start gap-2 text-sm">
                <span className="text-neutral-500 min-w-28 sm:min-w-36 shrink-0">
                  Sub-Organization
                </span>
                <span className="text-neutral-500">:</span>
                <div className="space-y-1">
                  {subOrgNames.length > 0 ? (
                    subOrgNames.map((name, i) => (
                      <p key={i} className="text-text-primary">
                        {name}
                      </p>
                    ))
                  ) : (
                    <p className="text-neutral-500">—</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { drawerOpen, profileData } = useSelector(
    (state) => state[componentKey] || {},
  );
  const { isOrgAdmin } = useCurrentUserRole();
  const dispatch = useDispatch();
  const isLoading = useLoadingKey(LOADING_KEYS.USERS_GET_PROFILE);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) {
      dispatch(userProfileActions.fetchUserProfile({ userId: user.id }));
    }
  }, [dispatch]);

  return (
    <div className="bg-surface h-full rounded-xl border border-border-light overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-base font-semibold text-text-primary">Profile</h2>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenEditDrawer(profileData))}
        >
          <Icon name="Pencil" size={14} />
          Edit Profile
        </Button>
      </div>
      <div className="px-5 pb-5">
        {isLoading && !profileData ? (
          <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border border-border-light rounded-lg p-4 h-16 bg-neutral-100" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="border border-border-light rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-neutral-200 rounded w-48" />
                    <div className="h-4 bg-neutral-200 rounded w-64" />
                    <div className="h-4 bg-neutral-200 rounded w-40" />
                    <div className="h-4 bg-neutral-200 rounded w-56" />
                  </div>
                </div>
              </div>
              <div className="border border-border-light rounded-lg p-5 space-y-3">
                <div className="h-5 bg-neutral-200 rounded w-24" />
                <div className="h-4 bg-neutral-200 rounded w-48" />
                <div className="h-4 bg-neutral-200 rounded w-40" />
              </div>
            </div>
          </div>
        ) : (
          <SubOrgAdminProfile profile={profileData} isOrgAdmin={isOrgAdmin} />
        )}
      </div>
      {/* {isOrgAdmin ? (
        <EditOrganizationUserProfileDrawer
          open={drawerOpen}
          handleClose={() => dispatch(setCloseDrawer())}
          editData={profileData}
        />
      ) : ( */}
      <EditSubOrganizationProfileDrawer
        open={drawerOpen}
        handleClose={() => dispatch(setCloseDrawer())}
        editData={profileData}
      />
      {/* )} */}
    </div>
  );
}
