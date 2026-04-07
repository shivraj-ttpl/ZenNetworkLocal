import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToolTip from '@/components/commonComponents/toolTip/ToolTip';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';
import { useTableHeight } from '@/hooks/useTableHeight';
import { formatDate, truncateText } from '@/utils/GeneralUtils';

import { assessmentsActions, registerSaga } from './assessmentsSaga';
import {
  componentKey,
  registerReducer,
  setLimit,
  setOpenViewDrawer,
  setPage,
  setSearch,
  setShowArchived,
} from './assessmentsSlice';
import StandardDepressionScreeningDrawer from './Components/StandardDepressionScreeningDrawer';
import ViewAssessmentDrawer from './Components/ViewAssessmentDrawer';

const { fetchAssessments, toggleFavorite, archiveAssessment } =
  assessmentsActions;
const EMPTY_STATE = {};

export default function Assessments() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);
  const [phq9DrawerOpen, setPhq9DrawerOpen] = useState(false);

  const {
    assessmentsList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    search = '',
    showArchived = false,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.ASSESSMENTS_GET_LIST);
  const debouncedSearch = useDebounce(search);
  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchAssessments());
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
            placeholder="Search by Name or Description"
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
      assessmentsList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [assessmentsList, page, limit],
  );

  const handlePageChange = useCallback((p) => dispatch(setPage(p)), [dispatch]);

  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );

  const columns = useMemo(
    () =>
      buildColumns([
        { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
        { id: 'name', header: 'Assessment Name', accessorKey: 'name' },
        {
          id: 'description',
          header: 'Description',
          accessorKey: 'description',
          render: (row) => {
            const truncated = truncateText(row.description, 80);
            if (!row.description) return '-';
            if (truncated === row.description) return row.description;
            return (
              <ToolTip
                content={
                  <p className="p-2 text-sm max-w-80 wrap-break-word">
                    {row.description}
                  </p>
                }
                position="bottom"
                usePortal
              >
                <span className="cursor-default">{truncated}...</span>
              </ToolTip>
            );
          },
        },

        {
          id: 'updatedAt',
          header: 'Updated Date',
          accessorKey: 'updatedAt',
          width: 130,
          render: (row) => formatDate(row.updatedAt),
        },
        {
          id: 'totalQuestions',
          header: 'Total Questions',
          accessorKey: 'totalQuestions',
          width: 130,
          render: (row) => (
            <span className="flex items-center justify-center">
              {row.totalQuestions}
            </span>
          ),
        },
        {
          id: 'favorites',
          header: 'Favorites',
          width: 100,
          align: 'center',
          render: (row) => (
            <span
              className={`flex items-center justify-center ${row.isFavorite ? 'text-primary-700' : 'text-neutral-400'}`}
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
                    onClickCb: () =>
                      row.name === 'Standard Depression Screening'
                        ? setPhq9DrawerOpen(true)
                        : dispatch(setOpenViewDrawer(row)),
                  },
                  {
                    label: row.isFavorite
                      ? 'Remove from Favorites'
                      : 'Add to Favorites',
                    value: 'toggleFavorite',
                    onClickCb: () => dispatch(toggleFavorite({ id: row.id })),
                  },
                  {
                    label: row.isArchived ? 'Unarchive' : 'Archive',
                    value: 'archive',
                    onClickCb: () =>
                      dispatch(
                        archiveAssessment({
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
                onClick={() => dispatch(setOpenViewDrawer(row))}
              >
                View
              </button>
            ),
        },
      ]),
    [dispatch, canEdit],
  );

  return (
    <div className="px-5 pb-4" ref={tableRef}>
      <Table
        columns={columns}
        data={tableData}
        size="sm"
        maxHeight={tableMaxHeight}
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
      <ViewAssessmentDrawer />
      <StandardDepressionScreeningDrawer
        open={phq9DrawerOpen}
        onClose={() => setPhq9DrawerOpen(false)}
        onPrevious={() => setPhq9DrawerOpen(false)}
      />
    </div>
  );
}
