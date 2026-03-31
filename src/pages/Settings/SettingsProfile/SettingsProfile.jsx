import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/commonComponents/avatar/Avatar';
import Button from '@/components/commonComponents/button/Button';
import Icon from '@/components/icons/Icon';
import useCurrentUserRole from '@/hooks/getCurrentUserRole';
import { SubOrgAdminProfile } from '@/pages/Settings/UserProfile/UserProfile';
import EditSubOrganizationProfileDrawer from '@/pages/Settings/UserProfile/Components/EditSubOrganizationProfileDrawer';

import './settingsProfileSaga';
import { settingsProfileActions } from './settingsProfileSaga';
import EditOrganizationProfileDrawer from './Components/EditOrganizationProfileDrawer';
import { componentKey, setOpenEditDrawer, setCloseDrawer } from './settingsProfileSlice';

const STATS = [
  { icon: 'Building2', label: 'Sub-Organizations', key: 'subOrganizations' },
  { icon: 'users-round', label: 'Provider Group', key: 'providerGroup' },
  { icon: 'Stethoscope', label: 'Total Providers', key: 'totalProviders' },
  { icon: 'user-round-check', label: 'Total Patient', key: 'totalPatient' },
  { icon: 'Monitor', label: 'System Users', key: 'systemUsers' },
];

const CONTACT_FIELDS = [
  { label: 'Email Address', key: 'emailAddress', isLink: true },
  { label: 'Contact Number', key: 'contactNumber' },
  { label: 'Fax', key: 'fax' },
  { label: 'Website', key: 'website', isLink: true },
  { label: 'Address', key: 'address' },
];

const ORG_DETAIL_FIELDS = [
  { label: 'Created On', key: 'createdOn' },
  { label: 'Organization Type', key: 'organizationType' },
  { label: 'Description', key: 'description' },
];

const ADMIN_FIELDS = [
  { label: 'Administrator Name', key: 'name' },
  { label: 'Email Address', key: 'emailAddress', isLink: true },
  { label: 'Contact Number', key: 'contactNumber' },
];

function LabelValue({ label, value, isLink }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-neutral-500 min-w-32">{label}</span>
      <span className="text-neutral-500">:</span>
      {isLink ? (
        <a href="#" className="text-primary-700 hover:underline">
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
  useEffect(() => {
    dispatch(settingsProfileActions.fetchProfile());
  }, [dispatch]);

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

  if (!isOrgAdmin) {
    return (
      <>
        <div className="px-5 pb-5">
          <SubOrgAdminProfile profile={profileData} />
        </div>
        <EditSubOrganizationProfileDrawer
          open={drawerOpen}
          handleClose={() => dispatch(setCloseDrawer())}
          editData={editData}
        />
      </>
    );
  }


  return (
    <>
      <div className="px-5 pb-5">
        <div className="border border-border-light rounded-lg p-5">
          <div className="flex items-start gap-4 mb-6">
            <Avatar name={profileData?.name} size="xl" variant="square" />
            <div className="flex-1 gap-3">
              <span className="text-base font-medium text-text-primary">
                {profileData?.name}
              </span>
              <div className="space-y-1.5 text-sm mt-3">
                <LabelValue label="Legal Name" value={profileData?.legalName} />
                <LabelValue label="License Number" value={profileData?.licenseNumber} />
                <LabelValue label="Tax ID" value={profileData?.taxId} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="border border-border-light rounded-lg p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <Icon name={stat.icon} size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-lg font-semibold text-text-primary">
                  {profileData?.stats?.[stat.key] ?? '—'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                {CONTACT_FIELDS.map((item) => (
                  <LabelValue
                    key={item.key}
                    label={item.label}
                    value={profileData?.contactInfo?.[item.key]}
                    isLink={item.isLink}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
                Organization Details
              </h3>
              <div className="space-y-3">
                {ORG_DETAIL_FIELDS.map((item) => (
                  <LabelValue
                    key={item.key}
                    label={item.label}
                    value={profileData?.organizationDetails?.[item.key]}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4 border-b border-border-light pb-2">
              Administrative Contact
            </h3>
            <div className="space-y-6">
              {(profileData?.adminContacts ?? []).map((contact, idx) => (
                <div key={idx} className="space-y-3">
                  {ADMIN_FIELDS.map((item) => (
                    <LabelValue
                      key={`${idx}-${item.key}`}
                      label={item.label}
                      value={contact[item.key]}
                      isLink={item.isLink}
                    />
                  ))}
                </div>
              ))}
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
