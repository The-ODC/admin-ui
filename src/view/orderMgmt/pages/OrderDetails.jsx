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
  Cancel,
  Done,
  LocalShipping,
  Phone,
  PhoneAndroid,
  Replay,
  Restaurant,
} from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";

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
                      ? `${VITE_APP_ASSETS_PATH}/uploads/products/${item.image}`
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
            <Typography variant="h6" gutterBottom>
              Delivery Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>
              {[deliveryAddress.line1, deliveryAddress.line2]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </Typography>
            <Typography>
              {[deliveryAddress.city, deliveryAddress.state]
                .filter(Boolean)
                .join(", ")}
              {deliveryAddress.postalCode
                ? ` - ${deliveryAddress.postalCode}`
                : ""}
            </Typography>
            <Typography>{deliveryAddress.country || "N/A"}</Typography>
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
            <Typography color="text.secondary" mt={1.5}>
              Method: {order?.delivery?.method || "N/A"}
            </Typography>
            <Typography color="text.secondary">
              Instructions: {order?.delivery?.instructions || "N/A"}
            </Typography>
          </Card>

          <Card>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" mb={1}>
              <strong>Customer:</strong> {order?.notes?.customer || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Admin:</strong> {order?.notes?.admin || "N/A"}
            </Typography>
          </Card>
        </Stack>
      )}
    </>
  );
}

export default OrderDetails;
