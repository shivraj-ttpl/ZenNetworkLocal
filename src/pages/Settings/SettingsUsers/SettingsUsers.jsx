import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import ActionDropdown from '@/components/commonComponents/actionDropdown';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';

import { componentKey, setOpenAddDrawer } from './settingsUsersSlice';

import './settingsUsersSaga';
import { settingsUsersActions } from './settingsUsersSaga';

import AddUserDrawer from './Components/AddUserDrawer';
import ViewUserModal from './Components/ViewUserModal';

export default function SettingsUsers() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const {
    drawerOpen,
    drawerMode,
    editData,
    viewModalOpen,
    viewData,
    filters,
    usersData,
    totalRecords,
  } = state || {};

  useEffect(() => {
    dispatch(
      settingsUsersActions.fetchUsers({
        page,
        limit,
        search: search.trim() || undefined,
        showArchived: showArchive || undefined,
        sortBy: sortKey || undefined,
        sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        subOrgId: filters?.subOrganization?.value || undefined,
        status: filters?.status?.value || undefined,
      }),
    );
  }, [dispatch, page, limit, search, showArchive, sortKey, sortOrder, filters]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchive}
          onChange={() => setShowArchive((p) => !p)}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenAddDrawer())}
        >
          <Icon name="Plus" size={14} />
          Add User
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch, filters]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const totalPages = Math.ceil((totalRecords ?? 0) / limit) || 1;

  const tableData = useMemo(
    () =>
      (usersData ?? []).map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [usersData, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'firstName',
          render: (row) => (
            <span className="text-primary-700 font-medium">
              {[row?.firstName, row?.lastName].filter(Boolean).join(' ')}
            </span>
          ),
        },
        {
          id: 'subOrganizations',
          header: 'Sub-Organization',
          accessorKey: 'assignedSubOrgs',
          render: (row) => (
            <span className="text-text-primary">
              {(row?.assignedSubOrgs ?? []).join(', ') || '—'}
            </span>
          ),
        },
        {
          id: 'email',
          header: 'Email Address',
          accessorKey: 'email',
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  row.emailVerified === 'VERIFIED'
                    ? 'bg-success-500'
                    : 'bg-warning-500'
                }`}
              >
                <Icon name="Check" size={10} className="text-white" />
              </span>
            </div>
          ),
        },
        {
          id: 'contactNumber',
          header: 'Contact Number',
          accessorKey: 'contactNumber',
          render: (row) => row?.contactNumber ?? '—',
        },
        {
          id: 'lastLogin',
          header: 'Last Login',
          accessorKey: 'lastLoginAt',
          render: (row) =>
            row?.lastLoginAt
              ? new Date(row.lastLoginAt).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '—',
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          render: (row) => (
            <ToggleSwitch
              checked={row?.status === 'ACTIVE'}
              showLabel={false}
              onChangeCb={() =>
                dispatch(
                  settingsUsersActions.updateUserStatus({
                    userId: row.id,
                    status: row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  }),
                )
              }
            />
          ),
        },
        {
          id: 'actions',
          header: 'Action',
          width: 70,
          align: 'center',
          render: (row) => (
            <ActionDropdown
              options={[
                {
                  label: 'View',
                  value: 'view',
                  onClickCb: () =>
                    dispatch(
                      settingsUsersActions.fetchUserById({
                        userId: row.id,
                        mode: 'view',
                      }),
                    ),
                },
                {
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () =>
                    dispatch(
                      settingsUsersActions.fetchUserById({
                        userId: row.id,
                        mode: 'edit',
                      }),
                    ),
                },
                {
                  label: 'Send Invitation',
                  value: 'sendInvitation',
                  onClickCb: () =>
                    dispatch(settingsUsersActions.sendInvitation({ userId: row.id })),
                },
                row.isArchived
                  ? {
                      label: 'Unarchive',
                      value: 'unarchive',
                      onClickCb: () =>
                        dispatch(settingsUsersActions.unarchiveUser({ userId: row.id })),
                    }
                  : {
                      label: 'Archive',
                      value: 'archive',
                      onClickCb: () =>
                        dispatch(settingsUsersActions.archiveUser({ userId: row.id })),
                    },
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
        data={tableData}
        size="sm"
        maxHeight="calc(100vh - 240px)"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={totalRecords ?? 0}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
      />

      <AddUserDrawer
        open={drawerOpen}
        drawerMode={drawerMode}
        editData={editData}
      />
      <ViewUserModal open={viewModalOpen} viewData={viewData} />
    </div>
  );
}
