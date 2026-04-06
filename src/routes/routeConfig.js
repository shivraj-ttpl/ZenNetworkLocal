import { lazy } from 'react';

// Lazy-loaded pages

// Container layouts (render <Outlet />)
const MasterDataContainer = lazy(
  () => import('@/containers/MasterData/MasterDataContainer'),
);
const SubOrganizationsContainer = lazy(
  () => import('@/containers/SubOrganizations/SubOrganizationsContainer'),
);
const SettingsContainer = lazy(
  () => import('@/containers/Settings/SettingsContainer'),
);

// Sub-Organizations — pages
const SubOrgList = lazy(
  () => import('@/pages/SubOrganizations/SubOrgList/SubOrgList'),
);
const SubOrgDetailContainer = lazy(
  () => import('@/pages/SubOrganizations/SubOrgDetail/SubOrgDetailContainer'),
);
const SubOrgProfile = lazy(
  () => import('@/pages/SubOrganizations/SubOrgProfile/SubOrgProfile'),
);
const ProviderGroupList = lazy(
  () => import('@/pages/SubOrganizations/ProviderGroupList/ProviderGroupList'),
);
const ProviderGroupDetailContainer = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupDetail/ProviderGroupDetailContainer'),
);
const ProviderGroupProfile = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupProfile/ProviderGroupProfile'),
);
const ProviderGroupProviders = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupProviders/ProviderGroupProviders'),
);
const ProviderGroupPatients = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupPatients/ProviderGroupPatients'),
);
const ProviderGroupUsers = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupUsers/ProviderGroupUsers'),
);
const ProviderGroupConfiguration = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupConfiguration/ProviderGroupConfiguration'),
);
const ProviderGroupProviderAvailability = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupProviderAvailability/ProviderGroupProviderAvailability'),
);
const ProviderGroupFeeSchedule = lazy(
  () =>
    import('@/pages/SubOrganizations/ProviderGroupFeeSchedule/ProviderGroupFeeSchedule'),
);

// Sub-Organizations — scoped settings pages (SUB_ORG_ADMIN)
const SubOrgRolesPermissions = lazy(
  () =>
    import('@/pages/SubOrganizations/SubOrgRolesPermissions/SubOrgRolesPermissions'),
);
const SubOrgViewRolePermissions = lazy(
  () =>
    import('@/pages/SubOrganizations/SubOrgRolesPermissions/SubOrgViewRolePermissions'),
);
const SubOrgEditRolePermissions = lazy(
  () =>
    import('@/pages/SubOrganizations/SubOrgRolesPermissions/SubOrgEditRolePermissions'),
);
const SubOrgReports = lazy(
  () => import('@/pages/SubOrganizations/SubOrgReports/SubOrgReports'),
);
const SubOrgLabels = lazy(
  () => import('@/pages/SubOrganizations/SubOrgLabels/SubOrgLabels'),
);

// Master Data — Codes sub-container + pages
const CodesContainer = lazy(
  () => import('@/pages/MasterData/Codes/CodesContainer'),
);
const ICDCodes = lazy(() => import('@/pages/MasterData/Codes/ICDCodes'));
const CPTCodes = lazy(() => import('@/pages/MasterData/Codes/CPTCodes'));
const LONICCodes = lazy(() => import('@/pages/MasterData/Codes/LONICCodes'));
const SNOMEDCTCodes = lazy(
  () => import('@/pages/MasterData/Codes/SNOMEDCTCodes'),
);
const HCPCSCodes = lazy(() => import('@/pages/MasterData/Codes/HCPCSCodes'));
const AllergiesCodes = lazy(
  () => import('@/pages/MasterData/Codes/AllergiesCodes'),
);
const SymptomsCodes = lazy(
  () => import('@/pages/MasterData/Codes/SymptomsCodes'),
);
const MedicationsCodes = lazy(
  () => import('@/pages/MasterData/Codes/MedicationsCodes'),
);

// Master Data — standalone pages
const Conditions = lazy(
  () => import('@/pages/MasterData/Conditions/Conditions'),
);
const CarePlans = lazy(() => import('@/pages/MasterData/CarePlans/CarePlans'));
const Assessments = lazy(
  () => import('@/pages/MasterData/Assessments/Assessments'),
);
const Payers = lazy(() => import('@/pages/MasterData/Payers/Payers'));
const Education = lazy(() => import('@/pages/MasterData/Education/Education'));

// Settings — pages
const SettingsProfile = lazy(
  () => import('@/pages/Settings/SettingsProfile/SettingsProfile'),
);
const SettingsUsers = lazy(
  () => import('@/pages/Settings/SettingsUsers/SettingsUsers'),
);
const SettingsRolesPermissions = lazy(
  () =>
    import('@/pages/Settings/SettingsRolesPermissions/SettingsRolesPermissions'),
);
const ViewRolePermissions = lazy(
  () => import('@/pages/Settings/SettingsRolesPermissions/ViewRolePermissions'),
);
const EditRolePermissions = lazy(
  () => import('@/pages/Settings/SettingsRolesPermissions/EditRolePermissions'),
);
const SettingsReports = lazy(
  () => import('@/pages/Settings/SettingsReports/SettingsReports'),
);
const SettingsLabels = lazy(
  () => import('@/pages/Settings/SettingsLabels/SettingsLabels'),
);
const SettingsAuditLog = lazy(
  () => import('@/pages/Settings/SettingsAuditLog/SettingsAuditLog'),
);

// User Profile (accessible from avatar dropdown)
const UserProfile = lazy(
  () => import('@/pages/Settings/UserProfile/UserProfile'),
);

/**
 * Protected route config.
 *
 * Container routes have `nav: true` (shown in navbar) and `children`.
 * Each child is a sub-page rendered inside the container's <Outlet />.
 * `index: true` marks the default child route.
 */
export const routeConfig = [
  {
    path: '/master-data',
    element: MasterDataContainer,
    label: 'Master Data',
    nav: true,
    icon: 'Database',
    children: [
      {
        path: 'codes',
        element: CodesContainer,
        label: 'Codes',
        children: [
          { index: true, element: ICDCodes, label: 'ICD Code' },
          { path: 'cpt', element: CPTCodes, label: 'CPT Code' },
          { path: 'lonic', element: LONICCodes, label: 'LONIC Code' },
          {
            path: 'snomed-ct',
            element: SNOMEDCTCodes,
            label: 'SNOMED CT Code',
          },
          { path: 'hcpcs', element: HCPCSCodes, label: 'HCPCS Code' },
          { path: 'allergies', element: AllergiesCodes, label: 'Allergies' },
          { path: 'symptoms', element: SymptomsCodes, label: 'Symptoms' },
          {
            path: 'medications',
            element: MedicationsCodes,
            label: 'Medication',
          },
        ],
      },
      { path: 'conditions', element: Conditions, label: 'Condition' },
      { path: 'care-plans', element: CarePlans, label: 'Care Plans' },
      { path: 'assessments', element: Assessments, label: 'Assessments' },
      { path: 'payers', element: Payers, label: 'Payers' },
      { path: 'education', element: Education, label: 'Education' },
    ],
  },
  {
    path: '/sub-organizations',
    element: SubOrganizationsContainer,
    label: 'Sub-Organizations',
    nav: true,
    icon: 'suborg',
    children: [
      { index: true, element: SubOrgList, label: 'Sub-Organizations List' },
      {
        path: ':subOrgId',
        element: SubOrgDetailContainer,
        children: [
          { index: true, element: SubOrgProfile, label: 'Profile' },
          {
            path: 'provider-groups',
            element: ProviderGroupList,
            label: 'Provider Group',
          },
          {
            path: 'roles-permissions',
            element: SubOrgRolesPermissions,
            label: 'Roles & Permissions',
          },
          {
            path: 'roles-permissions/:roleId/view',
            element: SubOrgViewRolePermissions,
            label: 'View Permissions',
          },
          {
            path: 'roles-permissions/:roleId/edit',
            element: SubOrgEditRolePermissions,
            label: 'Edit Permissions',
          },
          {
            path: 'reports',
            element: SubOrgReports,
            label: 'Reports',
          },
          {
            path: 'labels',
            element: SubOrgLabels,
            label: 'Labels',
          },
          {
            path: 'provider-groups/:providerGroupId',
            element: ProviderGroupDetailContainer,
            children: [
              { index: true, element: ProviderGroupProfile, label: 'Profile' },
              {
                path: 'providers',
                element: ProviderGroupProviders,
                label: 'Providers',
              },
              {
                path: 'patients',
                element: ProviderGroupPatients,
                label: 'Patients',
              },
              { path: 'users', element: ProviderGroupUsers, label: 'Users' },
              {
                path: 'configuration',
                element: ProviderGroupConfiguration,
                label: 'Configuration',
              },
              {
                path: 'provider-availability',
                element: ProviderGroupProviderAvailability,
                label: 'Provider Availability',
              },
              {
                path: 'fee-schedule',
                element: ProviderGroupFeeSchedule,
                label: 'Fee Schedule',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/settings',
    element: SettingsContainer,
    label: 'Settings',
    nav: true,
    icon: 'Settings',
    children: [
      { path: 'profile', element: SettingsProfile, label: 'Profile' },
      { path: 'users', element: SettingsUsers, label: 'Users' },
      {
        path: 'roles-permissions',
        element: SettingsRolesPermissions,
        label: 'Roles & Permissions',
      },
      {
        path: 'roles-permissions/:roleId/view',
        element: ViewRolePermissions,
        label: 'View Permissions',
      },
      {
        path: 'roles-permissions/:roleId/edit',
        element: EditRolePermissions,
        label: 'Edit Permissions',
      },
      { path: 'reports', element: SettingsReports, label: 'Reports' },
      { path: 'labels', element: SettingsLabels, label: 'Labels' },
      { path: 'audit-log', element: SettingsAuditLog, label: 'Audit Log' },
    ],
  },
  {
    path: '/user-profile',
    element: UserProfile,
    label: 'User Profile',
  },
];

// Public-only routes (redirect to master data if already logged in)
export const publicRouteConfig = [
  {
    path: '/login',
    element: lazy(() => import('@/pages/Auth/Login')),
    label: 'Login',
  },
  {
    path: '/forgot-password',
    element: lazy(() => import('@/pages/Auth/ForgotPassword')),
    label: 'Forgot Password',
  },
  {
    path: '/reset-password',
    element: lazy(() => import('@/pages/Auth/ResetPassword')),
    label: 'Reset Password',
  },
  {
    path: '/set-password',
    element: lazy(() => import('@/pages/Auth/SetPassword')),
    label: 'Set Password',
  },
];

// Shared routes — accessible both publicly AND when logged in
export const sharedRouteConfig = [];
