import React from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Divider,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AddShoppingCart,
  AttachMoney,
  Cancel,
  CheckCircle,
  DeliveryDining,
  Inventory,
  LocalDining,
  NotificationImportant,
  Replay,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { COLORS, STATUS_COLORS } from "TheOdcMfUI/theme";
import { formatCurrency } from "TheOdcMfUI/utility";

function SummaryCards({ summary }) {
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {/* Card 1: Revenue */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 3,
            borderRadius: 4,
            height: 190,
            justifyContent: "space-between",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.06)} 0%, ${alpha(theme.palette.success.main, 0.01)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.14)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, theme.palette.mode === "light" ? 0.18 : 0.28)}`,
            boxShadow:
              theme.palette.mode === "light"
                ? `0 4px 20px ${alpha(theme.palette.success.main, 0.06)}`
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.2)}`,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                borderRadius: "16px",
                backgroundColor: alpha(
                  theme.palette.success.main,
                  theme.palette.mode === "light" ? 0.1 : 0.2
                ),
                color: COLORS.SUCCESS,
                mr: 2,
              }}
            >
              <AttachMoney sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Total Revenue
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "text.primary", mt: 0.5 }}
              >
                {formatCurrency(summary?.revenue)}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={0.5}>
            {[
              {
                icon: <LocalDining sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.COOKING,
                label: "In Kitchen",
                value: formatCurrency(summary?.cookingRevenue || 0),
              },
              {
                icon: <DeliveryDining sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.ON_THE_WAY,
                label: "On the way",
                value: formatCurrency(summary?.onTheWayRevenue || 0),
              },
            ].map(({ icon, color, label, value }) => (
              <Grid size={{ xs: 6 }} key={label}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ color, display: "flex", alignItems: "center" }}>
                    {icon}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    lineHeight={1.8}
                    fontSize="0.75rem"
                  >
                    {label}:{" "}
                    <Box
                      component="span"
                      fontWeight={700}
                      sx={{ color: "text.primary" }}
                    >
                      {value}
                    </Box>
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>

      {/* Card 2: Order Volume */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 3,
            borderRadius: 4,
            height: 190,
            justifyContent: "space-between",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.18 : 0.28)}`,
            boxShadow:
              theme.palette.mode === "light"
                ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.06)}`
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                borderRadius: "16px",
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "light" ? 0.1 : 0.2
                ),
                color: COLORS.PRIMARY,
                mr: 2,
              }}
            >
              <AddShoppingCart sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Order Volume
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "text.primary", mt: 0.5 }}
              >
                {summary.totalOrders || 0}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Grid container spacing={0.5}>
            {[
              {
                icon: <NotificationImportant sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.NEW,
                label: "New",
                value: summary.pendingAcceptance || 0,
              },
              {
                icon: <LocalDining sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.COOKING,
                label: "Cooking",
                value: summary.processing || 0,
              },
              {
                icon: <DeliveryDining sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.ON_THE_WAY,
                label: "On the way",
                value: summary.outForDelivery || 0,
              },
              {
                icon: <CheckCircle sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.DELIVERED,
                label: "Delivered",
                value: summary.deliveredOrders || 0,
              },
              {
                icon: <Replay sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.RETURNED,
                label: "Returned",
                value: summary.returnedOrders || 0,
              },
              {
                icon: <Cancel sx={{ fontSize: 13 }} />,
                color: STATUS_COLORS.CANCELLED,
                label: "Cancelled",
                value: summary.cancelledOrders || 0,
              },
            ].map(({ icon, color, label, value }) => (
              <Grid size={{ xs: 6 }} key={label}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ color, display: "flex", alignItems: "center" }}>
                    {icon}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    lineHeight={1.8}
                    fontSize="0.75rem"
                  >
                    {label}:{" "}
                    <Box
                      component="span"
                      fontWeight={700}
                      sx={{ color: "text.primary" }}
                    >
                      {value}
                    </Box>
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>

      {/* Card 3: Inventory */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 3,
            borderRadius: 4,
            height: 190,
            justifyContent: "space-between",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background:
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, theme.palette.mode === "light" ? 0.15 : 0.25)}`,
            boxShadow:
              theme.palette.mode === "light"
                ? `0 4px 20px ${alpha(theme.palette.secondary.main, 0.05)}`
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: `0 12px 32px ${alpha(theme.palette.secondary.main, 0.18)}`,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                borderRadius: "16px",
                backgroundColor: alpha(
                  theme.palette.secondary.main,
                  theme.palette.mode === "light" ? 0.08 : 0.18
                ),
                color: "secondary.main",
                mr: 2,
              }}
            >
              <Inventory sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                Dishes & Menu
              </Typography>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: "text.primary", mt: 0.5 }}
              >
                {summary.totalProducts || 0}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontSize="0.75rem"
            >
              Active:{" "}
              <strong>
                {Math.max(
                  (summary.totalProducts || 0) - (summary.outOfStock || 0),
                  0
                )}
              </strong>
            </Typography>
            <Chip
              size="small"
              label={
                summary.outOfStock > 0
                  ? `Out of Stock: ${summary.outOfStock}`
                  : "All In Stock"
              }
              color={summary.outOfStock > 0 ? "error" : "success"}
              sx={{
                fontSize: "0.7rem",
                height: 20,
                borderRadius: "6px",
                fontWeight: 700,
              }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

SummaryCards.propTypes = {
  summary: PropTypes.object.isRequired,
};

export default SummaryCards;
