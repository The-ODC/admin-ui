import React, { useReducer, useState } from "react";

import { StatusChip } from "TheOdcMfUI/sharedComp";

import { TableAction } from "../../../sharedComponents";

import {
  useGetProductsQuery,
  useLazyExportProductsQuery,
} from "../../../store/rtkServices/productsMgmt";
import { dropDownOptions } from "../../../constant";
import { downloadBlob, toaster } from "../../../utility";
import { useProductMgmtConfirmationAlert } from "./useProductMgmtConfirmationAlert";

export function useProductManagement() {
  /*
    Hooks & Theme Configuration
   */
  const {
    confirmAlert,
    setConfirmAlert,
    getDialogContent,
    handleAction,
    handleConfirm,
  } = useProductMgmtConfirmationAlert();

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
      category: "",
      subCategory: "",
      dateInterval: "",
      fromDate: "",
      toDate: "",
    }
  );

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const { data, isLoading, isFetching } = useGetProductsQuery({
    search,
    sort,
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const [triggerExport, { isFetching: isExporting }] =
    useLazyExportProductsQuery();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const { data: productsData = [], total } = data || {};

  const rows = productsData?.products?.map((item, index) => {
    const isDeactivated =
      item.status === "inActive" || item.status === "blocked";
    const actions = (
      <TableAction
        view={`/dish-management/${item._id}`}
        block={!isDeactivated ? () => handleAction("inActive", item) : null}
        unBlock={isDeactivated ? () => handleAction("active", item) : null}
        remove={() => handleAction("delete", item)}
        isBlocked={isDeactivated}
      />
    );
    const sr_no = index + 1 + page * rowsPerPage;
    const computedStatus = isDeactivated
      ? "inActive"
      : Number(item.stock || 0) <= 0
        ? "outOfStock"
        : "active";
    const status = <StatusChip status={computedStatus} />;
    const category = getCategoryLabel(item.category);
    const subCategory = getSubCategoryLabel(item.category, item.subCategory);
    return { ...item, actions, sr_no, status, category, subCategory };
  });

  const dialogContent = getDialogContent(
    confirmAlert.action,
    confirmAlert.selectedProduct
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
      downloadBlob(blob, "dishes");
      toaster.success("Data exported successfully!");
    } catch {
      // Errors are handled globally
    }
  };

  /*
    Formatting & Utility Helpers
   */
  function getCategoryLabel(catValue) {
    const found = dropDownOptions.productMgmt.category.find(
      (opt) => opt.value === catValue
    );
    return found ? found.label : catValue;
  }

  function getSubCategoryLabel(catValue, subCatValue) {
    if (catValue && dropDownOptions.productMgmt.subCategory[catValue]) {
      const found = dropDownOptions.productMgmt.subCategory[catValue].find(
        (opt) => opt.value === subCatValue
      );
      if (found) return found.label;
    }
    for (const cat of Object.keys(dropDownOptions.productMgmt.subCategory)) {
      const found = dropDownOptions.productMgmt.subCategory[cat].find(
        (opt) => opt.value === subCatValue
      );
      if (found) return found.label;
    }
    return subCatValue;
  }

  return {
    page,
    rowsPerPage,
    setSearch,
    setSort,
    filters,
    setFilters,
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
