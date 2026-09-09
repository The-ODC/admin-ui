import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close, CurrencyRupee, Replay } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { standardReasons, useRefundDialog } from "../hooks";

function RefundDialog({
  open,
  onClose,
  payment,
  onConfirmRefund,
  isRefunding,
}) {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    isDark,

    /*
      Form State & Errors
     */
    refundAmount,
    setRefundAmount,
    selectedReason,
    setSelectedReason,
    customReason,
    setCustomReason,
    error,
    setError,

    /*
      Computed API Data & Memos
     */
    maxAmount,

    /*
      Event Handler Callbacks
     */
    handleSubmit,
  } = useRefundDialog({ open, payment, onConfirmRefund });

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={isRefunding ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
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
                bgcolor: "warning.main",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Replay />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Process Payment Refund
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Order #{payment?.orderId} • Payment #
                {payment?.id || payment?._id}
              </Typography>
            </Box>
          </Box>

          {!isRefunding && (
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
          }}
        >
          <Stack spacing={2.5}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Original Transaction Amount
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  {formatCurrency(maxAmount)}
                </Typography>
              </Box>

              <Box textAlign="right">
                <Typography variant="body2" color="text.secondary">
                  Payment Gateway
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {payment?.paymentGateway || payment?.method || "Online"}
                </Typography>
              </Box>
            </Box>

            <TextField
              label="Refund Amount (₹)"
              type="number"
              fullWidth
              value={refundAmount}
              onChange={(e) => {
                setRefundAmount(e.target.value);
                setError("");
              }}
              disabled={isRefunding}
              slotProps={{
                input: {
                  startAdornment: (
                    <CurrencyRupee sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                },
              }}
              helperText={`Maximum refundable amount: ${formatCurrency(maxAmount)}`}
            />

            <FormControl fullWidth>
              <InputLabel id="refund-reason-label">Refund Reason</InputLabel>
              <Select
                labelId="refund-reason-label"
                value={selectedReason}
                label="Refund Reason"
                onChange={(e) => setSelectedReason(e.target.value)}
                disabled={isRefunding}
              >
                {standardReasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedReason === "Other administrative reason" && (
              <TextField
                label="Custom Reason Notes"
                fullWidth
                multiline
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                disabled={isRefunding}
                placeholder="Enter detailed reason for the refund..."
              />
            )}

            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                This action is irreversible. The refund will be registered in
                the system and processed back via Stripe for online card/UPI
                transactions.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ padding: "24px", gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose} disabled={isRefunding}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="error"
            disabled={isRefunding}
            startIcon={<Replay />}
          >
            {isRefunding
              ? "Processing..."
              : `Confirm Refund (${formatCurrency(Number(refundAmount) || 0)})`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

RefundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  payment: PropTypes.object,
  onConfirmRefund: PropTypes.func.isRequired,
  isRefunding: PropTypes.bool,
};

export default RefundDialog;
