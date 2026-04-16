import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, useParams } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useSubOrgTenantName from '@/hooks/useSubOrgTenantName';
import { useTableHeight } from '@/hooks/useTableHeight';

import EditPatientDrawer from './Components/EditPatientDrawer';
import InactivatePatientModal from './Components/InactivatePatientModal';
import UploadCsvDrawer from './Components/UploadCsvDrawer';
import { patientActions, registerSaga } from './providerGroupPatientsSaga';
import {
  componentKey,
  registerReducer,
  setOpenEditDrawer,
  setOpenInactiveModal,
  setOpenUploadModal,
} from './providerGroupPatientsSlice';

const ALL_ACTION_OPTION = { label: 'All', value: null };

const SELECT_ACTION_OPTIONS = [
  { label: 'Enroll', value: 'Enroll' },
  { label: 'Discharge', value: 'Discharge' },
];

const EMPTY_STATE = {};

export default function ProviderGroupPatients() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const { providerGroupId } = useParams();
  const tenantName = useSubOrgTenantName();
  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const state = useSelector((s) => s[componentKey] ?? EMPTY_STATE);
  const isLoading = useLoadingKey(LOADING_KEYS.PG_PATIENTS_GET_LIST);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showInactivePatients, setShowInactivePatients] = useState(false);
  const [selectAction, setSelectAction] = useState(ALL_ACTION_OPTION);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const {
    patientList = [],
    totalRecords = 0,
    refreshFlag = 0,
    drawerOpen,
    editData,
    uploadModalOpen,
    inactiveModalOpen,
    inactivePatient,
  } = state;

  useEffect(() => {
    if (!providerGroupId || !tenantName) return;
    dispatch(
      patientActions.fetchPatients({
        providerGroupId,
        tenantName,
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(showInactivePatients ? { showDeleted: true } : {}),
        ...(sortKey ? { sortBy: sortKey, sortOrder: sortOrder || 'asc' } : {}),
      }),
    );
  }, [
    dispatch,
    providerGroupId,
    tenantName,
    page,
    limit,
    search,
    showInactivePatients,
    sortKey,
    sortOrder,
    refreshFlag,
  ]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Inactive Patients"
          checked={showInactivePatients}
          onChange={() => {
            setShowInactivePatients((p) => !p);
            setPage(1);
          }}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-40 max-w-72 max-[1149px]:min-w-0 max-[1149px]:max-w-67.5 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Patient ID or First name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
          <button
            type="button"
            onClick={() => dispatch(setSearch(''))}
            className={`text-neutral-400 hover:text-neutral-600 shrink-0 ${search ? 'visible' : 'invisible'}`}
          >
            <Icon name="X" size={14} />
          </button>
        </div>

        <div className="w-34 max-[1149px]:w-auto max-[1149px]:max-w-57.5 max-[1149px]:flex-1 max-[1149px]:min-w-30">
          <SelectDropdown
            name="selectAction"
            placeholder="Select Action"
            options={[ALL_ACTION_OPTION, ...SELECT_ACTION_OPTIONS]}
            value={selectAction}
            isClearable={!!selectAction?.value}
            onChange={(val) => setSelectAction(val ?? ALL_ACTION_OPTION)}
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenUploadModal())}
        >
          <Icon name="Upload" size={14} />
          Upload CSV File
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showInactivePatients, search, selectAction, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const handleUnenroll = useCallback(
    (row) => {
      dispatch(
        patientActions.unenrollPatient({
          id: row.id,
          providerGroupId,
          tenantName,
        }),
      );
    },
    [dispatch, providerGroupId, tenantName],
  );

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  const getActionOptions = useCallback(
    (row) => {
      const options = [
        {
          label: 'Edit',
          value: 'edit',
          onClickCb: () => dispatch(setOpenEditDrawer(row)),
        },
      ];

      if (row.enrollmentStatus === 'Enrolled') {
        options.push({
          label: 'Unenrolled',
          value: 'unenroll',
          onClickCb: () => handleUnenroll(row),
        });
      }

      options.push({
        label: 'Inactive',
        value: 'inactive',
        onClickCb: () => dispatch(setOpenInactiveModal(row)),
      });

      return options;
    },
    [dispatch, handleUnenroll],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: 'patientDisplayId',
          header: 'Patients ID',
          accessorKey: 'patientDisplayId',
          render: (row) => (
            <span className="text-primary-700 font-medium">
              {row.patientDisplayId || '-'}
            </span>
          ),
        },
        { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
        { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
        {
          id: 'dateOfBirth',
          header: 'Date of Birth',
          accessorKey: 'dateOfBirth',
        },
        {
          id: 'primaryCareManager',
          header: 'Primary Care Manager',
          accessorKey: 'primaryCareManager',
        },
        {
          id: 'secondaryCareManager',
          header: 'Secondary Care Manager',
          accessorKey: 'secondaryCareManager',
        },
        {
          id: 'enrollmentStatus',
          header: 'Enrollment Status',
          accessorKey: 'enrollmentStatus',
          render: (row) => (
            <span
              className={
                row.enrollmentStatus === 'Enrolled'
                  ? 'text-success-700 font-medium'
                  : 'text-neutral-500'
              }
            >
              {row.enrollmentStatus || '-'}
            </span>
          ),
        },
        {
          id: 'enrolledPrograms',
          header: 'Enrolled Programs',
          accessorKey: 'enrolledPrograms',
          render: (row) => {
            if (!row.enrolledPrograms?.length)
              return <span className="text-neutral-400">-</span>;
            return (
              <div className="flex items-center gap-1">
                {row.enrolledPrograms.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700"
                  >
                    {p}
                  </span>
                ))}
              </div>
            );
          },
        },
        {
          id: 'actions',
          header: 'Action',
          width: 70,
          align: 'center',
          render: (row) => <ActionDropdown options={getActionOptions(row)} />,
        },
      ]),
    [getActionOptions],
  );

  return (
    <div className="px-5 pb-4" ref={tableRef}>
      <Table
        columns={columns}
        data={patientList}
        size="sm"
        maxHeight={tableMaxHeight}
        selectable={true}
        selectId="id"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        isLoading={isLoading}
      />
      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />
      <EditPatientDrawer open={drawerOpen} editData={editData} />
      <UploadCsvDrawer open={uploadModalOpen} />
      <InactivatePatientModal
        open={inactiveModalOpen}
        patient={inactivePatient}
      />
    </div>
  );
}
