import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import { rolesData } from '@/data/settingsData';

export default function SubOrgRolesPermissions() {
  const { subOrgId } = useParams();
  const { setToolbar } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name') || '';
  const qs = nameParam ? `?name=${encodeURIComponent(nameParam)}` : '';

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56 max-w-72">
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
        <Button variant="primaryBlue" size="sm">
          <Icon name="Plus" size={14} />
          Create Roles
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchive, search]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    let data = rolesData;
    if (!showArchive) {
      data = data.filter((row) => row.status);
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter((item) =>
        item.roleName.toLowerCase().includes(term),
      );
    }
    return data;
  }, [search, showArchive]);

  const totalPages = Math.ceil(filteredData.length / limit) || 1;

  const paginatedData = useMemo(
    () =>
      filteredData.slice((page - 1) * limit, page * limit).map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [filteredData, page, limit],
  );

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
          id: 'roleName',
          header: 'Role Name',
          accessorKey: 'roleName',
          render: (row) => (
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/view${qs}`,
                );
              }}
            >
              {row?.roleName}
            </span>
          ),
        },
        {
          id: 'createdBy',
          header: 'Created By',
          accessorKey: 'createdBy',
        },
        {
          id: 'createdDate',
          header: 'Created Date',
          accessorKey: 'createdDate',
        },
        {
          id: 'updateBy',
          header: 'Update By',
          accessorKey: 'updateBy',
        },
        {
          id: 'updateDate',
          header: 'Update Date',
          accessorKey: 'updateDate',
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          render: (row) => (
            <ToggleSwitch
              name={`status-${row.id}`}
              checked={row.status}
              showLabel={false}
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
                    navigate(
                      `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/view${qs}`,
                    ),
                },
                {
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () =>
                    navigate(
                      `/sub-organizations/${subOrgId}/roles-permissions/${row.id}/edit${qs}`,
                    ),
                },
                {
                  label: 'Archive',
                  value: 'archive',
                },
              ]}
            />
          ),
        },
      ]),
    [],
  );

  return (
    <div className="px-5 pb-4">
      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        maxHeight="calc(100vh - 240px)"
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
    </div>
  );
}
