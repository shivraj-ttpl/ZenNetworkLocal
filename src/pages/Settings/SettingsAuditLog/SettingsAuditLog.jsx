import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import { formatDateTime } from '@/utils/GeneralUtils';

import FilterDropdown from './Components/FilterDropdown';
import { settingsAuditLogActions, registerSaga } from './settingsAuditLogSaga';
import { componentKey, registerReducer } from './settingsAuditLogSlice';

export default function SettingsAuditLog() {
  const { setToolbar } = useOutletContext();
  const dispatch = useDispatch();
  const state = useSelector((s) => s[componentKey]);
  const isLoading = useLoadingKey(LOADING_KEYS.SETTINGS_AUDIT_LOGS_GET_LIST);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { auditLogs, total, totalPages: totalPagesFromState, filters } = state || {};

  useEffect(() => {
    dispatch(
      settingsAuditLogActions.fetchAuditLogs({
        page,
        limit,
        sortBy: sortKey || undefined,
        sortOrder: sortKey ? (sortOrder ?? 'desc') : undefined,
        action: filters?.action?.value || undefined,
        startDate: filters?.startDate || undefined,
        endDate: filters?.endDate || undefined,
      }),
    );
  }, [dispatch, page, limit, sortKey, sortOrder, filters?.action?.value, filters?.startDate, filters?.endDate]);

  useEffect(() => {
    setToolbar(<FilterDropdown filters={filters} />);
    return () => setToolbar(null);
  }, [setToolbar, filters]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const totalPages = totalPagesFromState ?? (Math.ceil((total ?? 0) / limit) || 1);

  const tableData = useMemo(
    () =>
      (auditLogs ?? []).map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [auditLogs, page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        {
          id: 'user',
          header: 'User',
          accessorKey: 'user',
          render: (row) =>
            row?.user
              ? [row.user.firstName, row.user.lastName].filter(Boolean).join(' ')
              : '—',
        },
        {
          id: 'entity',
          header: 'Module',
          accessorKey: 'entity',
          render: (row) => row?.entity ?? '—',
        },
         {
          id: 'action',
          header: 'Action',
          accessorKey: 'action',
          render: (row) => row?.action ?? '—',
        },
       
        {
          id: 'resource',
          header: 'Description',
          accessorKey: 'resource',
          render: (row) => row?.resource ?? '—',
        },
        {
          id: 'createdAt',
          header: 'Date & Time',
          accessorKey: 'createdAt',
          render: (row) => formatDateTime(row?.createdAt) || '—',
        },
        {
          id: 'ipAddress',
          header: 'IP Address',
          accessorKey: 'ipAddress',
          render: (row) => row?.ipAddress ?? '—',
        },
      ]),
    [],
  );

  return (
    <div className="px-5 pb-4">
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight="calc(100vh - 260px)"
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        loading={isLoading}
      />
      <Pagination
        totalRecords={total ?? 0}
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
