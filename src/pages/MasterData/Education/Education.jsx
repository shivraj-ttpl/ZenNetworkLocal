import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Button from '@/components/commonComponents/button/Button';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import { Table, buildColumns } from '@/components/commonComponents/table';
import RoleGuard from '@/components/RoleGuard/RoleGuard';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';

import AddMaterialDrawer from './Components/AddMaterialDrawer';
import FilterDropdown from './Components/FilterDropdown';
import ViewEducationModal from './Components/ViewEducationModal';
import { formatDate } from '@/utils/GeneralUtils';

import { educationActions, registerSaga } from './educationSaga';
import {
  componentKey,
  registerReducer,
  setPage,
  setLimit,
  setSearch,
  setShowArchived,
  setFilterSpecialty,
  setFilterFileType,
  setOpenAddDrawer,
  setOpenEditDrawer,
  setOpenViewModal,
} from './educationSlice';

const { fetchEducation, toggleFavorite, archiveEducation, downloadEducation } =
  educationActions;
const EMPTY_STATE = {};

export default function Education() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);

  const {
    educationList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    search = '',
    showArchived = false,
    filterSpecialty = null,
    filterFileType = null,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.EDUCATION_GET_LIST);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [
    dispatch,
    page,
    limit,
    debouncedSearch,
    showArchived,
    filterSpecialty,
    filterFileType,
    refreshFlag,
  ]);

  const handleFilterApply = useCallback(
    (filters) => {
      dispatch(setFilterSpecialty(filters.specialty));
      dispatch(setFilterFileType(filters.fileType));
    },
    [dispatch],
  );

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-50 max-w-72 max-[1149px]:min-w-0 max-[1149px]:max-w-57.5 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by File Name"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <FilterDropdown onApply={handleFilterApply} />
        <RoleGuard allowedRoles={MASTER_DATA_EDIT_ROLES}>
          <Button
            variant="primaryBlue"
            size="sm"
            onClick={() => dispatch(setOpenAddDrawer())}
          >
            <Icon name="Plus" size={14} />
            Add Material
          </Button>
        </RoleGuard>
      </>,
    );
    return () => setToolbar(null);
  }, [setToolbar, showArchived, search, dispatch, handleFilterApply]);

  const tableData = useMemo(
    () =>
      educationList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [educationList, page, limit],
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
        {
          id: 'fileName',
          header: 'File Name',
          accessorKey: 'fileName',
        },
        {
          id: 'specialty',
          header: 'Specialty',
          accessorKey: 'specialty',
          width: 160,
        },
        {
          id: 'fileType',
          header: 'File Type',
          accessorKey: 'fileType',
          width: 100,
        },
        {
          id: 'uploadedOn',
          header: 'Uploaded On',
          accessorKey: 'uploadedOn',
          width: 130,
          render: (row) => formatDate(row.uploadedOn),
        },
        {
          id: 'uploadedBy',
          header: 'Uploaded By',
          accessorKey: 'uploadedBy',
          width: 160,
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
                    label: 'Edit',
                    value: 'edit',
                    onClickCb: () => dispatch(setOpenEditDrawer(row)),
                  },
                  {
                    label: 'View',
                    value: 'view',
                    onClickCb: () => dispatch(setOpenViewModal(row)),
                  },
                  {
                    label: 'Download',
                    value: 'download',
                    onClickCb: () =>
                      dispatch(
                        downloadEducation({
                          id: row.id,
                          fileName: row.fileName,
                        }),
                      ),
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
                        archiveEducation({
                          id: row.id,
                          isArchived: row.isArchived,
                        }),
                      ),
                  },
                ]}
              />
            ) : (
              <ActionDropdown
                options={[
                  {
                    label: 'View',
                    value: 'view',
                    onClickCb: () => dispatch(setOpenViewModal(row)),
                  },
                  {
                    label: 'Download',
                    value: 'download',
                    onClickCb: () =>
                      dispatch(
                        downloadEducation({
                          id: row.id,
                          fileName: row.fileName,
                        }),
                      ),
                  },
                ]}
              />
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
      <AddMaterialDrawer />
      <ViewEducationModal />
    </div>
  );
}
