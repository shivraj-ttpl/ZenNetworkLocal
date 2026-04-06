import { useRef } from 'react';

import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table } from '@/components/commonComponents/table';
import { useTableHeight } from '@/hooks/useTableHeight';

import useCodesTable from './hooks/useCodesTable';

export default function LONICCodes() {
  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const {
    tableData,
    columns,
    isLoading,
    totalRecords,
    totalPages,
    page,
    limit,
    handlePageChange,
    handleSortChange,
    handleLimitChange,
    sortKey,
    sortOrder,
  } = useCodesTable();

  return (
    <div ref={tableRef}>
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight={tableMaxHeight}
        loading={isLoading}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
