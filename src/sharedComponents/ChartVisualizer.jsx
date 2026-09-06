import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Typography, useTheme, Box } from "@mui/material";

import { CHART_PALETTE, COLORS } from "TheOdcMfUI/theme";

// Custom tooltip card
const CustomPieTooltip = ({ active, payload }) => {
  const theme = useTheme();

  if (active && payload && payload.length) {
    const { name, value, payload: slicePayload } = payload[0];
    const numVal = Number(value) || 0;
    const total = Number(slicePayload?.total) || (numVal > 0 ? numVal : 1);
    const pct = total > 0 ? ((numVal / total) * 100).toFixed(1) : "0.0";
    return (
      <Box
        sx={{
          background: theme.palette.background.paper,
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: "10px",
          px: 2,
          py: 1.2,
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
          minWidth: 140,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ color: theme.palette.primary.main, mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.primary }}
        >
          {numVal} orders&nbsp;&nbsp;
          <Box component="span" sx={{ color: COLORS.WARNING, fontWeight: 700 }}>
            {pct}%
          </Box>
        </Typography>
      </Box>
    );
  }
  return null;
};

CustomPieTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

const ChartVisualizer = ({
  type,
  data,
  dataKeyX,
  dataKeyY,
  width = "100%",
  height = 300,
}) => {
  const theme = useTheme();

  const chartProps = { width, height, data };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart {...chartProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis dataKey={dataKeyX} stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: "5px",
                border: "1px solid " + theme.palette.divider,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKeyY}
              stroke={theme.palette.primary.main}
              strokeWidth={2}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...chartProps} barSize={50}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis dataKey={dataKeyX} stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: "5px",
                border: "1px solid " + theme.palette.divider,
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            />
            <Legend />
            <Bar
              dataKey={dataKeyY}
              fill={theme.palette.primary.main}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey={dataKeyX}
              stroke={theme.palette.text.secondary}
              tickLine={false}
            />
            <YAxis stroke={theme.palette.text.secondary} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: "12px",
                border: "1px solid " + theme.palette.divider,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKeyY}
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      case "pie": {
        const total = data.reduce((s, d) => s + (d[dataKeyY] || 0), 0);
        const enriched = data.map((d) => ({ ...d, total }));

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: 300,
            }}
          >
            {/* Left legend */}
            <Box sx={{ flex: "0 0 auto", minWidth: 180, pr: 2 }}>
              {enriched.map((entry, index) => (
                <Box
                  key={entry[dataKeyX]}
                  display="flex"
                  alignItems="center"
                  mb={0.6}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      backgroundColor:
                        CHART_PALETTE[index % CHART_PALETTE.length],
                      flexShrink: 0,
                      mr: 1,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 110,
                    }}
                    title={entry[dataKeyX]}
                  >
                    {entry[dataKeyX]}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ color: "text.primary", ml: 1 }}
                  >
                    {entry[dataKeyY]}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Donut */}
            <Box sx={{ flex: 1, height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={enriched}
                    dataKey={dataKeyY}
                    nameKey={dataKeyX}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {enriched.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        );
      }

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" {...chartProps}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey={dataKeyX}
              stroke={theme.palette.text.primary}
            />
            <PolarRadiusAxis stroke={theme.palette.text.primary} />
            <Radar
              name="Value"
              dataKey={dataKeyY}
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: "5px",
                border: "1px solid " + theme.palette.divider,
              }}
            />
            <Legend />
          </RadarChart>
        );

      default:
        return <Typography color="error">Invalid chart type</Typography>;
    }
  };

  // Pie chart has its own internal layout — don't wrap in ResponsiveContainer
  if (type === "pie") {
    return renderChart();
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

ChartVisualizer.propTypes = {
  type: PropTypes.oneOf(["line", "bar", "area", "pie", "radar"]).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKeyX: PropTypes.string.isRequired,
  dataKeyY: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ChartVisualizer;
