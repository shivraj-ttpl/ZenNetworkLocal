import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import { Table, buildColumns } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import AddPayerDrawer from './Components/AddPayerDrawer';
import AddPayersDropdown from './Components/AddPayersDropdown';
import ImportPayersDrawer from './Components/ImportPayersDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import { PAYER_TYPE_OPTIONS } from './constant';
import { payersActions, registerSaga } from './payersSaga';
import {
  componentKey,
  registerReducer,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setPayerType,
  setOpenEditDrawer,
  setOpenStatusModal,
} from './payersSlice';

const { fetchPayers } = payersActions;
const EMPTY_STATE = {};

export default function Payers() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();

  const {
    payersList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 10,
    search = '',
    showArchived = false,
    payerType = null,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.PAYERS_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchPayers());
  }, [dispatch, page, limit, debouncedSearch, showArchived, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchived}
          onChange={() => dispatch(setShowArchived(!showArchived))}
          variant="teal"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-50">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Payer Name"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <div className="w-40">
          <SelectDropdown
            name="payerType"
            placeholder="Payer Type"
            options={PAYER_TYPE_OPTIONS}
            value={payerType}
            onChangeCb={(val) => dispatch(setPayerType(val))}
          />
        </div>
        <AddPayersDropdown />
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchived, search, payerType, dispatch]);

  const tableData = useMemo(
    () =>
      payersList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [payersList, page, limit],
  );

  const handlePageChange = useCallback(
    (p) => dispatch(setPage(p)),
    [dispatch],
  );

  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        { id: 'name', header: 'Name', accessorKey: 'name' },
        { id: 'type', header: 'Type', accessorKey: 'type', width: 140 },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          width: 120,
          render: (row) => (
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleSwitch
                name={`status-${row.id}`}
                checked={row.status === 'Active'}
                onChangeCb={() => dispatch(setOpenStatusModal(row))}
                activeLabel="Active"
                inactiveLabel="Inactive"
              />
            </div>
          ),
        },
        {
          id: 'favorites',
          header: 'Favorites',
          width: 100,
          align: 'center',
          render: (row) => (
            <span
              className={
                row.isFavorite ? 'text-primary-700' : 'text-neutral-400'
              }
            >
              {row.isFavorite ? '✓' : '-'}
            </span>
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
                  label: 'Edit',
                  value: 'edit',
                  onClickCb: () => dispatch(setOpenEditDrawer(row)),
                },
                {
                  label: 'Archive',
                  value: 'archive',
                  onClickCb: () => {},
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
      <AddPayerDrawer />
      <ImportPayersDrawer />
      <StatusChangeModal />
    </div>
  );
}
