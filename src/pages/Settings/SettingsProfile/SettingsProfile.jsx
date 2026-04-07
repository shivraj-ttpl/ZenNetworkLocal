import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import EditSubOrganizationProfileDrawer from '@/pages/Settings/UserProfile/Components/EditSubOrganizationProfileDrawer';
import { SubOrgAdminProfile } from '@/pages/Settings/UserProfile/UserProfile';
import { userProfileActions } from '@/pages/Settings/UserProfile/userProfileSaga';
import { componentKey as userProfileComponentKey } from '@/pages/Settings/UserProfile/userProfileSlice';

import EditOrganizationProfileDrawer from './Components/EditOrganizationProfileDrawer';
import { settingsProfileActions } from './settingsProfileSaga';
import {
  componentKey,
  setCloseDrawer,
  setOpenEditDrawer,
} from './settingsProfileSlice';

const STATS = [
  { icon: 'Building2', label: 'Sub-Organizations', key: 'subOrganizations' },
  { icon: 'users-round', label: 'Provider Group', key: 'providerGroups' },
  { icon: 'Stethoscope', label: 'Total Providers', key: 'providers' },
  { icon: 'user-round-check', label: 'Total Patient', key: 'patients' },
  { icon: 'Monitor', label: 'System Users', key: 'users' },
];

const CONTACT_FIELDS = [
  { label: 'Email Address', key: 'email', isLink: true, linkType: 'email' },
  { label: 'Contact Number', key: 'primaryContact' },
  { label: 'Fax', key: 'fax' },
  { label: 'Website', key: 'website', isLink: true },
  {
    label: 'Address',
    key: 'address',
    format: (v) =>
      v && typeof v === 'object'
        ? [
            v.addressLine1,
            v.addressLine2,
            v.city,
            v.state,
            v.zipCode,
            v.country,
          ]
            .filter(Boolean)
            .join(', ')
        : v,
  },
];

const ORG_DETAIL_FIELDS = [
  {
    label: 'Created On',
    key: 'createdAt',
    format: (v) =>
      v
        ? new Date(v).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          })
        : null,
  },
  { label: 'Organization Type', key: 'type' },
  { label: 'Description', key: 'description' },
];

const ADMIN_FIELDS = [
  {
    label: 'Administrator Name',
    key: 'firstName',
    format: (v, contact) =>
      [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') || null,
  },
  { label: 'Email Address', key: 'email', isLink: true, linkType: 'email' },
  { label: 'Contact Number', key: 'contactNumber' },
];

function LabelValue({ label, value, isLink, linkType }) {
  const getHref = () => {
    if (linkType === 'email') return `mailto:${value}`;
    return value;
  };

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-neutral-500 min-w-32">{label}</span>
      <span className="text-neutral-500">:</span>
      {isLink && value ? (
        <a
          href={getHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-text-primary">{value ?? '—'}</span>
      )}
    </div>
  );
}

export default function SettingsProfile() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const { isOrgAdmin } = useCurrentUserRole();
  const { profileData, drawerOpen, drawerMode, editData } = useSelector(
    (state) => state[componentKey] ?? {},
  );
  const isLoading = useLoadingKey(LOADING_KEYS.SETTINGS_ORG_PROFILE_GET);
  const { profileData: userProfileData } = useSelector(
    (state) => state[userProfileComponentKey] ?? {},
  );
  useEffect(() => {
    if (isOrgAdmin) {
      dispatch(settingsProfileActions.fetchOrgProfile());
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        dispatch(userProfileActions.fetchUserProfile({ userId: user.id }));
      }
    }
  }, [dispatch, isOrgAdmin]);

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => dispatch(setOpenEditDrawer(profileData))}
      >
        <Icon name="Pencil" size={14} />
        {isOrgAdmin ? 'Edit Organization Profile' : 'Edit Profile'}
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, dispatch, isOrgAdmin, profileData]);

  if (isLoading && !profileData) {
    return (
      <div className="px-3 sm:px-5 pb-5">
        <div className="border border-border-light rounded-lg p-4 sm:p-5 animate-pulse">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-neutral-200 rounded w-48" />
              <div className="h-4 bg-neutral-200 rounded w-32" />
              <div className="h-4 bg-neutral-200 rounded w-64" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border border-border-light rounded-lg p-4 h-16 bg-neutral-100 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-pulse">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-200 rounded w-full" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isOrgAdmin) {
    return (
      <>
        <div className="px-5 pb-5">
          <SubOrgAdminProfile profile={userProfileData} />
        </div>
        <EditSubOrganizationProfileDrawer
          open={drawerOpen}
          handleClose={() => dispatch(setCloseDrawer())}
          editData={userProfileData}
        />
      </>
    );
  }

  return (
    <>
      <div className="px-3 sm:px-5 pb-5">
        <div className="border bg-surface border-border-light rounded-lg p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <Avatar name={profileData?.name} size="xl" variant="square" />
            <div className="flex-1 gap-3">
              <span className="text-base font-medium text-text-primary">
                {profileData?.name}
              </span>
              <div className="space-y-1.5 text-sm mt-3">
                <LabelValue label="Legal Name" value={profileData?.legalName} />
                <LabelValue
                  label="License Number"
                  value={profileData?.licenseNumber}
                />
                <LabelValue label="Tax ID" value={profileData?.taxId} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 mt-3">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="border  bg-surface border-border-light rounded-lg p-3 sm:p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Icon name={stat.icon} size={20} className="text-primary-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-500 truncate">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-xl font-bold text-text-primary leading-tight">
                  {profileData?.analytics?.[stat.key] ?? '—'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 ">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
                Contact Information
              </h3>
              <div className="space-y-3  bg-surface p-3 rounded-md border border-border-light">
                {CONTACT_FIELDS.map((item) => (
                  <LabelValue
                    key={item.key}
                    label={item.label}
                    value={
                      item.format
                        ? item.format(profileData?.[item.key])
                        : profileData?.[item.key]
                    }
                    isLink={item.isLink}
                    linkType={item.linkType}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b   border-border-light pb-2">
                Organization Details
              </h3>
              <div className="space-y-3  bg-surface p-3 rounded-md border border-border-light">
                {ORG_DETAIL_FIELDS.map((item) => (
                  <LabelValue
                    key={item.key}
                    label={item.label}
                    value={
                      item.format
                        ? item.format(profileData?.[item.key])
                        : profileData?.[item.key]
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
              Administrative Contact
            </h3>
            <div className="max-h-[calc(100vh-460px)] overflow-y-auto pr-2">
              <div className="space-y-6  bg-surface p-3 rounded-md border border-border-light">
                {(profileData?.orgUsers ?? []).map((contact, idx) => (
                  <>
                    <div key={idx} className="space-y-3">
                      {ADMIN_FIELDS.map((item) => {
                        return (
                          <>
                            <LabelValue
                              key={`${idx}-${item.key}`}
                              label={item.label}
                              value={
                                item.format
                                  ? item.format(contact[item.key], contact)
                                  : contact[item.key]
                              }
                              isLink={item.isLink}
                              linkType={item.linkType}
                            />
                          </>
                        );
                      })}
                    </div>
                    <hr className="border-border-light" />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditOrganizationProfileDrawer
        open={drawerOpen}
        drawerMode={drawerMode}
        editData={editData}
      />
    </>
  );
}
