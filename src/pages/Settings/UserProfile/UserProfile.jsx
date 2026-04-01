import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';
import {
  orgAdminUserProfile,
  subOrgAdminUserProfile,
} from '@/data/settingsData';
import { useDispatch, useSelector } from 'react-redux';
import {
  componentKey,
  setCloseDrawer,
  setOpenEditDrawer,
} from './userProfileSlice';
import EditSubOrganizationProfileDrawer from './Components/EditSubOrganizationProfileDrawer';
import useCurrentUserRole from '../../../hooks/getCurrentUserRole';
import EditOrganizationUserProfileDrawer from './Components/EditOrganizationUserProfileDrawer';
import { settingsProfileActions } from '../SettingsProfile/settingsProfileSaga';
import { useEffect } from 'react';

function formatAddress(val) {
  if (!val || typeof val !== 'object') return val;
  return [val.addressLine1, val.addressLine2, val.city, val.state, val.zipCode, val.country]
    .filter(Boolean)
    .join(', ') || '—';
}

function LabelValue({ label, value, isLink }) {
  const display = value && typeof value === 'object' ? formatAddress(value) : value;
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
  return (
    <div className="space-y-5">
      <div className="border border-border-light rounded-lg p-5">
        <div className="flex items-start gap-4">
          <Avatar name={profile.name} size="xl" variant="square" />
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="space-y-2">
              <LabelValue label="Name" value={profile.name} />
              <LabelValue label="Email Address" value={profile.email} isLink />
              <LabelValue label="Address" value={profile.address} />
            </div>
            <div className="space-y-2">
              <LabelValue label="Role Name" value={profile.roleName} />
              <LabelValue
                label="Contact Number"
                value={profile.contactNumber}
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
            value: profile.stats.subOrganizations,
          },
          {
            icon: 'users-round',
            label: 'Provider Group',
            value: profile.stats.providerGroup,
          },
          {
            icon: 'Stethoscope',
            label: 'Total Providers',
            value: profile.stats.totalProviders,
          },
          {
            icon: 'user-round-check',
            label: 'Total Patient',
            value: profile.stats.totalPatient,
          },
          {
            icon: 'users-round',
            label: 'System Users',
            value: profile.stats.systemUsers,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border-light rounded-lg p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <Icon name={stat.icon} size={18} className="text-primary-600" />
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
            Organization Details
          </h3>
          <div className="space-y-3">
            <LabelValue
              label="Organization Name"
              value={profile.organizationDetails.organizationName}
            />
            <LabelValue
              label="Organization Legal Name"
              value={profile.organizationDetails.organizationLegalName}
            />
            <LabelValue
              label="Tax ID"
              value={profile.organizationDetails.taxId}
            />
          </div>

          <h3 className="text-sm font-semibold text-text-primary mt-6 mb-4 border-b border-border-light pb-2">
            Contact Information
          </h3>
          <div className="space-y-3">
            <LabelValue
              label="Email Address"
              value={profile.contactInfo.emailAddress}
              isLink
            />
            <LabelValue
              label="Contact Number"
              value={profile.contactInfo.contactNumber}
            />
            <LabelValue label="Fax" value={profile.contactInfo.fax} />
            <LabelValue
              label="Website"
              value={profile.contactInfo.website}
              isLink
            />
            <LabelValue label="Address" value={profile.contactInfo.address} />
          </div>

          <h3 className="text-sm font-semibold text-text-primary mt-6 mb-4 border-b border-border-light pb-2">
            Organization Details
          </h3>
          <div className="space-y-3">
            <LabelValue
              label="Created On"
              value={profile.organizationExtraDetails.createdOn}
            />
            <LabelValue
              label="Organization Type"
              value={profile.organizationExtraDetails.organizationType}
            />
            <LabelValue
              label="Description"
              value={profile.organizationExtraDetails.description}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
            Administrative contact
          </h3>
          <div className="space-y-6">
            {profile.adminContacts.map((contact, idx) => (
              <div key={idx} className="space-y-3">
                <LabelValue label="Administrator Name" value={contact.name} />
                <LabelValue
                  label="Email Address"
                  value={contact.emailAddress}
                  isLink
                />
                <LabelValue
                  label="Contact Number"
                  value={contact.contactNumber}
                />
              </div>
            ))}
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

export function SubOrgAdminProfile({ profile }) {
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '—';
  const roleLabel =
    USER_TYPE_LABELS[profile?.userType] ?? profile?.userType ?? '—';
  const statusLabel = formatStatus(profile?.status);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-4">
        {[
          {
            icon: 'Building2',
            label: 'Sub-Organizations',
            value: profile?.stats?.subOrganizations,
          },
          {
            icon: 'users-round',
            label: 'Provider Group',
            value: profile?.stats?.providerGroup,
          },
          {
            icon: 'Stethoscope',
            label: 'Total Providers',
            value: profile?.stats?.totalProviders,
          },
          {
            icon: 'user-round-check',
            label: 'Total Patient',
            value: profile?.stats?.totalPatient,
          },
          {
            icon: 'users-round',
            label: 'System Users',
            value: profile?.stats?.systemUsers,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border-light rounded-lg p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
              <Icon name={stat.icon} size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">{stat.label}</p>
              <p className="text-lg font-semibold text-text-primary">
                {stat.value ?? '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-border-light rounded-lg p-5">
          <div className="flex items-start gap-4">
            <Avatar
              src={profile?.profilePhotoUrl}
              name={fullName}
              size="xl"
              variant="square"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-neutral-500 min-w-36 shrink-0">Name</span>
                <span className="text-neutral-500">:</span>
                <div className="flex items-center w-full justify-between  gap-2">
                  <span className="text-text-primary">{fullName}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#287F7C] bg-[#EAF5F5] px-2 py-0.5 rounded-full">
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

        <div className="border border-border-light rounded-lg p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Other
          </h3>
          <div className="space-y-3">
            <LabelValue label="Role" value={roleLabel} />
            <div className="flex items-start gap-2 text-sm">
              <span className="text-neutral-500 min-w-36 shrink-0">
                Sub-Organization
              </span>
              <span className="text-neutral-500">:</span>
              <div className="space-y-1">
                {(profile?.assignedSubOrgs ?? []).map((org, i) => (
                  <p key={i} className="text-text-primary">
                    {org}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { drawerOpen } = useSelector((state) => state[componentKey] || {});
  // const { profileData } = useSelector();
  const { isOrgAdmin } = useCurrentUserRole();
  const profile = isOrgAdmin ? orgAdminUserProfile : subOrgAdminUserProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(settingsProfileActions.fetchProfile());
  }, [dispatch]);
  return (
    <div className="bg-surface h-full rounded-xl border border-border-light overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-base font-semibold text-text-primary">
          {isOrgAdmin ? 'Profile' : 'Profile'}
        </h2>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenEditDrawer())}
        >
          <Icon name="Pencil" size={14} />
          Edit Profile
        </Button>
      </div>
      <div className="px-5 pb-5">
        {isOrgAdmin ? (
          <OrgAdminProfile profile={profile} />
        ) : (
          <SubOrgAdminProfile profile={profile} />
        )}
      </div>
      {isOrgAdmin ? (
        <EditOrganizationUserProfileDrawer
          open={drawerOpen}
          handleClose={() => dispatch(setCloseDrawer())}
          editData={profile}
        />
      ) : (
        <EditSubOrganizationProfileDrawer
          open={drawerOpen}
          handleClose={() => dispatch(setCloseDrawer())}
          editData={profile}
        />
      )}
    </div>
  );
}
