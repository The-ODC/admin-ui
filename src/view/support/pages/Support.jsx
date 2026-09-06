import React from "react";
import { Drawer, Grid } from "@mui/material";

import { PageHeader } from "../../../sharedComponents";
import {
  ChatWindow,
  CustomerProfilePanel,
  SidebarSessionsList,
} from "../components";

import { useSupport } from "../hooks";

function Support() {
  const {
    isMobile,
    selectedCustomerId,
    setSelectedCustomerId,
    searchQuery,
    setSearchQuery,
    messageText,
    setMessageText,
    activeTab,
    setActiveTab,
    infoOpen,
    setInfoOpen,
    messagesEndRef,
    isSessionsLoading,
    isMessagesLoading,
    isSending,
    messages,
    recentOrders,
    linkedOrder,
    linkedOrderId,
    selectedCustomerSession,
    filteredSessions,
    handleSend,
    handleResolve,
    handleSelectOrder,
  } = useSupport();

  return (
    <>
      <PageHeader pageTitle="Customer Support Center" hideExportBtn />

      <Grid container spacing={3} sx={{ height: "calc(100vh - 170px)" }}>
        {/* Left Pane - Customer list sidebar */}
        <Grid
          size={{ xs: 12, lg: 3.5 }}
          sx={{
            height: "100%",
            display: { xs: selectedCustomerId ? "none" : "block", lg: "block" },
          }}
        >
          <SidebarSessionsList
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSessionsLoading={isSessionsLoading}
            filteredSessions={filteredSessions}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={setSelectedCustomerId}
          />
        </Grid>

        {/* Right Pane - Chat content arena */}
        <Grid
          size={{ xs: 12, lg: 8.5 }}
          sx={{
            height: "100%",
            display: { xs: selectedCustomerId ? "block" : "none", lg: "block" },
          }}
        >
          <ChatWindow
            selectedCustomerSession={selectedCustomerSession}
            setSelectedCustomerId={setSelectedCustomerId}
            isMobile={isMobile}
            infoOpen={infoOpen}
            setInfoOpen={setInfoOpen}
            handleResolve={handleResolve}
            isMessagesLoading={isMessagesLoading}
            messages={messages}
            messagesEndRef={messagesEndRef}
            messageText={messageText}
            setMessageText={setMessageText}
            isSending={isSending}
            handleSend={handleSend}
          />
        </Grid>
      </Grid>

      {/* Customer Profile & Orders Drawer Panel */}
      <Drawer
        anchor="right"
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
          },
        }}
      >
        <CustomerProfilePanel
          selectedCustomerSession={selectedCustomerSession}
          setInfoOpen={setInfoOpen}
          linkedOrder={linkedOrder}
          linkedOrderId={linkedOrderId}
          recentOrders={recentOrders}
          handleSelectOrder={handleSelectOrder}
        />
      </Drawer>
    </>
  );
}

export default Support;
