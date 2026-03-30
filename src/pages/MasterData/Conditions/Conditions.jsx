import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table, buildColumns } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import ActionDropdown from '@/components/commonComponents/actionDropdown';

import { formatDate } from '@/utils/GeneralUtils';

import { conditionsActions, registerSaga } from './conditionsSaga';
import {
  componentKey,
  registerReducer,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setOpenAddDrawer,
  setOpenEditDrawer,
} from './conditionsSlice';
import AddConditionDrawer from './Components/AddConditionDrawer';

const { fetchConditions, toggleFavorite, archiveCondition } = conditionsActions;
const EMPTY_STATE = {};

export default function Conditions() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();

  const {
    conditionsList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 10,
    search = '',
    showArchived = false,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.CONDITIONS_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchConditions());
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60 max-[1149px]:min-w-0 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name or Description"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <Button
          variant="primaryBlue"
          size="sm"
          onClick={() => dispatch(setOpenAddDrawer())}
        >
          <Icon name="Plus" size={14} />
          Add Condition
        </Button>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchived, search, dispatch]);

  const tableData = useMemo(
    () =>
      conditionsList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [conditionsList, page, limit],
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
        { id: 'name', header: 'Condition Name', accessorKey: 'name' },
        {
          id: 'icdCode',
          header: 'ICD Code',
          accessorKey: 'icdCode',
          width: 120,
          render: (row) =>
            row.code ? (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
                {row?.code}
              </span>
            ) : (
              '-'
            ),
        },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
        },
        {
          id: 'createdAt',
          header: 'Created Date',
          accessorKey: 'createdAt',
          width: 130,
          render: (row) => formatDate(row.createdAt),
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
              {row.isFavorite ? <Icon name="check" size={18} /> : '-'}
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
                  label: row.isFavorite
                    ? 'Remove from Favorites'
                    : 'Add to Favorites',
                  value: 'toggleFavorite',
                  onClickCb: () =>
                    dispatch(toggleFavorite({ id: row.id })),
                },
                {
                  label: row.isArchived ? 'Unarchive' : 'Archive',
                  value: 'archive',
                  onClickCb: () =>
                    dispatch(
                      archiveCondition({
                        id: row.id,
                        isArchived: row.isArchived,
                      }),
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
      <AddConditionDrawer />
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
