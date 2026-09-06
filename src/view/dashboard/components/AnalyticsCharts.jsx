import React from "react";
import { Grid, Card, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";

import { ChartVisualizer } from "../../../sharedComponents";

function AnalyticsCharts({ salesOverview, productDemandAnalytics }) {
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {/* Sales Overview Area Chart */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.02)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid " + theme.palette.divider,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 10px 30px rgba(0,0,0,0.06)"
                  : "0 10px 30px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Sales Overview (Monthly Revenue)
          </Typography>
          <ChartVisualizer
            type="area"
            data={salesOverview}
            dataKeyX="month"
            dataKeyY="revenue"
          />
        </Card>
      </Grid>

      {/* Donut Chart */}
      <Grid size={{ xs: 12, lg: 5 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "light"
                ? "0 4px 20px rgba(0,0,0,0.02)"
                : "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid " + theme.palette.divider,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow:
                theme.palette.mode === "light"
                  ? "0 10px 30px rgba(0,0,0,0.06)"
                  : "0 10px 30px rgba(0,0,0,0.2)",
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Product Demand Analytics
          </Typography>
          <ChartVisualizer
            type="pie"
            data={productDemandAnalytics}
            dataKeyX="name"
            dataKeyY="quantitySold"
          />
        </Card>
      </Grid>
    </Grid>
  );
}

AnalyticsCharts.propTypes = {
  salesOverview: PropTypes.array.isRequired,
  productDemandAnalytics: PropTypes.array.isRequired,
};

export default AnalyticsCharts;
