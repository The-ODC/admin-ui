import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import {
  MailOutline,
  Schedule,
  MarkEmailRead,
  CheckCircle,
} from "@mui/icons-material";

import { COLORS } from "TheOdcMfUI/theme";

import { DataTable, PageHeader } from "../../../sharedComponents";
import { CustomAlertDialog } from "../../../sharedComponents/dialog";
import { InquiriesFilterBar, InquiryDetailsDialog } from "../components";

import { tableColumns } from "../../../constant";
import { useInquiriesMgmt } from "../hooks";

const KPI_CARDS = (stats) => [
  {
    label: "TOTAL INQUIRIES",
    value: stats?.totalCount || 0,
    color: COLORS.PRIMARY,
    mutedColor: COLORS.PRIMARY_MUTED,
    icon: MailOutline,
  },
  {
    label: "NEW",
    value: stats?.newCount || 0,
    color: COLORS.ERROR,
    mutedColor: COLORS.ERROR_MUTED,
    icon: Schedule,
  },
  {
    label: "CONTACTED",
    value: stats?.contactedCount || 0,
    color: COLORS.WARNING,
    mutedColor: COLORS.WARNING_MUTED,
    icon: MarkEmailRead,
  },
  {
    label: "RESOLVED",
    value: stats?.resolvedCount || 0,
    color: COLORS.SUCCESS,
    mutedColor: COLORS.SUCCESS_MUTED,
    icon: CheckCircle,
  },
];

function InquiriesMgmt() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    page,
    rowsPerPage,
    status,
    search,
    setSearch,
    rows,
    total,
    stats,
    isLoading,
    selectedInquiry,
    detailsOpen,
    newNoteText,
    setNewNoteText,
    isUpdatingStatus,
    isAddingNote,
    deleteConfirm,
    isDeleting,
    handleChangePage,
    handleChangeRowsPerPage,
    handleStatusTabChange,
    handleCloseDetails,
    handleStatusChange,
    handleAddNote,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
  } = useInquiriesMgmt();

  return (
    <Stack spacing={3}>
      <PageHeader pageTitle="Contact Inquiries" hideExportBtn />

      {/* Summary KPI Cards */}
      <Grid container spacing={2.5}>
        {KPI_CARDS(stats).map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                p: 0.5,
                borderLeft: `4px solid ${card.color}`,
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.4)"
                  : "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      noWrap
                      sx={{ color: card.color, display: "block" }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{ mt: 0.5, color: card.color }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1.25,
                      borderRadius: "14px",
                      backgroundColor: card.mutedColor,
                      color: card.color,
                    }}
                  >
                    <card.icon sx={{ fontSize: 26 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Area with Reusable DataTable */}
      <Card sx={{ borderRadius: 3.5, overflow: "hidden" }}>
        <InquiriesFilterBar
          status={status}
          onStatusChange={handleStatusTabChange}
          search={search}
          onSearchChange={setSearch}
          stats={stats}
        />

        <DataTable
          isLoading={isLoading}
          columns={tableColumns.inquiriesMgmt}
          rows={rows}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          page={page}
          rowsPerPage={rowsPerPage}
          totalItem={total}
        />
      </Card>

      {/* Inquiry Details & Admin Notes Dialog */}
      <InquiryDetailsDialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        inquiry={selectedInquiry}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={isUpdatingStatus}
        newNoteText={newNoteText}
        setNewNoteText={setNewNoteText}
        onAddNote={handleAddNote}
        isAddingNote={isAddingNote}
      />

      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog
        open={deleteConfirm.open}
        onClose={handleCloseDeleteConfirm}
        handleConfirm={handleConfirmDelete}
        title="Delete Contact Inquiry?"
        description="Are you sure you want to delete this customer inquiry? This action cannot be undone."
        confirmLabel="Yes, Delete"
        isLoading={isDeleting}
      />
    </Stack>
  );
}

export default InquiriesMgmt;
