import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import ModalComponent from '@/components/commonComponents/modal/ModalComponent';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import {
  componentKey,
  setCloseViewModal,
} from '../providerGroupProvidersSlice';

const EMPTY_STATE = {};

export default function ViewProviderModal() {
  const dispatch = useDispatch();
  const { viewModalOpen = false, providerDetail = null } = useSelector(
    (state) => state[componentKey] ?? EMPTY_STATE,
  );

  const isLoading = useLoadingKey(
    LOADING_KEYS.PROVIDER_GROUP_PROVIDERS_GET_BY_ID,
  );

  const handleClose = () => {
    dispatch(setCloseViewModal());
  };

  const profile = providerDetail || {};
  const fullName =
    `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '—';
  const address = profile.address
    ? [
        profile.address.addressLine1,
        profile.address.addressLine2,
        profile.address.city,
        profile.address.state,
        profile.address.country,
        profile.address.zipCode,
      ]
        .filter(Boolean)
        .join(', ')
    : '—';

  const infoRows = [
    [
      { label: 'Full Name', value: fullName },
      {
        label: 'Specialties',
        value: profile.specialties?.join(', ') || '—',
      },
    ],
    [
      { label: 'Provider Group', value: profile.providerGroupName || '—' },
      { label: 'Primary Role', value: profile.primaryRoleTitle || '—' },
    ],
    [
      { label: 'Gender', value: profile.gender || '—' },
      { label: 'Secondary Role', value: profile.secondaryRoleTitle || '—' },
    ],
    [
      { label: 'Email Address', value: profile.email || '—', isLink: true },
      { label: 'NPI Number', value: profile.npiNumber || '—' },
    ],
    [
      { label: 'Language', value: profile.language || '—' },
      { label: 'State License', value: profile.stateLicense || '—' },
    ],
    [
      {
        label: 'Contact Number',
        value: profile.contactNumber
          ? `${profile.countryCode || ''} ${profile.contactNumber}`
          : '—',
      },
      {
        label: 'Year Of Experience',
        value: profile.yearsOfExperience || '—',
      },
    ],
    [
      { label: 'Provider Type', value: profile.providerType || '—' },
      { label: 'Timezone', value: profile.timezone || '—' },
    ],
  ];

  const title = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm sm:text-base font-medium">
        {fullName || 'Provider Profile'}
      </span>
      {profile.status && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-[#287F7C] bg-neutral-100">
          <span className="w-1.5 h-1.5 rounded-full bg-[#287F7C]" />
          {profile.status}
        </span>
      )}
    </div>
  );

  return (
    <ModalComponent
      title={title}
      open={viewModalOpen}
      close={handleClose}
      customClasses="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[70%] xl:w-[60%] max-w-[1000px]"
      maxChildrenHeight="max-h-[70vh] md:max-h-[80vh]"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400">
          Loading provider details...
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 flex justify-center md:block">
            <Avatar name={fullName} size="6xl" variant="square" />
          </div>
          <div className="flex-1 flex flex-col gap-2.5">
            {infoRows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-6"
              >
                {row.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-2 text-sm py-0.5"
                  >
                    <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
                      {item.label}
                    </span>
                    <span className="text-neutral-400">:</span>
                    {item.isLink ? (
                      <a
                        href={`mailto:${item.value}`}
                        className="text-primary-700 hover:underline break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-text-primary break-words">
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-start gap-2 text-sm py-0.5">
              <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
                Address
              </span>
              <span className="text-neutral-400">:</span>
              <span className="text-text-primary break-words">{address}</span>
            </div>

            <div className="flex items-start gap-2 text-sm py-0.5">
              <span className="text-neutral-500 min-w-[120px] sm:min-w-[140px] shrink-0">
                Bio
              </span>
              <span className="text-neutral-400">:</span>
              <span className="text-text-primary break-words">
                {profile.bio || '—'}
              </span>
            </div>
          </div>
        </div>
      )}
    </ModalComponent>
  );
}
