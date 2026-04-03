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
import VerificationIcon from '@/components/commonComponents/verificationIcon/VerificationIcon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { componentKey, setOpenAddDrawer } from './settingsUsersSlice';

import './settingsUsersSaga';
import { settingsUsersActions } from './settingsUsersSaga';

import AddUserDrawer from './Components/AddUserDrawer';
import ViewUserModal from './Components/ViewUserModal';
import useCurrentUserRole from '../../../hooks/getCurrentUserRole';
import { formatDateTime } from '../../../utils/GeneralUtils';

export default function SettingsUsers() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);
  const { isOrgAdmin } = useCurrentUserRole();
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
    totalPages = 0,
    refreshFlag = 0,
  } = state || {};
  const isLoading = useLoadingKey(LOADING_KEYS.SETTINGS_USERS_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(
      settingsUsersActions.fetchUsers({
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        showArchived: showArchive || undefined,
        sortBy: sortKey || undefined,
        sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        subOrgId: filters?.subOrganization?.value || undefined,
        status: filters?.status?.value || undefined,
        userType: isOrgAdmin ? "ORG_PORTAL" : 'SUB_ORG_PORTAL',
      }),
    );
  }, [
    dispatch,
    page,
    limit,
    debouncedSearch,
    showArchive,
    sortKey,
    sortOrder,
    filters?.subOrganization?.value,
    filters?.status?.value,
    refreshFlag,
  ]);

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
  }, [setToolbar, showArchive, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

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
        ...(!isOrgAdmin
          ? [
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
            ]
          : []),

        {
          id: 'email',
          header: 'Email Address',
          accessorKey: 'email',
          render: (row) => (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-text-primary">{row.email}</span>
              <VerificationIcon
                verified={row.emailVerified === 'VERIFIED'}
                size={18}
              />
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
            row?.lastLoginAt ? formatDateTime(row?.lastLoginAt) : '—',
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
                    dispatch(
                      settingsUsersActions.sendInvitation({ userId: row.id }),
                    ),
                },
                row.isArchived
                  ? {
                      label: 'Unarchive',
                      value: 'unarchive',
                      onClickCb: () =>
                        dispatch(
                          settingsUsersActions.unarchiveUser({
                            userId: row.id,
                          }),
                        ),
                    }
                  : {
                      label: 'Archive',
                      value: 'archive',
                      onClickCb: () =>
                        dispatch(
                          settingsUsersActions.archiveUser({ userId: row.id }),
                        ),
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
        loading={isLoading}
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
