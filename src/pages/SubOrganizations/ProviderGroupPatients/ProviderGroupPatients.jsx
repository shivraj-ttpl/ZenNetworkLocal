import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import {
  patientsData,
  SELECT_ACTION_OPTIONS,
} from '@/data/subOrganizationsData';

import EditPatientDrawer from './Components/EditPatientDrawer';
import UploadCsvDrawer from './Components/UploadCsvDrawer';
import {
  componentKey,
  setOpenEditDrawer,
  setOpenUploadModal,
} from './providerGroupPatientsSlice';

export default function ProviderGroupPatients() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showInactivePatients, setShowInactivePatients] = useState(false);
  const [selectAction, setSelectAction] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { drawerOpen, editData, uploadModalOpen } = useSelector(
    (state) => state[componentKey] ?? {},
  );

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Inactive Patients"
          checked={showInactivePatients}
          onChange={() => setShowInactivePatients((p) => !p)}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface w-40">
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
        </div>

        <div className="w-34">
          <SelectDropdown
            name="selectAction"
            placeholder="Select Action"
            options={SELECT_ACTION_OPTIONS}
            value={selectAction}
            onChange={(val) => setSelectAction(val)}
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

  const filteredData = useMemo(() => {
    let data = patientsData;
    if (!showInactivePatients) {
      data = data.filter((row) => !row.inactive);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.patientId.toLowerCase().includes(term) ||
          item.firstName.toLowerCase().includes(term),
      );
    }
    return data;
  }, [search, showInactivePatients]);

  const totalPages = Math.ceil(filteredData.length / limit) || 1;

  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * limit, page * limit),
    [filteredData, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: 'patientId',
          header: 'Patients ID',
          accessorKey: 'patientId',
          render: (row) => (
            <span className="text-primary-700 font-medium">
              {row.patientId}
            </span>
          ),
        },
        { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
        { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
        { id: 'dob', header: 'Date of Birth', accessorKey: 'dob' },
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
              {row.enrollmentStatus}
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
          render: (row) => (
            <ActionDropdown
              options={[
                { label: 'View', value: 'view', onClickCb: () => {} },
                {
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () => dispatch(setOpenEditDrawer(row)),
                },
                { label: 'Archive', value: 'archive', onClickCb: () => {} },
              ]}
            />
          ),
        },
      ]),
    [dispatch],
  );

  return (
    <div className="px-5 pb-4">
      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        maxHeight="475px"
        selectable={true}
        selectId="patientId"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={filteredData.length}
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
    </div>
  );
}
