import React, { useReducer, useState } from "react";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { TableAction } from "../../../sharedComponents";

import {
  useGetPaymentsQuery,
  useLazyExportPaymentsQuery,
} from "../../../store/rtkServices/paymentsMgmt";
import { downloadBlob, toaster } from "../../../utility";

export function usePaymentManagement() {
  /*
    Local State Declarations
   */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [filters, setFilters] = useReducer(
    (prev, next) => ({ ...prev, ...next }),
    {
      status: "",
      paymentMethod: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
    }
  );

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const { data, isFetching } = useGetPaymentsQuery({
    search,
    sort,
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const [triggerExport, { isFetching: isExporting }] =
    useLazyExportPaymentsQuery();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const { data: paymentsData = [], total } = data || {};

  const rows = paymentsData?.map((item, index) => {
    const actions = <TableAction view={`/payment-management/${item._id}`} />;
    const sr_no = index + 1 + page * rowsPerPage;
    const status = <StatusChip status={item.status} />;
    const amount = formatCurrency(item.amount, { showSymbol: false });
    return { ...item, actions, sr_no, status, amount };
  });

  /*
    Handlers & Callback Actions
   */
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));

  const handleExport = async () => {
    try {
      const blob = await triggerExport({ search, sort, ...filters }).unwrap();
      downloadBlob(blob, "payments");
      toaster.success("Data exported successfully!");
    } catch {
      // Errors are handled globally
    }
  };

  return {
    page,
    rowsPerPage,
    setSearch,
    setSort,
    filters,
    setFilters,
    isFetching,
    total,
    rows,
    isExporting,
    handleChangePage,
    handleChangeRowsPerPage,
    handleExport,
  };
}
