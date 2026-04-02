import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import { buildColumns } from '@/components/commonComponents/table';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';

import { codesActions } from '../codeSaga';
import {
  componentKey,
  setLimit,
  setOpenEditDrawer,
  setPage,
  setSortKey,
  setSortOrder,
} from '../codesSlice';

const { toggleStandaloneFavorite, archiveStandalone } = codesActions;

const EMPTY_STATE = {};

function getLoadingKey(codeType) {
  if (codeType === 'allergies') return LOADING_KEYS.ALLERGIES_GET_LIST;
  return LOADING_KEYS.SYMPTOMS_GET_LIST;
}

function buildActionOptions(dispatch, row, codeLabel, codeType) {
  return [
    {
      label: 'Edit',
      value: 'edit',
      onClickCb: () => dispatch(setOpenEditDrawer({ codeLabel, data: row })),
    },
    {
      label: row.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      value: 'toggleFavorite',
      onClickCb: () =>
        dispatch(toggleStandaloneFavorite({ type: codeType, id: row.id })),
    },
    {
      label: row.isArchived ? 'Unarchive' : 'Archive',
      value: 'archive',
      onClickCb: () =>
        dispatch(
          archiveStandalone({
            type: codeType,
            id: row.id,
            isArchived: !row.isArchived,
          }),
        ),
    },
  ];
}

function renderFavorite(row) {
  return (
    <span className={row.isFavorite ? 'text-primary-700' : 'text-neutral-400'}>
      {row.isFavorite ? <Icon name="check" size={18} /> : '-'}
    </span>
  );
}

function getColumnDefs(codeLabel, dispatch, codeType, canEdit) {
  const cols = [
    { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
    { id: 'name', header: `${codeLabel} Name`, accessorKey: 'name', sortable: true },
    { id: 'description', header: 'Description', accessorKey: 'description', sortable: true },
    {
      id: 'favorites',
      header: 'Favorites',
      width: 100,
      align: 'center',
      render: renderFavorite,
    },
  ];

  if (canEdit) {
    cols.push({
      id: 'actions',
      header: 'Action',
      width: 70,
      align: 'center',
      render: (row) => (
        <ActionDropdown
          options={buildActionOptions(dispatch, row, codeLabel, codeType)}
        />
      ),
    });
  }

  return buildColumns(cols);
}

export default function useNameCodesTable() {
  const { codeLabel, codeType } = useOutletContext();
  const dispatch = useDispatch();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);
  const {
    codesList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    sortKey = null,
    sortOrder = null,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(getLoadingKey(codeType));

  const tableData = useMemo(
    () =>
      codesList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [codesList, page, limit],
  );

  const columns = useMemo(
    () => getColumnDefs(codeLabel, dispatch, codeType, canEdit),
    [codeLabel, codeType, dispatch, canEdit],
  );

  const handlePageChange = useCallback((p) => dispatch(setPage(p)), [dispatch]);
  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );
  const handleSortChange = useCallback(
    (key, order) => {
      dispatch(setSortKey(key));
      dispatch(setSortOrder(order));
    },
    [dispatch],
  );

  return {
    tableData,
    columns,
    isLoading,
    sortKey,
    sortOrder,
    handleSortChange,
    totalRecords,
    totalPages,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
}
