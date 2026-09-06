import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Close, Email, Phone } from "@mui/icons-material";

import { RenderIf } from "TheOdcMfUI/helpers";
import { Button, StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency, formatDate, getInitials } from "TheOdcMfUI/utility";

export default function CustomerProfilePanel({
  selectedCustomerSession,
  setInfoOpen,
  linkedOrder,
  linkedOrderId,
  recentOrders,
  handleSelectOrder,
}) {
  const theme = useTheme();
  const cust = selectedCustomerSession?.customer;
  if (!cust) return null;

  const fullName = `${cust.firstName || ""} ${cust.lastName || ""}`.trim();
  const initials = getInitials(fullName) || "C";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: 320,
        bgcolor:
          theme.palette.mode === "light"
            ? "background.paper"
            : "background.default",
      }}
    >
      {/* Panel Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Customer Profile
        </Typography>
        <IconButton onClick={() => setInfoOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          p: 2.5,
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Profile Card */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontSize: "1.5rem",
              fontWeight: 700,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              mb: 1,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={800}>
            {cust.firstName} {cust.lastName}
          </Typography>

          <StatusChip status={cust.status || "active"} />

          <Stack spacing={1} sx={{ width: "100%", mt: 1.5, textAlign: "left" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Email sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ width: "calc(100% - 24px)" }}
              >
                {cust.email}
              </Typography>
            </Box>
            <RenderIf render={Boolean(cust.phone)}>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {cust.phone}
                </Typography>
              </Box>
            </RenderIf>
          </Stack>
        </Box>

        <Divider />

        {/* Linked Order Banner */}
        <RenderIf render={Boolean(linkedOrder)}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "primary.light",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(255, 153, 51, 0.05)"
                  : "rgba(255, 153, 51, 0.12)",
            }}
          >
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight={700}
              sx={{ display: "block", mb: 0.5 }}
            >
              LINKED ORDER
            </Typography>
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
              {linkedOrder?.orderId}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption" color="text.secondary">
                INR{" "}
                {formatCurrency(linkedOrder?.totalAmount, {
                  showSymbol: false,
                })}
              </Typography>
              <StatusChip status={linkedOrder?.status} />
            </Box>
          </Box>
        </RenderIf>

        {/* Recent Orders List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{ textTransform: "uppercase" }}
          >
            Recent Orders ({recentOrders.length})
          </Typography>

          <RenderIf render={recentOrders.length === 0}>
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ py: 2 }}
            >
              No orders placed yet.
            </Typography>
          </RenderIf>

          <RenderIf render={recentOrders.length > 0}>
            {recentOrders.map((order) => {
              const orderKey = order._id || order.id;
              const isLinked = orderKey && orderKey === linkedOrderId;

              return (
                <Box
                  key={orderKey || order.orderId}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isLinked ? "primary.main" : "divider",
                    backgroundColor: isLinked
                      ? theme.palette.mode === "light"
                        ? "rgba(255, 153, 51, 0.04)"
                        : "rgba(255, 153, 51, 0.08)"
                      : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      borderColor: isLinked ? "primary.main" : "text.secondary",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Link
                      component={RouterLink}
                      to={`/order-management/${order.orderId}`}
                      onClick={() => setInfoOpen(false)}
                      sx={{
                        color: "primary.main",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "primary.dark",
                        },
                      }}
                    >
                      {order.orderId}
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.orderDate)}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" fontWeight={700}>
                      INR{" "}
                      {formatCurrency(order.totalAmount, { showSymbol: false })}
                    </Typography>
                    <StatusChip status={order.status} />
                  </Box>

                  <Button
                    size="small"
                    variant={isLinked ? "contained" : "outlined"}
                    onClick={() => {
                      handleSelectOrder(order);
                      setInfoOpen(false);
                    }}
                    sx={{
                      mt: 0.5,
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      py: 0.3,
                      borderRadius: 2,
                    }}
                  >
                    {isLinked ? "Select Again" : "Select Order"}
                  </Button>
                </Box>
              );
            })}
          </RenderIf>
        </Box>
      </Box>
    </Box>
  );
}

CustomerProfilePanel.propTypes = {
  selectedCustomerSession: PropTypes.object,
  setInfoOpen: PropTypes.func.isRequired,
  linkedOrder: PropTypes.object,
  linkedOrderId: PropTypes.string,
  recentOrders: PropTypes.array.isRequired,
  handleSelectOrder: PropTypes.func.isRequired,
};
