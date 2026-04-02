import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table, buildColumns } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';

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
import { formatDate } from '../../../utils/GeneralUtils';

const { fetchCarePlans, toggleFavorite, archiveCarePlan } = carePlansActions;
const EMPTY_STATE = {};

export default function CarePlans() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);

  const {
    carePlansList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-60 max-w-72 max-[1149px]:min-w-0 max-[1149px]:max-w-67.5 max-[1149px]:flex-1">
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
          id: 'updatedAt',
          header: 'Updated Date',
          accessorKey: 'updatedAt',
          width: 130,
          render: (row) => formatDate(row.updatedAt),
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
          render: (row) =>
            canEdit ? (
              <ActionDropdown
                options={[
                  {
                    label: 'View',
                    value: 'view',
                    onClickCb: () => dispatch(setOpenAddDrawer()),
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
                        archiveCarePlan({
                          id: row.id,
                          isArchived: row.isArchived,
                        }),
                      ),
                  },
                ]}
              />
            ) : (
              <button
                className="text-primary-700 text-sm font-medium hover:underline cursor-pointer"
                onClick={() => dispatch(setOpenAddDrawer())}
              >
                View
              </button>
            ),
        },
      ]),
    [dispatch, canEdit],
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
