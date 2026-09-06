import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Card, Grid, Typography, alpha, useTheme } from "@mui/material";
import { Group, Inventory, LocalDining } from "@mui/icons-material";

import { Button } from "TheOdcMfUI/sharedComp";

function ManagementShortcuts() {
  const theme = useTheme();
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Quick Management Shortcuts
      </Typography>
      <Grid container spacing={3}>
        {/* Shortcut 1 */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 3.5,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              justifyContent: "space-between",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background:
                theme.palette.mode === "light"
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.005)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.015)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.12 : 0.2)}`,
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.12)}`,
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "16px",
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "light" ? 0.08 : 0.18
                  ),
                  color: "primary.main",
                  display: "inline-flex",
                  mb: 2.5,
                }}
              >
                <LocalDining sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                List New Dish
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                mb={3}
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                Add new items to the menu, adjust regular and offer pricing,
                assign categories and cuisine types.
              </Typography>
            </Box>
            <Button
              variant="contained"
              component={NavLink}
              to="/dish-management/add-dish"
              fullWidth
              sx={{
                borderRadius: "50px",
                py: 1.2,
                fontWeight: 700,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
              }}
            >
              Add Dish
            </Button>
          </Card>
        </Grid>

        {/* Shortcut 2 */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 3.5,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              justifyContent: "space-between",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background:
                theme.palette.mode === "light"
                  ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.005)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.015)} 100%)`,
              border: `1px solid ${alpha(theme.palette.secondary.main, theme.palette.mode === "light" ? 0.12 : 0.2)}`,
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: `0 12px 30px ${alpha(theme.palette.secondary.main, 0.12)}`,
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "16px",
                  backgroundColor: alpha(
                    theme.palette.secondary.main,
                    theme.palette.mode === "light" ? 0.08 : 0.18
                  ),
                  color: "secondary.main",
                  display: "inline-flex",
                  mb: 2.5,
                }}
              >
                <Inventory sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Dispatcher
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                mb={3}
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                Monitor live customer orders, update delivery timeline tracking,
                and dispatch orders to riders.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              component={NavLink}
              to="/order-management"
              fullWidth
              sx={{
                borderRadius: "50px",
                py: 1.2,
                fontWeight: 700,
                boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.3)}`,
                "&:hover": {
                  boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.5)}`,
                },
              }}
            >
              View Orders
            </Button>
          </Card>
        </Grid>

        {/* Shortcut 3 */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 3.5,
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              height: "100%",
              justifyContent: "space-between",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background:
                theme.palette.mode === "light"
                  ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.success.main, 0.005)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.015)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, theme.palette.mode === "light" ? 0.12 : 0.2)}`,
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: `0 12px 30px ${alpha(theme.palette.success.main, 0.12)}`,
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "16px",
                  backgroundColor: alpha(
                    theme.palette.success.main,
                    theme.palette.mode === "light" ? 0.08 : 0.18
                  ),
                  color: theme.palette.success.main,
                  display: "inline-flex",
                  mb: 2.5,
                }}
              >
                <Group sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                User Directory
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                mb={3}
                sx={{ opacity: 0.8, lineHeight: 1.6 }}
              >
                Browse registered customers, inspect account stats, review total
                expenditures, and manage verification status.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              component={NavLink}
              to="/user-management"
              fullWidth
              sx={{
                borderRadius: "50px",
                py: 1.2,
                fontWeight: 700,
                backgroundColor: theme.palette.success.main,
                color: "#fff",
                boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.3)}`,
                "&:hover": {
                  backgroundColor: "success.dark",
                  boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.5)}`,
                },
              }}
            >
              Manage Users
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManagementShortcuts;
