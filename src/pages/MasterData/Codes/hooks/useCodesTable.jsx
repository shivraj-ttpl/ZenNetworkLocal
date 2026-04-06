import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import { buildColumns } from '@/components/commonComponents/table';
import ToolTip from '@/components/commonComponents/toolTip/ToolTip';
import Icon from '@/components/icons/Icon';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';
import { truncateText } from '@/utils/GeneralUtils';

import { codesActions } from '../codeSaga';
import {
  componentKey,
  setLimit,
  setOpenEditDrawer,
  setPage,
  setSortKey,
  setSortOrder,
} from '../codesSlice';

const { toggleFavorite, archiveCode } = codesActions;

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
      onClickCb: () =>
        dispatch(archiveCode({ type: codeType, id: row.id, isArchived: true })),
    });
  } else {
    options.push({
      label: 'Archive',
      value: 'archive',
      onClickCb: () =>
        dispatch(
          archiveCode({ type: codeType, id: row.id, isArchived: false }),
        ),
    });
  }

  return options;
}

function renderFavorite(row) {
  return (
    <span className={row.isFavorite ? 'text-primary-700' : 'text-neutral-400'}>
      {row.isFavorite ? <Icon name="check" size={18} /> : '-'}
    </span>
  );
}

function getColumnDefs(codeLabel, dispatch, codeType, showArchived, canEdit) {
  const cols = [
    { id: 'srNo', header: 'Sr. No', accessorKey: 'srNo', width: 70 },
    {
      id: 'code',
      header: `${codeLabel} Code`,
      accessorKey: 'code',
      sortable: true,
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      sortable: true,
      render: (row) => {
        const truncated = truncateText(row?.description, 80);
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
          options={buildActionOptions(
            dispatch,
            row,
            codeLabel,
            codeType,
            showArchived,
          )}
        />
      ),
    });
  }

  return buildColumns(cols);
}

export default function useCodesTable() {
  const { codeLabel, codeType } = useOutletContext();
  const dispatch = useDispatch();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);
  const {
    codesList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    showArchived = false,
    sortKey = null,
    sortOrder = null,
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
    () => getColumnDefs(codeLabel, dispatch, codeType, showArchived, canEdit),
    [codeLabel, codeType, dispatch, showArchived, canEdit],
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
    totalRecords,
    totalPages,
    page,
    limit,
    sortKey,
    sortOrder,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
  };
}
