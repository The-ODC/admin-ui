import { useState, useEffect, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import { useTheme, useMediaQuery } from "@mui/material";

import { cookies, formatCurrency, formatDate } from "TheOdcMfUI/utility";

import {
  useFetchSupportSessionsQuery,
  useFetchChatMessagesQuery,
  useSendMessageMutation,
  useResolveSessionMutation,
} from "../../../store/rtkServices/support";
import { VITE_APP_API_URL } from "../../../config/env";

export function useSupport() {
  /*
    Hooks & Theme Configuration
   */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  /*
    Local State Declarations
   */
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [infoOpen, setInfoOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  /*
    Refs
   */
  const messagesEndRef = useRef(null);
  const refetchSessionsRef = useRef(null);
  const refetchMessagesRef = useRef(null);

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: sessions = [],
    isLoading: isSessionsLoading,
    refetch: refetchSessions,
  } = useFetchSupportSessionsQuery(null, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: 30,
  });

  const {
    data: chatPayload = {},
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useFetchChatMessagesQuery(selectedCustomerId, {
    skip: !selectedCustomerId,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: 30,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [resolveSession] = useResolveSessionMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const messages = useMemo(() => chatPayload?.data || [], [chatPayload?.data]);
  const recentOrders = useMemo(
    () => chatPayload?.recentOrders || [],
    [chatPayload?.recentOrders]
  );
  const linkedOrder = chatPayload?.linkedOrder || null;
  const linkedOrderId = linkedOrder?._id || linkedOrder?.id;

  const selectedCustomerSession = useMemo(() => {
    return sessions.find((s) => s.customer?._id === selectedCustomerId);
  }, [sessions, selectedCustomerId]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (!s.customer) return false;
      const fullName =
        `${s.customer.firstName || ""} ${s.customer.lastName || ""}`.toLowerCase();
      const email = (s.customer.email || "").toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase());

      const sessionStatus = s.status || "active";
      if (activeTab === "resolved") {
        return matchesSearch && sessionStatus === "resolved";
      }
      return matchesSearch && sessionStatus !== "resolved";
    });
  }, [sessions, searchQuery, activeTab]);

  // Debounced query functions
  const debouncedRefetchSessions = useMemo(() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        refetchSessionsRef.current?.();
      }, 150);
    };
  }, []);

  const debouncedRefetchMessages = useMemo(() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        refetchMessagesRef.current?.();
      }, 150);
    };
  }, []);

  /*
    Lifecycles & Side Effects (useEffect)
   */
  // Keep query refetch handlers fresh
  useEffect(() => {
    refetchSessionsRef.current = refetchSessions;
  }, [refetchSessions]);

  useEffect(() => {
    refetchMessagesRef.current = refetchMessages;
  }, [refetchMessages]);

  // Initialize Socket.io Connection
  useEffect(() => {
    const token = cookies.getCookie("admin_auth_token");
    if (!token) return;

    if (globalThis.adminSocket) {
      globalThis.adminSocket.disconnect();
    }

    const socketServerUrl = VITE_APP_API_URL.replace("/api", "");
    const socketInstance = io(socketServerUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    globalThis.adminSocket = socketInstance;

    socketInstance.on("connect", () => {
      console.log("Admin support socket connected");
    });

    socketInstance.on("message", () => {
      debouncedRefetchMessages();
    });

    socketInstance.on("session_updated", () => {
      debouncedRefetchSessions();
    });

    socketInstance.on("session_resolved", () => {
      debouncedRefetchMessages();
      debouncedRefetchSessions();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      if (globalThis.adminSocket === socketInstance) {
        globalThis.adminSocket = null;
      }
    };
  }, [debouncedRefetchMessages, debouncedRefetchSessions]);

  // Join Room for Selected Customer Support Thread
  useEffect(() => {
    if (!socket || !selectedCustomerId) return;

    socket.emit("join_customer_room", selectedCustomerId);

    return () => {
      socket.emit("leave_customer_room", selectedCustomerId);
    };
  }, [socket, selectedCustomerId]);

  // Auto-Scroll to Bottom on New Messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  // Select First Active Customer Thread on Large Screens automatically
  useEffect(() => {
    if (!isMobile && !selectedCustomerId && filteredSessions.length > 0) {
      setSelectedCustomerId(filteredSessions[0].customer?._id);
    }
  }, [filteredSessions, selectedCustomerId, isMobile]);

  /*
    Handlers & Callback Actions
   */
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleSelectOrder = (order) => {
    if (!order) return;

    const itemsList =
      order.items
        ?.map((item) => `${item.name || "Item"} (x${item.quantity || 0})`)
        .join(", ") || "N/A";

    const template =
      `Order Details:\n` +
      `Order ID: ${order.orderId || "N/A"}\n` +
      `Status: ${order.status || "N/A"}\n` +
      `Amount: INR ${formatCurrency(order.totalAmount, { showSymbol: false })}\n` +
      `Date: ${formatDate(order.orderDate)}\n` +
      `Items: ${itemsList}\n\n` +
      `Is this the order you need help with?`;

    setMessageText(template);
    setInfoOpen(false);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() || !selectedCustomerId || isSending) return;

    try {
      await sendMessage({
        customerId: selectedCustomerId,
        message: messageText.trim(),
      }).unwrap();
      setMessageText("");
      setTimeout(() => scrollToBottom("smooth"), 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleResolve = async () => {
    if (!selectedCustomerId) return;
    try {
      await resolveSession(selectedCustomerId).unwrap();
    } catch (err) {
      console.error("Failed to resolve session:", err);
    }
  };

  return {
    isMobile,
    selectedCustomerId,
    setSelectedCustomerId,
    searchQuery,
    setSearchQuery,
    messageText,
    setMessageText,
    activeTab,
    setActiveTab,
    messagesEndRef,
    isSessionsLoading,
    isMessagesLoading,
    messages,
    recentOrders,
    linkedOrder,
    isSending,
    selectedCustomerSession,
    filteredSessions,
    handleSend,
    handleResolve,
    handleSelectOrder,
    infoOpen,
    setInfoOpen,
    linkedOrderId,
  };
}
