import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Close,
  ContentCopy,
  Download,
  Print,
  QrCode2,
} from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { usePaymentQrDialog } from "../hooks";

function PaymentQrDialog({ open, onClose, orderId, orderTotal, isPaid }) {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    isDark,

    /*
      RTK Query API State Indicators
     */
    isLoadingQr,
    isQrError,
    isCollecting,

    /*
      Computed API Data & Memos
     */
    payableAmount,
    qrCodeDataUrl,
    upiId,

    /*
      Event Handler Callbacks
     */
    handleCopyUpi,
    handleDownloadQr,
    handlePrintQr,
    handleMarkAsPaid,
  } = usePaymentQrDialog({ open, onClose, orderId, orderTotal, isPaid });

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={isCollecting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: { sm: "20px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QrCode2 />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Collect Payment QR
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Order #{orderId}
            </Typography>
          </Box>
        </Box>

        {!isCollecting && (
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent
        sx={{
          pt: "24px !important",
          pb: "0px !important",
          overflowX: "hidden",
          textAlign: "center",
        }}
      >
        {isLoadingQr ? (
          <Box py={6}>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary" mt={2}>
              Generating dynamic UPI QR code...
            </Typography>
          </Box>
        ) : isQrError || !qrCodeDataUrl ? (
          <Alert severity="error" sx={{ my: 2 }}>
            Failed to generate QR code for this order. Please check order
            details.
          </Alert>
        ) : (
          <Stack spacing={2} alignItems="center">
            {/* Amount Banner */}
            <Box
              sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                border: "1px solid",
                borderColor: "primary.main",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Total Amount to Collect
              </Typography>
              <Typography variant="h5" fontWeight={900} color="primary.main">
                {formatCurrency(payableAmount)}
              </Typography>
            </Box>

            {/* QR Code Frame */}
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#FFFFFF",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                border: "2px solid",
                borderColor: "divider",
                display: "inline-block",
              }}
            >
              <Avatar
                src={qrCodeDataUrl}
                variant="square"
                sx={{
                  width: 220,
                  height: 220,
                  mx: "auto",
                  imageRendering: "pixelated",
                }}
              />
              <Typography
                variant="caption"
                fontWeight={700}
                color="#000000"
                display="block"
                mt={1}
              >
                Scan with any UPI App
              </Typography>
            </Card>

            {/* Supported App Badges */}
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={0.8}
            >
              {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                <Chip
                  key={app}
                  label={app}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                />
              ))}
            </Box>

            {/* UPI ID Details */}
            <Box
              sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 2,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                border: "1px dashed",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box textAlign="left">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  UPI ID (VPA)
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {upiId}
                </Typography>
              </Box>

              <Box display="flex" gap={0.5}>
                <Tooltip title="Copy UPI Payment Link">
                  <IconButton
                    size="small"
                    onClick={handleCopyUpi}
                    color="primary"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download QR Code">
                  <IconButton
                    size="small"
                    onClick={handleDownloadQr}
                    color="primary"
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print QR Code">
                  <IconButton
                    size="small"
                    onClick={handlePrintQr}
                    color="primary"
                  >
                    <Print fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: "24px", gap: 1.5 }}>
        <Button variant="outlined" onClick={onClose} disabled={isCollecting}>
          Close
        </Button>

        {!isPaid && (
          <Button
            variant="contained"
            color="success"
            disabled={isCollecting || isLoadingQr || isQrError}
            startIcon={
              isCollecting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <CheckCircle />
              )
            }
            onClick={handleMarkAsPaid}
          >
            {isCollecting ? "Updating..." : "Mark as Paid via QR"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

PaymentQrDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  orderTotal: PropTypes.number,
  isPaid: PropTypes.bool,
};

export default PaymentQrDialog;
