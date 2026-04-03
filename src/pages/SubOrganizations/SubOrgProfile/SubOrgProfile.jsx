import { useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import StatusBadge from '@/components/commonComponents/statusBadge/StatusBadge';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { formatDate } from '@/utils/GeneralUtils';

import EditProfileDrawer from './Components/EditProfileDrawer';
import { subOrgProfileActions, registerSaga } from './subOrgProfileSaga';
import {
  componentKey,
  registerReducer,
  setOpenEditDrawer,
} from './subOrgProfileSlice';

const { fetchProfile } = subOrgProfileActions;
const EMPTY_STATE = {};

function buildAddress(addr) {
  if (!addr) return 'N/A';
  return [addr.addressLine1, addr.city, addr.state, addr.zipCode]
    .filter(Boolean)
    .join(', ');
}

function buildPhone(profile) {
  if (!profile.contactNumber) return '-';
  const code = profile.countryCode || '';
  return `${code} ${profile.contactNumber}`.trim();
}

export default function SubOrgProfile() {
  const { subOrgId } = useParams();
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();

  const { profile = null, refreshFlag = 0 } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );
  const isLoading = useLoadingKey(LOADING_KEYS.SUB_ORG_PROFILE_GET_BY_ID);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (subOrgId) {
      dispatch(fetchProfile({ id: subOrgId }));
    }
  }, [dispatch, subOrgId, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => dispatch(setOpenEditDrawer(profile))}
        disabled={!profile}
      >
        <Icon name="Pencil" size={14} />
        Edit Profile
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, dispatch, profile]);

  if (isLoading && !profile) {
    return (
      <div className="px-5 pb-5">
        <div className="border border-border-light rounded-lg p-5 animate-pulse">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-neutral-200 rounded w-48" />
              <div className="h-4 bg-neutral-200 rounded w-32" />
              <div className="h-4 bg-neutral-200 rounded w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-border-light rounded-lg p-4 h-16 bg-neutral-100"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
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
      </div>
    );
  }

  if (!profile) return null;

  const counts = profile.counts || {};

  return (
    <div className="px-5 pb-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="flex items-start gap-4 mb-6">
          <Avatar
            name={profile.name}
            src={profile.logoUrl}
            size="xl"
            variant="square"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  {profile.name}
                </h2>
                {profile.subOrgDisplayId && (
                  <p className="text-sm text-neutral-500">
                    {profile.subOrgDisplayId}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1 text-sm text-neutral-500">
                  <Icon
                    name="MapPin"
                    size={14}
                    className="text-neutral-400"
                  />
                  {buildAddress(profile.address)}
                </div>
              </div>
              <StatusBadge status={profile.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: 'users-round',
              label: 'Provider Group',
              value: counts.providerGroups ?? 0,
            },
            {
              icon: 'Stethoscope',
              label: 'Total Providers',
              value: counts.providers ?? 0,
            },
            {
              icon: 'user-round-check',
              label: 'Total Patient',
              value: counts.patients ?? 0,
            },
            {
              icon: 'users-round',
              label: 'Active Users',
              value: counts.users ?? 0,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-border-light rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <Icon
                  name={stat.icon}
                  size={18}
                  className="text-primary-600"
                />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-lg font-semibold text-text-primary">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
              Contact Information
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: 'Email Address',
                  value: profile.email || '-',
                  isLink: !!profile.email,
                },
                {
                  label: 'Created On',
                  value: formatDate(profile.createdAt),
                },
                {
                  label: 'Contact Number',
                  value: buildPhone(profile),
                },
                {
                  label: 'Website',
                  value: profile.website || '-',
                  isLink: !!profile.website,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-neutral-500 min-w-32">
                    {item.label}
                  </span>
                  <span className="text-neutral-500">:</span>
                  {item.isLink ? (
                    <a href="#" className="text-primary-700 hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-text-primary">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
              Administrative Contact
            </h3>
            <div className="space-y-5">
              {(profile.admins || []).length > 0 ? (
                profile.admins.map((admin) => (
                  <div key={admin.id} className="space-y-3">
                    {[
                      {
                        label: 'Administrator',
                        value: `${admin.firstName} ${admin.lastName}`,
                      },
                      {
                        label: 'Contact Number',
                        value: admin.contactNumber || '-',
                      },
                      {
                        label: 'Email Address',
                        value: admin.email || '-',
                        isLink: !!admin.email,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-neutral-500 min-w-32">
                          {item.label}
                        </span>
                        <span className="text-neutral-500">:</span>
                        {item.isLink ? (
                          <a
                            href="#"
                            className="text-primary-700 hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-text-primary">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-400">
                  No administrators assigned
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileDrawer />
    </div>
  );
}
