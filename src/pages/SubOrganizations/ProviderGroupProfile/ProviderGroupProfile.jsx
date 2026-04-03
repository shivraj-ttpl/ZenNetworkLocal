import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import StatusBadge from '@/components/commonComponents/statusBadge/StatusBadge';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import EditProviderGroupDrawer from './Components/EditProviderGroupDrawer';
import {
  providerGroupProfileActions,
  registerSaga,
} from './providerGroupProfileSaga';
import {
  componentKey,
  registerReducer,
  setOpenEditDrawer,
} from './providerGroupProfileSlice';

const { fetchProfile } = providerGroupProfileActions;
const EMPTY_STATE = {};

function formatAddress(addr) {
  if (!addr) return '-';
  return (
    [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state,
      addr.zipCode,
      addr.country,
    ]
      .filter(Boolean)
      .join(', ') || '-'
  );
}

function buildPhone(obj) {
  if (!obj?.contactNumber) return '-';
  const code = obj.countryCode || '';
  return `${code} ${obj.contactNumber}`.trim();
}

export default function ProviderGroupProfile() {
  const { providerGroupId } = useParams();
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();

  const { profile = null, refreshFlag = 0 } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );
  const isLoading = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROFILE_GET_BY_ID,
  );

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    if (providerGroupId) {
      dispatch(fetchProfile({ id: providerGroupId }));
    }
  }, [dispatch, providerGroupId, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <Button
        variant="primaryBlue"
        size="sm"
        onClick={() => dispatch(setOpenEditDrawer(profile))}
        disabled={!profile}
      >
        <Icon name="Pencil" size={14} />
        Edit
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar, dispatch, profile]);

  if (isLoading && !profile) {
    return (
      <div className="px-5 pb-5">
        <div className="border border-border-light rounded-lg p-5 animate-pulse">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-48" />
                <div className="h-4 bg-neutral-200 rounded w-32" />
                <div className="h-4 bg-neutral-200 rounded w-64" />
                <div className="h-4 bg-neutral-200 rounded w-40" />
                <div className="h-4 bg-neutral-200 rounded w-56" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-neutral-200 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="px-5 pb-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Avatar
              name={profile.name}
              src={profile.logoUrl}
              size="xl"
              variant="square"
            />
            <div className="space-y-2.5">
              {[
                { label: 'Provider Group Name', value: profile.name },
                {
                  label: 'Email Address',
                  value: profile.email || '-',
                  isLink: !!profile.email,
                },
                {
                  label: 'Contact',
                  value: buildPhone(profile),
                },
                {
                  label: 'Specialties',
                  value:
                    (profile?.specialties &&
                      (profile?.specialties?.map((s) => s.name) || []).join(
                        ', ',
                      )) ||
                    '-',
                },
                {
                  label: 'Website',
                  value: profile.website || '-',
                  isLink: !!profile.website,
                },
                { label: 'Timezone', value: profile.timezone || '-' },
                { label: 'Note', value: profile.notes || '-' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-neutral-500 min-w-36">
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
            <StatusBadge status={profile.status} />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
                Address Information
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Address',
                    value: formatAddress(profile.primaryAddress),
                  },
                  {
                    label: 'Billing Address',
                    value: formatAddress(profile.billingAddress),
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
                    <span className="text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
                Administrative Contact
              </h3>
              <div className="max-h-[calc(100vh-460px)] overflow-y-auto pr-2">
                <div className="space-y-6  bg-surface p-3 rounded-md border border-border-light">
                  {(profile.userProviderGroups ?? []).length > 0 ? (
                    profile.userProviderGroups.map((admin, idx) => (
                      <div
                        key={admin.id}
                        className={`space-y-3 ${idx > 0 ? 'pt-4 border-t border-border-light' : ''}`}
                      >
                        {[
                          {
                            label: 'Administrator Name',
                            value:
                              [admin.firstName, admin.lastName]
                                .filter(Boolean)
                                .join(' ') || '-',
                          },
                          {
                            label: 'Contact Number',
                            value: buildPhone(admin),
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
                            <span className="text-neutral-500 min-w-36">
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
                    <p className="text-sm text-neutral-500">-</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProviderGroupDrawer />
    </div>
  );
}
