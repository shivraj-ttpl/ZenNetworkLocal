import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { auditLogData } from '@/data/settingsData';

export default function SettingsAuditLog() {
  const { setToolbar } = useOutletContext();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    setToolbar(
      <>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-56">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by User Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <button className="border border-border rounded-lg p-1.5 cursor-pointer hover:bg-neutral-50">
          <Icon
            name="SlidersHorizontal"
            size={16}
            className="text-neutral-500"
          />
        </button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, search]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const filteredData = useMemo(() => {
    if (!search) return auditLogData;
    const term = search.toLowerCase();
    return auditLogData.filter((item) =>
      item.user.toLowerCase().includes(term),
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / limit);

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
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        { id: 'user', header: 'User', accessorKey: 'user' },
        { id: 'module', header: 'Module', accessorKey: 'module' },
        { id: 'action', header: 'Action', accessorKey: 'action' },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
        },
        { id: 'dateTime', header: 'Date & Time', accessorKey: 'dateTime' },
        { id: 'ipAddress', header: 'IP Address', accessorKey: 'ipAddress' },
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
