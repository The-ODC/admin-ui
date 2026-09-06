import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  Box,
  Stack,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Slide,
  TextField,
  IconButton,
} from "@mui/material";
import {
  NotificationImportant,
  CheckCircle,
  Cancel,
  Phone,
  PhoneAndroid,
  VolumeUp,
  VolumeOff,
  ShoppingBag,
} from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { useOrderQueueNotifier } from "./hooks";

// Dialog slide-up transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderQueueNotifier() {
  const {
    incomingQueue,
    isAudioBlocked,
    isMuted,
    setIsMuted,
    isProcessing,
    cancellationReason,
    setCancellationReason,
    products,
    activeOrder,
    isStockAvailable,
    handleAccept,
    handleDecline,
    handleUnlockAudio,
  } = useOrderQueueNotifier();

  if (!activeOrder) {
    return (
      <>
        {isAudioBlocked && (
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              bgcolor: "error.main",
              color: "error.contrastText",
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              animation: "pulse 2s infinite ease-in-out",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
                "100%": { transform: "scale(1)" },
              },
            }}
            onClick={handleUnlockAudio}
          >
            <VolumeOff fontSize="small" />
            <Typography variant="caption" fontWeight="bold">
              Click to enable order sound alerts
            </Typography>
          </Box>
        )}
      </>
    );
  }

  return (
    <>
      <Dialog
        open={Boolean(activeOrder)}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: "none",
            bgcolor: "background.paper",
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          },
        }}
      >
        {/* Header section with ringing alert indicator */}
        <Box
          sx={{
            bgcolor: "error.main",
            color: "error.contrastText",
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <NotificationImportant
              sx={{
                fontSize: 32,
                animation: "ring 0.5s infinite alternate ease-in-out",
                "@keyframes ring": {
                  "0%": { transform: "rotate(-15deg)" },
                  "100%": { transform: "rotate(15deg)" },
                },
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Incoming Order! ({incomingQueue.length} in Queue)
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Order ID: {activeOrder.orderId}
              </Typography>
            </Box>
          </Box>

          <IconButton
            color="inherit"
            onClick={() => setIsMuted(!isMuted)}
            size="small"
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {isAudioBlocked && (
              <Alert
                severity="warning"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleUnlockAudio}
                  >
                    Unmute
                  </Button>
                }
              >
                Autoplay sound is currently blocked by browser. Click unmute to
                enable ringtone.
              </Alert>
            )}

            {/* Customer Details Card */}
            <Paper
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 3, bgcolor: "action.hover" }}
            >
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                Customer Info
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 4 }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", sm: "block" } }}
                  />
                }
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {activeOrder.customer?.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {activeOrder.customer?.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {activeOrder.customer?.phone || "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Items Table */}
            <Box>
              <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                <ShoppingBag color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={800}>
                  Items List
                </Typography>
              </Stack>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: "action.selected" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Qty
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeOrder.items?.map((item, index) => {
                      const product = products.find(
                        (p) =>
                          p.id === item.productId || p._id === item.productId
                      );
                      const currentStock = product ? product.stock : 0;
                      const hasInsufficientStock =
                        product && currentStock < item.quantity;
                      return (
                        <TableRow
                          key={`${item.productId}-${index + 1}`}
                          sx={
                            hasInsufficientStock
                              ? {
                                  bgcolor: "rgba(211, 47, 47, 0.08)",
                                  "&:hover": {
                                    bgcolor: "rgba(211, 47, 47, 0.12)",
                                  },
                                }
                              : {}
                          }
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {item.name}
                            {hasInsufficientStock && (
                              <Typography
                                variant="caption"
                                color="error.main"
                                display="block"
                                fontWeight={700}
                                sx={{ mt: 0.5 }}
                              >
                                (Insufficient Stock: Only {currentStock} left)
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            ₹{item.unitPrice?.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">x{item.quantity}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            ₹{item.total?.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Totals Summary */}
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Grand Total:
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 800,
                          color: "primary.main",
                          fontSize: "1.1rem",
                        }}
                      >
                        {formatCurrency(activeOrder.totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Cancellation Comment / Admin Notes */}
            {activeOrder && (
              <Box>
                {!isStockAvailable && (
                  <Alert
                    severity="error"
                    sx={{ borderRadius: 3, mb: 2, fontWeight: 700 }}
                  >
                    Cannot accept order: Insufficient stock for some items.
                    Please decline the order and specify the reason.
                  </Alert>
                )}
                <TextField
                  label="Reason for Cancellation / Admin Notes"
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Specify reason for cancelling this order..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            {/* Delivery Details */}
            {activeOrder.delivery?.address && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Delivery Address
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {[
                    activeOrder.delivery.address.line1,
                    activeOrder.delivery.address.line2,
                    activeOrder.delivery.address.city,
                    activeOrder.delivery.address.state,
                    activeOrder.delivery.address.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
                {(activeOrder.delivery.address.phone ||
                  activeOrder.delivery.address.alternatePhone) && (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1 }}
                  >
                    {activeOrder.delivery.address.phone && (
                      <Chip
                        icon={<Phone sx={{ fontSize: "14px !important" }} />}
                        label={activeOrder.delivery.address.phone}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                      />
                    )}
                    {activeOrder.delivery.address.alternatePhone && (
                      <Chip
                        icon={
                          <PhoneAndroid sx={{ fontSize: "14px !important" }} />
                        }
                        label={`Alt: ${activeOrder.delivery.address.alternatePhone}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                      />
                    )}
                  </Box>
                )}
                {activeOrder.delivery.instructions && (
                  <Box mt={1.5} p={1} bgcolor="action.hover" borderRadius={1.5}>
                    <Typography
                      variant="caption"
                      color="warning.main"
                      fontWeight={700}
                    >
                      Instructions:
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      {activeOrder.delivery.instructions}
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDecline}
            disabled={isProcessing}
            startIcon={<Cancel />}
            sx={{
              flex: 1,
              borderRadius: "50px",
              py: 1.2,
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Decline Order
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAccept}
            disabled={isProcessing || !isStockAvailable}
            startIcon={<CheckCircle />}
            sx={{
              flex: 1,
              borderRadius: "50px",
              py: 1.2,
              fontWeight: 800,
              textTransform: "none",
              bgcolor:
                isProcessing || !isStockAvailable
                  ? "action.disabledBackground"
                  : "success.main",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            Accept Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
