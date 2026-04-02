import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import ActionDropdown from '@/components/commonComponents/actionDropdown';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';

import {
  componentKey,
  setOpenCreateRoleModal,
} from './settingsRolesPermissionsSlice';
import './settingsRolesPermissionsSaga';
import { settingsRolesActions } from './settingsRolesPermissionsSaga';

import CreateRoleModal from './Components/CreateRoleModal';

export default function SettingsRolesPermissions() {
  const { setToolbar } = useOutletContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { createRoleModalOpen, rolesData, totalRecords, refreshFlag = 0 } = state || {};

  useEffect(() => {
    dispatch(
      settingsRolesActions.fetchRoles({
        page,
        limit,
        search: search.trim() || undefined,
        showArchived: showArchive || undefined,
        sortBy: sortKey || undefined,
        sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
      }),
    );
  }, [dispatch, page, limit, search, showArchive, sortKey, sortOrder, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchive}
          onChange={() => {
            setShowArchive((p) => !p);
            setPage(1);
          }}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Role Name..."
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
          onClick={() => dispatch(setOpenCreateRoleModal())}
        >
          <Icon name="Plus" size={14} />Create Roles
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search, dispatch]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const handleRowClick = useCallback(
    (roleId) => {
      navigate(`/settings/roles-permissions/${roleId}/view`);
    },
    [navigate],
  );

  const totalPages = Math.ceil((totalRecords ?? 0) / limit) || 1;

  const tableData = useMemo(
    () =>
      (rolesData ?? []).map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [rolesData, page, limit],
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: 'srNo',
          header: 'Sr. No',
          accessorKey: 'srNo',
          width: 70,
        },
        {
          id: 'name',
          header: 'Role Name',
          accessorKey: 'name',
          render: (row) => (
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row?.id);
              }}
            >
              {row?.name}
            </span>
          ),
        },
        {
          id: 'roleType',
          header: 'Role Type',
          accessorKey: 'roleType',
        },
        {
          id: 'createdAt',
          header: 'Created Date',
          accessorKey: 'createdAt',
          render: (row) => formatDate(row?.createdAt),
        },
        {
          id: 'updatedAt',
          header: 'Updated Date',
          accessorKey: 'updatedAt',
          render: (row) => formatDate(row?.updatedAt),
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status === 'ACTIVE'}
              showLabel={false}
              onChangeCb={() =>
                dispatch(
                  settingsRolesActions.updateRoleStatus({
                    roleId: row.id,
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
          render: (row) => {
            const options = [
              {
                label: 'View',
                value: 'view',
                onClickCb: () =>
                  navigate(`/settings/roles-permissions/${row.id}/view`),
              },
              {
                label: 'Edit',
                value: 'edit',
                onClickCb: () =>
                  navigate(`/settings/roles-permissions/${row.id}/edit`),
              },
            ];

            if (showArchive) {
              options.push({
                label: 'Unarchive',
                value: 'unarchive',
                onClickCb: () =>
                  dispatch(
                    settingsRolesActions.archiveRole({ roleId: row.id, isArchived: true }),
                  ),
              });
            } else {
              options.push({
                label: 'Archive',
                value: 'archive',
                onClickCb: () =>
                  dispatch(
                    settingsRolesActions.archiveRole({ roleId: row.id, isArchived: false }),
                  ),
              });
            }

            return <ActionDropdown options={options} />;
          },
        },
      ]),
    [navigate, handleRowClick, dispatch, showArchive],
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

      <CreateRoleModal open={createRoleModalOpen} />
    </div>
  );
}
