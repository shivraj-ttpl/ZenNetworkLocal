import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table, buildColumns } from '@/components/commonComponents/table';
import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { carePlansActions, registerSaga } from './carePlansSaga';
import {
  componentKey,
  registerReducer,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setOpenAddDrawer,
  setCloseDrawer,
} from './carePlansSlice';
import ViewCarePlanDrawer from './components/ViewCarePlanDrawer';

const { fetchCarePlans } = carePlansActions;
const EMPTY_STATE = {};

export default function CarePlans() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();

  const {
    carePlansList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 10,
    search = '',
    showArchived = false,
    refreshFlag = 0,
    drawerOpen = false,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.CARE_PLANS_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchCarePlans());
  }, [dispatch, page, limit, debouncedSearch, showArchived, refreshFlag]);

  useEffect(() => {
    setToolbar(
      <>
        <Checkbox
          label="Show Archive"
          checked={showArchived}
          onChange={() => dispatch(setShowArchived(!showArchived))}
          variant="blue"
          size="sm"
        />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Care Plan Name"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchived, search, dispatch]);

  const tableData = useMemo(
    () =>
      carePlansList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [carePlansList, page, limit],
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
        {
          id: 'description',
          header: 'Care Plan Description',
          accessorKey: 'description',
        },
        {
          id: 'duration',
          header: 'Duration',
          accessorKey: 'duration',
          width: 130,
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
                  label: 'View',
                  value: 'view',
                  onClickCb: () => dispatch(setOpenAddDrawer()),
                },
                {
                  label: 'Add to Favorites',
                  value: 'add_to_favorites',
                  onClickCb: () => {},
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
      <ViewCarePlanDrawer
        open={drawerOpen}
        onClose={() => dispatch(setCloseDrawer())}
      />
    </div>
  );
}
