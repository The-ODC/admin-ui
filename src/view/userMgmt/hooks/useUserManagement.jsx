import React, { useReducer, useState } from "react";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { TableAction } from "../../../sharedComponents";

import {
  useGetUsersQuery,
  useLazyExportUsersQuery,
} from "../../../store/rtkServices/userMgmt";
import { downloadBlob, toaster } from "../../../utility";
import { useUserMgmtConfirmationAlert } from "./useUserMgmtConfirmationAlert";

export function useUserManagement() {
  /*
    Hooks & Theme Configuration
   */
  const {
    confirmAlert,
    setConfirmAlert,
    getDialogContent,
    handleAction,
    handleConfirm,
  } = useUserMgmtConfirmationAlert();

  /*
    Local State Declarations
   */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [addEditUserModal, setAddEditUserModal] = useState({
    open: false,
    selectedUser: null,
    action: "",
  });

  const [filters, setFilters] = useReducer(
    (prev, next) => ({ ...prev, ...next }),
    {
      status: "",
      orders: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
      createdBy: "",
    }
  );

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const { data, isLoading, isFetching } = useGetUsersQuery({
    search,
    sort,
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const [triggerExport, { isFetching: isExporting }] =
    useLazyExportUsersQuery();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const { data: usersData = [], total } = data || {};

  const rows = usersData?.map((item, index) => {
    const actions = (
      <TableAction
        view={`/user-management/${item.id}`}
        block={
          item.status === "active" ? () => handleAction("block", item) : null
        }
        unBlock={
          item.status === "blocked" ? () => handleAction("unblock", item) : null
        }
        remove={() => handleAction("delete", item)}
        edit={
          item.createdBy === "admin"
            ? () =>
                setAddEditUserModal({
                  open: true,
                  selectedUser: item,
                  action: "EDIT",
                })
            : null
        }
        isBlocked={item.status === "blocked"}
      />
    );
    const sr_no = index + 1 + page * rowsPerPage;
    const name = `${item.firstName} ${item.lastName}`;
    const status = <StatusChip status={item.status} />;
    const createdBy = item.createdBy
      ? item.createdBy.charAt(0).toUpperCase() + item.createdBy.slice(1)
      : item.createdBy;
    const totalSpent = formatCurrency(item.totalSpent, { showSymbol: false });
    return { ...item, actions, sr_no, name, status, createdBy, totalSpent };
  });

  const dialogContent = getDialogContent(
    confirmAlert.action,
    confirmAlert.selectedUser
  );

  /*
    Handlers & Callback Actions
   */
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));

  const handleExport = async () => {
    try {
      const blob = await triggerExport({ search, sort, ...filters }).unwrap();
      downloadBlob(blob, "users");
      toaster.success("Data exported successfully!");
    } catch {
      // Errors are handled globally
    }
  };

  return {
    page,
    rowsPerPage,
    search,
    setSearch,
    sort,
    setSort,
    filters,
    setFilters,
    addEditUserModal,
    setAddEditUserModal,
    isLoading: isLoading || isFetching,
    isFetching,
    total,
    rows,
    isExporting,
    confirmAlert,
    setConfirmAlert,
    handleConfirm,
    dialogContent,
    handleChangePage,
    handleChangeRowsPerPage,
    handleExport,
  };
}
