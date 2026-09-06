import React from "react";
import { NavLink } from "react-router-dom";
import { Card } from "@mui/material";

import { Button } from "TheOdcMfUI/sharedComp";

import {
  DataTable,
  PageHeader,
  TableActionHeader,
} from "../../../sharedComponents";
import { CustomAlertDialog } from "../../../sharedComponents/dialog";
import { FilterModal } from "../components";

import { dropDownOptions, tableColumns } from "../../../constant";
import { useProductManagement } from "../hooks";

function ProductManagement() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Local State Accessors & Mutators
     */
    page,
    rowsPerPage,
    setSearch,
    setSort,
    filters,
    setFilters,
    confirmAlert,
    setConfirmAlert,

    /*
      RTK Query API State Indicators
     */
    isLoading,
    isExporting,

    /*
      Computed API Data & Memos
     */
    total,
    rows,
    dialogContent,
    isConfirmAlertLoading,

    /*
      Event Handler Callbacks
     */
    handleConfirm,
    handleChangePage,
    handleChangeRowsPerPage,
    handleExport,
  } = useProductManagement();

  return (
    <>
      <PageHeader
        pageTitle="Dish Management"
        onExportClick={handleExport}
        isExporting={isExporting}
      >
        <Button variant="contained" component={NavLink} to="add-dish">
          List New Dish
        </Button>
      </PageHeader>

      <Card>
        <TableActionHeader
          searchPlaceholder="Search dish..."
          setSearch={setSearch}
          sortLabel="Sort By"
          setSort={setSort}
          sortList={dropDownOptions.productMgmt.sort}
        >
          <FilterModal filters={filters} setFilters={setFilters} />
        </TableActionHeader>
        <DataTable
          isLoading={isLoading}
          columns={tableColumns.productMgmt}
          rows={rows}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          page={page}
          rowsPerPage={rowsPerPage}
          totalItem={total}
        />
      </Card>

      <CustomAlertDialog
        open={confirmAlert.open}
        onClose={() =>
          setConfirmAlert({ open: false, action: null, selectedProduct: null })
        }
        handleConfirm={handleConfirm}
        title={dialogContent.title}
        description={dialogContent.description}
        confirmLabel={dialogContent.confirmLabel}
        isLoading={isConfirmAlertLoading}
      />
    </>
  );
}

export default ProductManagement;
