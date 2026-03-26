import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import { buildColumns } from '@/components/commonComponents/table';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { useLoadingKey } from '@/hooks/useLoadingKey';

import { codesActions } from '../codeSaga';
import {
  componentKey,
  setLimit,
  setOpenEditDrawer,
  setPage,
} from '../codesSlice';

const { toggleFavorite, archiveCode, unarchiveCode } = codesActions;

const EMPTY_STATE = {};

function buildActionOptions(dispatch, row, codeLabel, codeType, showArchived) {
  const options = [
    {
      label: 'Edit',
      value: 'edit',
      onClickCb: () => dispatch(setOpenEditDrawer({ codeLabel, data: row })),
    },
    {
      label: row.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
      value: 'toggleFavorite',
      onClickCb: () => dispatch(toggleFavorite({ type: codeType, id: row.id })),
    },
  ];

  if (showArchived) {
    options.push({
      label: 'Unarchive',
      value: 'unarchive',
      onClickCb: () => dispatch(unarchiveCode({ type: codeType, id: row.id })),
    });
  } else {
    options.push({
      label: 'Archive',
      value: 'archive',
      onClickCb: () => dispatch(archiveCode({ type: codeType, id: row.id })),
    });
  }

  return options;
}

function renderFavorite(row) {
  return (
    <span className={row.isFavorite ? 'text-primary-700' : 'text-neutral-400'}>
      {row.isFavorite ? '✓' : '-'}
    </span>
  );
}

function getColumnDefs(codeLabel, dispatch, codeType, showArchived) {
  return buildColumns([
    { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
    { id: 'code', header: `${codeLabel} Code`, accessorKey: 'code' },
    { id: 'description', header: 'Description', accessorKey: 'description' },
    {
      id: 'favorites',
      header: 'Favorites',
      width: 100,
      align: 'center',
      render: renderFavorite,
    },
    {
      id: 'actions',
      header: 'Action',
      width: 70,
      align: 'center',
      render: (row) => (
        <ActionDropdown
          options={buildActionOptions(
            dispatch,
            row,
            codeLabel,
            codeType,
            showArchived,
          )}
        />
      ),
    },
  ]);
}

export default function useCodesTable() {
  const { codeLabel, codeType } = useOutletContext();
  const dispatch = useDispatch();
  const {
    codesList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 10,
    showArchived = false,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);
  const isLoading = useLoadingKey(LOADING_KEYS.CODES_GET_LIST);

  const tableData = useMemo(
    () =>
      codesList.map((item, i) => ({
        ...item,
        srNo: String((page - 1) * limit + i + 1).padStart(2, '0'),
      })),
    [codesList, page, limit],
  );

  const columns = useMemo(
    () => getColumnDefs(codeLabel, dispatch, codeType, showArchived),
    [codeLabel, codeType, dispatch, showArchived],
  );

  const handlePageChange = useCallback((p) => dispatch(setPage(p)), [dispatch]);
  const handleLimitChange = useCallback(
    (l) => dispatch(setLimit(l)),
    [dispatch],
  );

  return {
    tableData,
    columns,
    isLoading,
    totalRecords,
    totalPages,
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
}
