import React from "react";
import { Box, Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { QrCode2, Replay } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";

import { PageHeader } from "../../../sharedComponents";
import { PaymentDetailsSkeleton, RefundDialog } from "../components";
import { PaymentQrDialog } from "../../orderMgmt/components";

import { usePaymentDetails } from "../hooks";

function PaymentDetails() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    paymentId,

    /*
      RTK Query API State Indicators
     */
    isLoading,
    isRefunding,

    /*
      Computed API Data & Memos
     */
    paymentDetailsData,
    visualizePaymentDetails,
    visualizeCustomerDetails,
    visualizeRefundDetails,
    canRefund,
    canGenerateQr,

    /*
      Dialog States & Handlers
     */
    refundDialogOpen,
    paymentQrDialogOpen,
    handleOpenRefundDialog,
    handleCloseRefundDialog,
    handleOpenPaymentQrDialog,
    handleClosePaymentQrDialog,

    /*
      Event Handler Callbacks
     */
    handleConfirmRefund,
  } = usePaymentDetails();

  return (
    <>
      <PageHeader
        pageTitle={
          <>
            Payment Details -
            <Typography component="span" color="text.disabled" ml={2}>
              {`#${paymentId}`}
            </Typography>
          </>
        }
        hideExportBtn
        showBackBtn
      />
      {isLoading || !paymentDetailsData?.id ? (
        <PaymentDetailsSkeleton />
      ) : (
        <Stack spacing={3}>
          {/* Admin Payment Actions Bar */}
          {(canRefund || canGenerateQr) && (
            <Card>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Admin Payment Actions
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box display="flex" gap={2} flexWrap="wrap">
                {canRefund && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Replay />}
                    onClick={handleOpenRefundDialog}
                  >
                    Process Refund
                  </Button>
                )}

                {canGenerateQr && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<QrCode2 />}
                    onClick={handleOpenPaymentQrDialog}
                  >
                    Generate Payment QR
                  </Button>
                )}
              </Box>
            </Card>
          )}

          {/* Payment Info */}
          <Card sx={{ overflow: "hidden" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Payment Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {Object.entries(visualizePaymentDetails).map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography variant="body1">{value || "N/A"}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* Customer Info */}
          <Card sx={{ overflow: "hidden" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Customer Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {Object.entries(visualizeCustomerDetails).map(
                ([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      gutterBottom
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {value || "N/A"}
                    </Typography>
                  </Grid>
                )
              )}
            </Grid>
          </Card>

          {/* Refund Info */}
          <Card sx={{ overflow: "hidden" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Refund Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {Object.entries(visualizeRefundDetails).map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography variant="body1">{value || "N/A"}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Stack>
      )}

      {/* Admin Refund Dialog */}
      <RefundDialog
        open={refundDialogOpen}
        onClose={handleCloseRefundDialog}
        payment={paymentDetailsData}
        onConfirmRefund={handleConfirmRefund}
        isRefunding={isRefunding}
      />

      {/* Dynamic Payment QR Dialog */}
      <PaymentQrDialog
        open={paymentQrDialogOpen}
        onClose={handleClosePaymentQrDialog}
        orderId={paymentDetailsData?.orderId || ""}
        orderTotal={paymentDetailsData?.amount || 0}
        isPaid={paymentDetailsData?.status === "success"}
      />
    </>
  );
}

export default PaymentDetails;
