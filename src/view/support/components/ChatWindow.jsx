import React from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack,
  CheckCircle,
  InfoOutlined,
  Message,
  Send,
  SupportAgent,
} from "@mui/icons-material";

import { RenderIf } from "TheOdcMfUI/helpers";
import { Button } from "TheOdcMfUI/sharedComp";
import { formatTime, getInitials } from "TheOdcMfUI/utility";

const getDateLabel = (dateStr) => {
  if (!dateStr) return "";
  const messageDate = new Date(dateStr);
  const today = new Date();

  // Clear times to compare only dates
  const messageDateClean = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );
  const todayClean = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffTime = todayClean - messageDateClean;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

export default function ChatWindow({
  selectedCustomerSession,
  setSelectedCustomerId,
  isMobile,
  infoOpen,
  setInfoOpen,
  handleResolve,
  isMessagesLoading,
  messages,
  messagesEndRef,
  messageText,
  setMessageText,
  isSending,
  handleSend,
}) {
  const theme = useTheme();
  if (!selectedCustomerSession) {
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 4px 20px rgba(0,0,0,0.02)"
              : "0 4px 20px rgba(0,0,0,0.15)",
          p: 4,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <SupportAgent
          sx={{
            fontSize: 60,
            color: "primary.main",
            mb: 2,
            opacity: 0.8,
          }}
        />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Assistance Hub
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ maxWidth: 320, mb: 3 }}
        >
          Select a customer thread from the sidebar panel to view details and
          start live 2-way support.
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow:
          theme.palette.mode === "light"
            ? "0 4px 20px rgba(0,0,0,0.02)"
            : "0 4px 20px rgba(0,0,0,0.15)",
        p: 0,
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.01)"
              : "rgba(255,255,255,0.01)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ minWidth: 0, mr: 2, flexGrow: 1 }}
        >
          <IconButton
            aria-label="back"
            onClick={() => setSelectedCustomerId(null)}
            sx={{
              display: { xs: "inline-flex", lg: "none" },
              mr: 0.5,
              color: "text.primary",
            }}
          >
            <ArrowBack />
          </IconButton>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              fontWeight: 700,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {getInitials(
              `${selectedCustomerSession.customer.firstName || ""} ${selectedCustomerSession.customer.lastName || ""}`
            ) || "C"}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body1" fontWeight={700} noWrap>
              {selectedCustomerSession.customer.firstName}{" "}
              {selectedCustomerSession.customer.lastName}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.25 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Online
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions Area */}
        <Box display="flex" alignItems="center">
          <Tooltip title={infoOpen ? "Hide Details" : "Show Details"}>
            <IconButton
              onClick={() => setInfoOpen(!infoOpen)}
              sx={{
                color: infoOpen ? "primary.main" : "text.secondary",
                mr: 1,
              }}
            >
              <InfoOutlined />
            </IconButton>
          </Tooltip>

          <RenderIf render={selectedCustomerSession.status !== "resolved"}>
            <RenderIf render={isMobile}>
              <Tooltip title="Resolve Ticket">
                <IconButton
                  id="support-resolve-button"
                  color="success"
                  onClick={handleResolve}
                  sx={{
                    border: "1px solid",
                    borderColor: "success.main",
                    backgroundColor: "transparent",
                    color: "success.main",
                    "&:hover": {
                      backgroundColor: "rgba(0,168,107,0.08)",
                    },
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            </RenderIf>
            <RenderIf render={!isMobile}>
              <Button
                id="support-resolve-button"
                variant="outlined"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={handleResolve}
                sx={{
                  borderRadius: "50px",
                  fontWeight: 700,
                  px: 2,
                  textTransform: "none",
                  borderColor: "success.main",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "rgba(0,168,107,0.08)",
                  },
                }}
              >
                Resolve Ticket
              </Button>
            </RenderIf>
          </RenderIf>
        </Box>
      </Box>

      {/* Message display board */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <RenderIf render={isMessagesLoading && messages.length === 0}>
          <Box display="flex" flexDirection="column" gap={2} p={1}>
            {/* Left bubble skeleton */}
            <Box display="flex" gap={1.5} alignItems="flex-end">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton
                variant="rounded"
                width={220}
                height={48}
                sx={{ borderRadius: "16px 16px 16px 4px" }}
              />
            </Box>
            {/* Right bubble skeleton */}
            <Box display="flex" justifyContent="flex-end">
              <Skeleton
                variant="rounded"
                width={260}
                height={56}
                sx={{ borderRadius: "16px 16px 4px 16px" }}
              />
            </Box>
            {/* Left bubble skeleton */}
            <Box display="flex" gap={1.5} alignItems="flex-end">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton
                variant="rounded"
                width={180}
                height={40}
                sx={{ borderRadius: "16px 16px 16px 4px" }}
              />
            </Box>
            {/* Right bubble skeleton */}
            <Box display="flex" justifyContent="flex-end">
              <Skeleton
                variant="rounded"
                width={200}
                height={44}
                sx={{ borderRadius: "16px 16px 4px 16px" }}
              />
            </Box>
          </Box>
        </RenderIf>

        <RenderIf render={!isMessagesLoading && messages.length === 0}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            sx={{ opacity: 0.5 }}
          >
            <Message sx={{ fontSize: 40, mb: 1, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Send a message to start conversation.
            </Typography>
          </Box>
        </RenderIf>

        <RenderIf render={messages.length > 0}>
          {messages.map((msg, index) => {
            const isAdmin = msg.senderType === "admin";
            const currentDateLabel = getDateLabel(msg.createdAt);
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const prevDateLabel = prevMessage
              ? getDateLabel(prevMessage.createdAt)
              : null;
            const showDateSeparator = currentDateLabel !== prevDateLabel;

            return (
              <React.Fragment key={msg._id || index}>
                <RenderIf render={showDateSeparator}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 1.5,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.06)"
                            : "rgba(255,255,255,0.08)",
                        color: "text.secondary",
                        px: 1.5,
                        py: 0.4,
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {currentDateLabel}
                    </Typography>
                  </Box>
                </RenderIf>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: isAdmin ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isAdmin ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        px: 2,
                        borderRadius: 3,
                        borderTopRightRadius: isAdmin ? 1.5 : 12,
                        borderTopLeftRadius: isAdmin ? 12 : 1.5,
                        backgroundColor: isAdmin
                          ? "primary.main"
                          : "background.paper",
                        color: isAdmin
                          ? "primary.contrastText"
                          : "text.primary",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        border: "1px solid",
                        borderColor: isAdmin ? "transparent" : "divider",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-line",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.message}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        px: 0.5,
                        fontSize: "0.7rem",
                        opacity: 0.8,
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
        </RenderIf>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Text Box */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <TextField
            id="support-message-input"
            fullWidth
            size="small"
            placeholder="Type your support reply here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            autoComplete="off"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                paddingLeft: "15px",
              },
            }}
          />
          <IconButton
            id="support-send-button"
            type="submit"
            color="primary"
            disabled={!messageText.trim() || isSending}
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            <Send sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
}

ChatWindow.propTypes = {
  selectedCustomerSession: PropTypes.object,
  setSelectedCustomerId: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  infoOpen: PropTypes.bool.isRequired,
  setInfoOpen: PropTypes.func.isRequired,
  handleResolve: PropTypes.func.isRequired,
  isMessagesLoading: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired,
  messagesEndRef: PropTypes.object.isRequired,
  messageText: PropTypes.string.isRequired,
  setMessageText: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  handleSend: PropTypes.func.isRequired,
};
