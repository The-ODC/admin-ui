import React from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Badge,
  Box,
  Card,
  Chip,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Search, ShoppingBag, SupportAgent } from "@mui/icons-material";

import { RenderIf } from "TheOdcMfUI/helpers";
import { Button } from "TheOdcMfUI/sharedComp";
import { formatTime, getInitials } from "TheOdcMfUI/utility";

export default function SidebarSessionsList({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  isSessionsLoading,
  filteredSessions,
  selectedCustomerId,
  setSelectedCustomerId,
}) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 20px rgba(0,0,0,0.02)"
            : "0 4px 20px rgba(0,0,0,0.15)",
      }}
    >
      {/* Search filter */}
      <TextField
        id="support-search-input"
        fullWidth
        size="small"
        placeholder="Search customers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          },
        }}
        sx={{ mb: 2 }}
      />

      {/* Quick tabs */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          id="support-active-tab"
          variant={activeTab === "active" ? "contained" : "outlined"}
          onClick={() => setActiveTab("active")}
          size="small"
          fullWidth
          sx={{
            borderRadius: "50px",
            fontSize: "0.8rem",
            py: 0.6,
          }}
        >
          Active
        </Button>
        <Button
          id="support-resolved-tab"
          variant={activeTab === "resolved" ? "contained" : "outlined"}
          onClick={() => setActiveTab("resolved")}
          size="small"
          fullWidth
          sx={{
            borderRadius: "50px",
            fontSize: "0.8rem",
            py: 0.6,
          }}
        >
          Resolved
        </Button>
      </Stack>

      <Divider />

      {/* Conversations list */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 2 }}>
        <RenderIf render={isSessionsLoading}>
          <List disablePadding>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1.5,
                  mb: 1,
                  borderRadius: 3,
                  gap: 1.5,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={0.5}
                  >
                    <Skeleton width="50%" height={18} />
                    <Skeleton width="20%" height={14} />
                  </Box>
                  <Skeleton width="75%" height={14} />
                </Box>
              </Box>
            ))}
          </List>
        </RenderIf>

        <RenderIf render={!isSessionsLoading && filteredSessions.length === 0}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={8}
            textAlign="center"
          >
            <SupportAgent
              sx={{
                fontSize: 40,
                color: "text.secondary",
                opacity: 0.4,
                mb: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              No support chats found.
            </Typography>
          </Box>
        </RenderIf>

        <RenderIf render={!isSessionsLoading && filteredSessions.length > 0}>
          <List disablePadding>
            {filteredSessions.map((session) => {
              const cust = session.customer;
              const isSelected = cust._id === selectedCustomerId;
              const fullName =
                `${cust.firstName || ""} ${cust.lastName || ""}`.trim();
              const initials = getInitials(fullName) || "C";
              const isPending = session.status === "pending";

              return (
                <ListItemButton
                  key={session._id}
                  selected={isSelected}
                  onClick={() => setSelectedCustomerId(cust._id)}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    p: 1.5,
                    border: isSelected ? "1px solid" : "1px solid transparent",
                    borderColor: isSelected ? "primary.main" : "transparent",
                    backgroundColor: isSelected
                      ? theme.palette.mode === "light"
                        ? "rgba(255, 153, 51, 0.05)"
                        : "rgba(255, 153, 51, 0.12)"
                      : "transparent",
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Badge
                      badgeContent={session.unreadCount || 0}
                      color="error"
                      invisible={!session.unreadCount}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          backgroundColor: isSelected
                            ? "primary.main"
                            : "secondary.main",
                          color: isSelected
                            ? "primary.contrastText"
                            : "secondary.contrastText",
                        }}
                      >
                        {initials}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={1}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isSelected ? 700 : 600}
                          noWrap
                          sx={{ flexGrow: 1, minWidth: 0 }}
                        >
                          {cust.firstName} {cust.lastName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
                        >
                          {formatTime(session.lastMessageAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          gap={1}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{
                              flexGrow: 1,
                              minWidth: 0,
                              fontWeight:
                                isPending || session.unreadCount > 0
                                  ? 700
                                  : 400,
                              color:
                                isPending || session.unreadCount > 0
                                  ? "text.primary"
                                  : "text.secondary",
                            }}
                          >
                            {session.lastMessage || "No messages yet"}
                          </Typography>
                          <RenderIf render={isPending}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "error.main",
                                flexShrink: 0,
                              }}
                            />
                          </RenderIf>
                        </Box>
                        <RenderIf render={Boolean(session.linkedOrder)}>
                          <Chip
                            icon={<ShoppingBag sx={{ fontSize: 14 }} />}
                            label={session.linkedOrder?.orderId}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{
                              mt: 0.75,
                              height: 22,
                              maxWidth: "100%",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                            }}
                          />
                        </RenderIf>
                      </Box>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        </RenderIf>
      </Box>
    </Card>
  );
}

SidebarSessionsList.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isSessionsLoading: PropTypes.bool.isRequired,
  filteredSessions: PropTypes.array.isRequired,
  selectedCustomerId: PropTypes.string,
  setSelectedCustomerId: PropTypes.func.isRequired,
};
