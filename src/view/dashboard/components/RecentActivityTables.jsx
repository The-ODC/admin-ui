import React from "react";
import { Grid, Card, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

import { DataTable } from "../../../sharedComponents";

function RecentActivityTables({
  isLoading,
  customOrderColumns,
  recentOrders,
  customUserColumns,
  newUsers,
}) {
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {/* Recent Orders */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.02)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid " + theme.palette.divider,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recent Orders
          </Typography>
          <DataTable
            columns={customOrderColumns}
            rows={recentOrders}
            hidePagination
            isLoading={isLoading}
            maxHeight="330px"
            minHeight="auto"
            sx={{
              background: "transparent",
              boxShadow: "none",
            }}
          />
        </Card>
      </Grid>

      {/* Newly Registered Users */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.02)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid " + theme.palette.divider,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Newly Registered Users
          </Typography>
          <DataTable
            columns={customUserColumns}
            rows={newUsers}
            hidePagination
            isLoading={isLoading}
            maxHeight="330px"
            minHeight="auto"
            sx={{
              background: "transparent",
              boxShadow: "none",
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

RecentActivityTables.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  customOrderColumns: PropTypes.array.isRequired,
  recentOrders: PropTypes.array.isRequired,
  customUserColumns: PropTypes.array.isRequired,
  newUsers: PropTypes.array.isRequired,
};

export default RecentActivityTables;
