import React from "react";
import { Stack } from "@mui/material";

import { PageHeader } from "../../../sharedComponents";
import {
  AnalyticsCharts,
  DashboardSkeleton,
  ManagementShortcuts,
  RecentActivityTables,
  SummaryCards,
  TimeframeFilter,
} from "../components";

import { useDashboard } from "../hooks";

function Dashboard() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Timeframe State
     */
    timeframe,
    setTimeframe,

    /*
      Computed API Data & Memos
     */
    summary,
    salesOverview,
    productDemandAnalytics,
    recentOrders,
    newUsers,
    customOrderColumns,
    customUserColumns,

    /*
      RTK Query API State Indicators
     */
    isLoading,
    isFetching,
  } = useDashboard();

  const showSkeleton = isLoading || isFetching;

  return (
    <>
      <PageHeader pageTitle="Dashboard" hideExportBtn>
        <TimeframeFilter value={timeframe} onChange={setTimeframe} />
      </PageHeader>
      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <Stack spacing={4}>
          {/* Top Summary Metric Cards */}
          <SummaryCards summary={summary} />

          {/* Analytics Charts */}
          <AnalyticsCharts
            salesOverview={salesOverview}
            productDemandAnalytics={productDemandAnalytics}
          />

          {/* Recent Orders and Users Tables */}
          <RecentActivityTables
            isLoading={isLoading}
            customOrderColumns={customOrderColumns}
            recentOrders={recentOrders}
            customUserColumns={customUserColumns}
            newUsers={newUsers}
          />

          {/* Quick Actions / Shortcuts */}
          <ManagementShortcuts />
        </Stack>
      )}
    </>
  );
}

export default Dashboard;
