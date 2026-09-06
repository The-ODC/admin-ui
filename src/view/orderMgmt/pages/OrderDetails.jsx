import React from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {
  AdminPanelSettings,
  Cancel,
  Done,
  LocalShipping,
  LocationOn,
  Person,
  Phone,
  PhoneAndroid,
  Replay,
  Restaurant,
  StickyNote2,
} from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";
import { buildAssetUrl } from "TheOdcMfUI/utility";

import { PageHeader } from "../../../sharedComponents";
import { OrderDetailsSkeleton } from "../components";

import { VITE_APP_ASSETS_PATH } from "../../../config/env";
import { useOrderDetails } from "../hooks";

const actionMap = {
  Accept: {
    label: "Accept Order",
    icon: <Done />,
    variant: "contained",
    color: "primary",
    nextStatus: "accepted",
  },
  MarkPreparing: {
    label: "Mark Preparing",
    icon: <Done />,
    variant: "contained",
    color: "primary",
    nextStatus: "preparing",
  },
  Cancel: {
    label: "Cancel Order",
    icon: <Cancel />,
    variant: "contained",
    color: "error",
    nextStatus: "cancelled",
  },
  MarkShipped: {
    label: "Mark as Shipped",
    icon: <LocalShipping />,
    variant: "contained",
    color: "primary",
    nextStatus: "shipped",
  },
  MarkOutForDelivery: {
    label: "Mark Out for Delivery",
    icon: <LocalShipping />,
    variant: "contained",
    color: "primary",
    nextStatus: "outForDelivery",
  },
  MarkDelivered: {
    label: "Mark as Delivered",
    icon: <Done />,
    variant: "contained",
    color: "success",
    nextStatus: "delivered",
  },
  Return: {
    label: "Mark as Returned",
    icon: <Replay />,
    variant: "contained",
    color: "secondary",
    nextStatus: "returned",
  },
};

function OrderDetails() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    orderId,

    /*
      Computed API Data & Memos
     */
    order,
    actions,
    deliveryAddress,
    visualizeOrderSummary,
    visualizeTimeline,
    visualizePriceSummary,

    /*
      RTK Query API State Indicators
     */
    isLoading,
    isFetching,
    isUpdatingStatus,

    /*
      Event Handler Callbacks
     */
    handleStatusUpdate,

    /*
      Presentation Helpers
     */
    formatAmount,
  } = useOrderDetails();

  return (
    <>
      <PageHeader
        pageTitle={
          <>
            Order Details -
            <Typography component="span" color="text.disabled" ml={2}>
              {`#${order?.orderId || orderId}`}
            </Typography>
          </>
        }
        hideExportBtn
        showBackBtn
      />

      {isLoading || !order?.orderId ? (
        <OrderDetailsSkeleton />
      ) : (
        <Stack spacing={3}>
          {actions.length > 0 && (
            <Card>
              <Typography variant="h6" gutterBottom>
                Admin Actions
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {actions.map((action) => {
                  const { label, icon, variant, color, nextStatus } =
                    actionMap[action];
                  return (
                    <Button
                      key={action}
                      variant={variant}
                      color={color}
                      startIcon={icon}
                      disabled={isFetching || isUpdatingStatus}
                      onClick={() => handleStatusUpdate(nextStatus)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>
            </Card>
          )}

          <Card>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Customer
                </Typography>
                <Typography variant="body1">
                  {order?.customer?.name || "N/A"}
                </Typography>
                <Typography variant="body1">
                  {order?.customer?.email || "N/A"}
                </Typography>
                <Typography variant="body1">
                  {order?.customer?.phone || "N/A"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment
                </Typography>
                <Typography variant="body1">
                  {order?.payment?.method || "N/A"} (
                  {order?.payment?.status || "N/A"})
                </Typography>
                <Typography variant="body1">
                  Txn: {order?.payment?.transactionId || "N/A"}
                </Typography>
                <Typography variant="body1">
                  Paid At: {order?.payment?.paidAt || "N/A"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Order Summary
                </Typography>
                {Object.entries(visualizeOrderSummary).map(([label, value]) => (
                  <Typography key={label} variant="body1">
                    <strong>{label}:</strong> {value || "N/A"}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Typography variant="h6" gutterBottom>
              Order Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(visualizeTimeline).map(([label, value]) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={label}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography variant="body1">{value || "N/A"}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {(order?.items || []).map((item) => (
              <Box
                key={item.productId || item.name}
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={
                    item.image
                      ? buildAssetUrl({
                          baseUrl: VITE_APP_ASSETS_PATH,
                          folderLocation: "/uploads/products",
                          fileName: item.image,
                        })
                      : undefined
                  }
                  variant="rounded"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.primary.main,
                        theme.palette.mode === "dark" ? 0.12 : 0.08
                      ),
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Restaurant sx={{ fontSize: 30 }} />
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography>{item.name || "N/A"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity || 0} x INR{" "}
                    {formatAmount(item.unitPrice)}
                  </Typography>
                </Box>
                <Typography fontWeight={600}>
                  INR {formatAmount(item.total)}
                </Typography>
              </Box>
            ))}
          </Card>

          <Card>
            <Typography variant="h6" gutterBottom>
              Price Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {Object.entries(visualizePriceSummary).map(([label, value]) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography variant="body1">INR {value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationOn color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Delivery Details
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" fontWeight={600}>
              {[deliveryAddress.line1, deliveryAddress.line2]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {[deliveryAddress.city, deliveryAddress.state]
                .filter(Boolean)
                .join(", ")}
              {deliveryAddress.postalCode
                ? ` - ${deliveryAddress.postalCode}`
                : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveryAddress.country || "N/A"}
            </Typography>

            {(deliveryAddress.phone || deliveryAddress.alternatePhone) && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                {deliveryAddress.phone && (
                  <Chip
                    icon={<Phone sx={{ fontSize: "14px !important" }} />}
                    label={`Contact: ${deliveryAddress.phone}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {deliveryAddress.alternatePhone && (
                  <Chip
                    icon={<PhoneAndroid sx={{ fontSize: "14px !important" }} />}
                    label={`Alt: ${deliveryAddress.alternatePhone}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                pt: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Delivery Method:
              </Typography>
              <Chip
                label={order?.delivery?.method || "Standard Delivery"}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {order?.delivery?.instructions && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === "dark" ? 0.08 : 0.04
                    ),
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="primary.main"
                  display="block"
                >
                  Delivery Instructions:
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 0.3 }}
                >
                  {order.delivery.instructions}
                </Typography>
              </Box>
            )}
          </Card>

          <Card>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <StickyNote2 color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Order & Staff Notes
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === "dark" ? 0.08 : 0.04
                    ),
                  border: "1px solid",
                  borderColor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.mode === "dark" ? 0.2 : 0.15
                    ),
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Person color="primary" fontSize="small" />
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    Customer Special Instructions
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color={
                    order?.notes?.customer ? "text.primary" : "text.secondary"
                  }
                  sx={{
                    fontStyle: order?.notes?.customer ? "normal" : "italic",
                  }}
                >
                  {order?.notes?.customer ||
                    "No special cooking or order instructions provided by customer."}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <AdminPanelSettings color="action" fontSize="small" />
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    Internal / Kitchen Remarks
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color={
                    order?.notes?.admin ? "text.primary" : "text.secondary"
                  }
                  sx={{ fontStyle: order?.notes?.admin ? "normal" : "italic" }}
                >
                  {order?.notes?.admin || "No internal staff remarks recorded."}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>
      )}
    </>
  );
}

export default OrderDetails;
