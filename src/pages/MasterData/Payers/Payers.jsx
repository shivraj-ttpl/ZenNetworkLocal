import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

import ActionDropdown from '@/components/commonComponents/actionDropdown';
import Checkbox from '@/components/commonComponents/checkbox/Checkbox';
import Pagination from '@/components/commonComponents/pagination/Pagination';
import SelectDropdown from '@/components/commonComponents/selectDropdown/SelectDropdown';
import StatusBadge from '@/components/commonComponents/statusBadge/StatusBadge';
import { buildColumns, Table } from '@/components/commonComponents/table';
import ToggleSwitch from '@/components/commonComponents/toggleSwitch/ToggleSwitch';
import Icon from '@/components/icons/Icon';
import RoleGuard from '@/components/RoleGuard/RoleGuard';
import { LOADING_KEYS } from '@/constants/loadingKeys';
import { MASTER_DATA_EDIT_ROLES } from '@/constants/roles';
import { useDebounce } from '@/hooks/useDebounce';
import { useFlexCleanup } from '@/hooks/useFlexCleanup';
import { useLoadingKey } from '@/hooks/useLoadingKey';
import useRoleAccess from '@/hooks/useRoleAccess';
import { useTableHeight } from '@/hooks/useTableHeight';
import { toPascalCaseWithSpaces } from '@/utils/GeneralUtils';

import AddPayerDrawer from './Components/AddPayerDrawer';
import AddPayersDropdown from './Components/AddPayersDropdown';
import ImportPayersDrawer from './Components/ImportPayersDrawer';
import StatusChangeModal from './Components/StatusChangeModal';
import { PAYER_TYPE_OPTIONS } from './constant';
import { payersActions, registerSaga } from './payersSaga';
import {
  componentKey,
  registerReducer,
  setLimit,
  setOpenEditDrawer,
  setOpenStatusModal,
  setPage,
  setPayerType,
  setSearch,
  setShowArchived,
  setSortKey,
  setSortOrder,
} from './payersSlice';

const { fetchPayers, togglePayerFavorite, archivePayer } = payersActions;
const EMPTY_STATE = {};

export default function Payers() {
  const dispatch = useDispatch();
  const { setToolbar } = useOutletContext();
  const canEdit = useRoleAccess(MASTER_DATA_EDIT_ROLES);

  const {
    payersList = [],
    totalRecords = 0,
    totalPages = 0,
    page = 1,
    limit = 20,
    search = '',
    showArchived = false,
    payerType = null,
    sortKey = null,
    sortOrder = null,
    refreshFlag = 0,
  } = useSelector((state) => state[componentKey] ?? EMPTY_STATE);

  const isLoading = useLoadingKey(LOADING_KEYS.PAYERS_GET_LIST);
  const debouncedSearch = useDebounce(search);
  const tableRef = useRef(null);
  const tableMaxHeight = useTableHeight(tableRef);

  useEffect(() => {
    registerReducer();
    registerSaga();
  }, []);

  useFlexCleanup(componentKey);

  useEffect(() => {
    dispatch(fetchPayers());
  }, [
    dispatch,
    page,
    limit,
    debouncedSearch,
    showArchived,
    payerType,
    sortKey,
    sortOrder,
    refreshFlag,
  ]);

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface min-w-50 max-w-20 max-[1149px]:min-w-0 max-[1149px]:max-w-57.5 max-[1149px]:flex-1">
          <Icon name="Search" size={14} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Payer Name"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full bg-transparent text-sm outline-none text-neutral-800 placeholder-text-placeholder"
          />
        </div>
        <div className="w-40 max-[1149px]:w-auto  max-[1149px]:max-w-57.5 max-[1149px]:flex-1 max-[1149px]:min-w-30">
          <SelectDropdown
            name="payerType"
            placeholder="Payer Type"
            options={PAYER_TYPE_OPTIONS}
            value={payerType}
            onChange={(val) => dispatch(setPayerType(val))}
          />
        </div>
        <RoleGuard allowedRoles={MASTER_DATA_EDIT_ROLES}>
          <AddPayersDropdown />
        </RoleGuard>
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

  const handleSortChange = useCallback(
    (key, order) => {
      dispatch(setSortKey(key));
      dispatch(setSortOrder(order));
    },
    [dispatch],
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
        {
          id: 'name',
          header: 'Name',
          accessorKey: 'name',
          sortable: true,
          width: 200,
        },
        {
          id: 'type',
          header: 'Type',
          accessorKey: 'payerType',
          sortable: true,
          render: (row) => (
            <span>{toPascalCaseWithSpaces(row?.payerType)}</span>
          ),

          width: 140,
        },
        {
          id: 'status',
          header: 'Status',
          accessorKey: 'status',
          width: 120,
          render: (row) =>
            canEdit ? (
              <div onClick={(e) => e.stopPropagation()}>
                <ToggleSwitch
                  name={`status-${row.id}`}
                  checked={row.status === 'ACTIVE'}
                  onChangeCb={() => dispatch(setOpenStatusModal(row))}
                  activeLabel="Active"
                  inactiveLabel="Inactive"
                />
              </div>
            ) : (
              <StatusBadge status={row.status} />
            ),
        },
        {
          id: 'favorites',
          header: 'Favorites',
          width: 50,
          align: 'center',
          render: (row) => (
            <span
              className={`${row.isFavorite ? 'text-primary-700 ' : 'text-neutral-400'} flex items-center justify-center`}
            >
              {row.isFavorite ? <Icon name="check" size={18} /> : '-'}
            </span>
          ),
        },
        ...(canEdit
          ? [
              {
                id: 'actions',
                header: 'Action',
                width: 70,
                align: 'center',
                render: (row) => {
                  const isActive = row.status === 'ACTIVE';
                  const options = [
                    {
                      label: 'Edit',
                      value: 'edit',
                      onClickCb: () => dispatch(setOpenEditDrawer(row)),
                    },
                  ];

                  if (isActive) {
                    options.push({
                      label: row.isFavorite
                        ? 'Remove from Favorites'
                        : 'Add to Favorites',
                      value: 'toggleFavorite',
                      onClickCb: () =>
                        dispatch(togglePayerFavorite({ id: row.id })),
                    });
                  } else {
                    options.push({
                      label: row.isArchived ? 'Unarchive' : 'Archive',
                      value: 'archive',
                      onClickCb: () =>
                        dispatch(
                          archivePayer({
                            id: row.id,
                            isArchived: row.isArchived,
                          }),
                        ),
                    });
                  }

                  return <ActionDropdown options={options} />;
                },
              },
            ]
          : []),
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
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
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
