import React from "react";
import { Card } from "@mui/material";

import { Button } from "TheOdcMfUI/sharedComp";

import {
  DataTable,
  PageHeader,
  TableActionHeader,
} from "../../../sharedComponents";
import { CustomAlertDialog } from "../../../sharedComponents/dialog";
import { AddEditUserModal, FilterModal } from "../components";

import { tableColumns, dropDownOptions } from "../../../constant";
import { useUserManagement } from "../hooks";

function UserManagement() {
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
    addEditUserModal,
    setAddEditUserModal,
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
  } = useUserManagement();

  return (
    <>
      <PageHeader
        pageTitle="User Management"
        onExportClick={handleExport}
        isExporting={isExporting}
      >
        <Button
          variant="contained"
          onClick={() =>
            setAddEditUserModal({
              open: true,
              selectedUser: null,
              action: "ADD",
            })
          }
        >
          Add User
        </Button>
      </PageHeader>
      <Card>
        <TableActionHeader
          searchPlaceholder="Search users..."
          setSearch={setSearch}
          sortLabel="Sort By"
          setSort={setSort}
          sortList={dropDownOptions.userMgmt.sort}
        >
          <FilterModal filters={filters} setFilters={setFilters} />
        </TableActionHeader>
        <DataTable
          isLoading={isLoading}
          columns={tableColumns.userMgmt}
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
          setConfirmAlert({ open: false, action: null, selectedUser: null })
        }
        handleConfirm={handleConfirm}
        title={dialogContent.title}
        description={dialogContent.description}
        confirmLabel={dialogContent.confirmLabel}
        isLoading={isConfirmAlertLoading}
      />

      <AddEditUserModal
        addEditUserModal={addEditUserModal}
        setAddEditUserModal={setAddEditUserModal}
      />
    </>
  );
}

export default UserManagement;
