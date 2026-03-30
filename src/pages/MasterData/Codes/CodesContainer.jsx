import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useOutletContext,
} from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import RoleGuard from '@/components/RoleGuard/RoleGuard';
import Icon from '@/components/icons/Icon';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';

import { codesActions, registerSaga } from './codeSaga';
import {
  componentKey,
  openImportModal,
  registerReducer,
  resetCodesListState,
  setOpenAddDrawer,
  setSearch,
  setShowArchived,
} from './codesSlice';
import AddAllergySymptomDrawer from './Components/AddAllergySymptomDrawer';
import AddCodeDrawer from './Components/AddCodeDrawer';
import AddMedicationModal from './Components/AddMedicationModal';
import ImportCodes from './Components/ImportCodes';
import {
  CODE_TYPE_MAP,
  PATH_TO_LABEL,
  STANDALONE_CODE_TYPES,
} from './constant';

const { fetchCodes } = codesActions;

const EMPTY_STATE = {};

const TABS = [
  { label: 'ICD Code', path: '/master-data/codes', end: true },
  { label: 'CPT Code', path: '/master-data/codes/cpt' },
  { label: 'LONIC Code', path: '/master-data/codes/lonic' },
  { label: 'SNOMED CT Code', path: '/master-data/codes/snomed-ct' },
  { label: 'HCPCS Code', path: '/master-data/codes/hcpcs' },
  { label: 'Allergies', path: '/master-data/codes/allergies' },
  { label: 'Symptoms', path: '/master-data/codes/symptoms' },
  { label: 'Medication', path: '/master-data/codes/medications' },
];

function getCodeLabel(pathname) {
  const match = Object.entries(PATH_TO_LABEL).find(
    ([path]) => pathname === path,
  );
  return match ? match[1] : 'ICD';
}

export default function CodesContainer() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();

  const {
    search = '',
    showArchived = false,
    page = 1,
    limit = 20,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const codeLabel = useMemo(
    () => getCodeLabel(location.pathname),
    [location.pathname],
  );

  const codeType = useMemo(
    () => CODE_TYPE_MAP[codeLabel] || 'icd',
    [codeLabel],
  );

  const isStandaloneType = useMemo(
    () => STANDALONE_CODE_TYPES.has(codeType),
    [codeType],
  );

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(resetCodesListState());
  }, [dispatch, codeType]);

  useEffect(() => {
    if (isStandaloneType) {
      dispatch(codesActions.fetchStandalone({ type: codeType }));
    } else {
      dispatch(fetchCodes({ type: codeType }));
    }
  }, [
    dispatch,
    codeType,
    isStandaloneType,
    page,
    limit,
    debouncedSearch,
    showArchived,
    refreshFlag,
  ]);

  useEffect(() => {
    setToolbar(
      <>
        <RoleGuard allowedRoles={MASTER_DATA_EDIT_ROLES}>
          {!isStandaloneType && (
            <Button
              variant="outlineBlue"
              size="sm"
              onClick={() => dispatch(openImportModal(codeLabel))}
            >
              <Icon name="Plus" size={14} />
              Import {codeLabel} Codes
            </Button>
          )}
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={() => dispatch(setOpenAddDrawer(codeLabel))}
          >
            <Icon name="Plus" size={14} />
            {isStandaloneType ? `Add ${codeLabel}` : `Add ${codeLabel} Code`}
          </Button>
        </RoleGuard>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, codeLabel, isStandaloneType, dispatch]);

  if (location.pathname === '/master-data/codes/') {
    return <Navigate to="/master-data/codes" replace />;
  }

  return (
    <div className="px-5 pb-4 space-y-3">
      <div className="flex items-center justify-between max-[1149px]:flex-wrap max-[1149px]:gap-3">
        <nav className="flex items-center gap-6 max-[1149px]:gap-4 max-[1149px]:overflow-x-auto">
          {TABS.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `pb-2 text-xs font-normal border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-primary-700 border-primary'
                    : 'text-neutral-400 border-transparent hover:text-neutral-600'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 max-[1149px]:w-full">
          <Checkbox
            label="Show Archive"
            checked={showArchived}
            onChange={() => dispatch(setShowArchived(!showArchived))}
            variant="blue"
            size="sm"
          />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-65 max-[1149px]:min-w-0 max-[1149px]:flex-1">
            <Icon name="Search" size={14} className="text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder={`Search by ${codeLabel} or Description`}
              className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
            />
          </div>
        </div>
      </div>

      <Outlet context={{ codeLabel, codeType }} />

      <AddCodeDrawer />
      <AddAllergySymptomDrawer />
      <AddMedicationModal />
      <ImportCodes />
    </div>
  );
}
