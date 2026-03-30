import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table } from '@/components/commonComponents/table';

import useNameCodesTable from './hooks/useNameCodesTable';

export default function AllergiesCodes() {
  const {
    tableData,
    columns,
    isLoading,
    totalRecords,
    totalPages,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  } = useNameCodesTable();

  return (
    <div>
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight="calc(100vh - 300px)"
        loading={isLoading}
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
