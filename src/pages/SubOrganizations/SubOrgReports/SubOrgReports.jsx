import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { buildColumns, Table } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import {
  REPORT_PROVIDER_GROUP_OPTIONS,
  reportsDemographicsData,
} from '@/data/settingsData';
import { useTableHeight } from '@/hooks/useTableHeight';

const TABS = [
  { key: 'demographics', label: 'Demographics' },
  { key: 'billing', label: 'Billing' },
  { key: 'task', label: 'Task' },
  { key: 'caseload', label: 'Caseload' },
];

export default function SubOrgReports() {
  const { setToolbar } = useOutletContext();
  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);
  const [activeTab, setActiveTab] = useState('demographics');
  const [providerGroup, setProviderGroup] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setToolbar(
      <Button variant="primaryBlue" size="sm">
        <Icon name="Download" size={14} />
        Export
      </Button>,
    );
    return () => setToolbar(null);
  }, [setToolbar]);

  const handleSortChange = useCallback((key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setPage(1);
    setSelectedRows({});
  }, []);

  const handleLimitChange = useCallback((val) => {
    setLimit(val);
    setPage(1);
  }, []);

  const totalRecords = reportsDemographicsData.length;
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  const paginatedData = useMemo(
    () => reportsDemographicsData.slice((page - 1) * limit, page * limit),
    [page, limit],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        {
          id: 'patientId',
          header: 'Patient ID',
          accessorKey: 'patientId',
          width: 90,
        },
        { id: 'firstName', header: 'First Name', accessorKey: 'firstName' },
        { id: 'lastName', header: 'Last Name', accessorKey: 'lastName' },
        {
          id: 'dateOfBirth',
          header: 'Date of Birth',
          accessorKey: 'dateOfBirth',
        },
        {
          id: 'identifiedGender',
          header: 'Identified Gender',
          accessorKey: 'identifiedGender',
        },
        {
          id: 'sexAtBirth',
          header: 'Sex (at birth)',
          accessorKey: 'sexAtBirth',
        },
        { id: 'race', header: 'Race', accessorKey: 'race' },
        { id: 'ethnicity', header: 'Ethnicity', accessorKey: 'ethnicity' },
        {
          id: 'preferredLanguage',
          header: 'Preferred Language',
          accessorKey: 'preferredLanguage',
        },
        {
          id: 'currentAddress',
          header: 'Current Address',
          accessorKey: 'currentAddress',
        },
      ]),
    [],
  );

  return (
    <div className="px-5 pb-4" ref={tableRef}>
      <div className="flex gap-4 border-b border-border-light mb-4 max-[1149px]:overflow-x-auto max-[1149px]:gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={`pb-2 text-xs font-normal border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'text-primary-700 border-primary'
                : 'text-neutral-500 border-transparent hover:text-neutral-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-4 mb-4 max-[1149px]:flex-wrap">
        <div className="w-48 max-[1149px]:w-auto max-[1149px]:flex-1 max-[1149px]:min-w-30">
          <SelectDropdown
            label="Select Provider Group *"
            name="providerGroup"
            placeholder="Select Provider Group"
            options={REPORT_PROVIDER_GROUP_OPTIONS}
            value={providerGroup}
            onChange={setProviderGroup}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={paginatedData}
        size="sm"
        maxHeight={tableMaxHeight}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <Pagination
        totalRecords={totalRecords}
        totalPages={totalPages}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
