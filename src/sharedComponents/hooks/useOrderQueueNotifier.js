import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { cookies } from "TheOdcMfUI/utility";
import { VITE_APP_API_URL } from "../../config/env";
import {
  useUpdateOrderStatusMutation,
  useGetOrdersQuery,
} from "../../store/rtkServices/ordersMgmt";
import { useGetProductsQuery } from "../../store/rtkServices/productsMgmt";

export default function useOrderQueueNotifier() {
  const [incomingQueue, setIncomingQueue] = useState([]);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const audioRef = useRef(null);
  const socketRef = useRef(null);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Load all products for stock verification
  const { data: productsPayload } = useGetProductsQuery({ limit: 1000 });
  const products = productsPayload?.data?.products || [];

  // Load initial pending orders on mount
  const { data: initialOrdersData } = useGetOrdersQuery({
    status: "ordered",
    limit: 100,
  });

  useEffect(() => {
    if (initialOrdersData?.data) {
      setIncomingQueue((prev) => {
        const merged = [...prev];
        const existingIds = new Set(prev.map((o) => o.orderId));
        initialOrdersData.data.forEach((order) => {
          if (!existingIds.has(order.orderId)) {
            merged.push(order);
          }
        });
        return merged;
      });
    }
  }, [initialOrdersData]);

  // Active order is always the first one in the queue
  const activeOrder = incomingQueue[0] || null;

  // Verify stock availability for active order items
  const isStockAvailable =
    activeOrder?.items?.every((item) => {
      const product = products.find(
        (p) => p.id === item.productId || p._id === item.productId
      );
      if (!product) return true;
      return product.stock >= item.quantity;
    }) ?? true;

  // Initialize Socket.io Connection
  useEffect(() => {
    const token = cookies.getCookie("admin_auth_token");
    if (!token) return;

    const socketServerUrl = VITE_APP_API_URL.replace("/api", "");

    // Establish a private, dedicated socket for order notifications
    const socketInstance = io(socketServerUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Order queue notifier socket connected successfully.");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Order queue notifier socket disconnected.");
    });

    const handleNewOrder = (order) => {
      console.log("New order received via socket:", order);
      setIncomingQueue((prev) => {
        // Prevent duplicate orders from entering the queue
        if (prev.some((o) => o.orderId === order.orderId)) return prev;
        return [...prev, order];
      });
    };

    socketInstance.on("new_order", handleNewOrder);

    // Keep queue updated if order was processed elsewhere/externally
    const handleStatusUpdated = (updatedOrder) => {
      setIncomingQueue((prev) =>
        prev.filter((o) => o.orderId !== updatedOrder.orderId)
      );
    };

    socketInstance.on("order_status_updated", handleStatusUpdated);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Order queue notifier socket disconnected.");
      }
    };
  }, []);

  // Handle Loop Audio Ringing
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio("/ringtone.wav");
      audio.loop = true;
      audioRef.current = audio;
    }

    const playAudio = async () => {
      try {
        if (incomingQueue.length > 0 && !isMuted) {
          await audioRef.current.play();
          setIsAudioBlocked(false);
        } else {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch (err) {
        console.warn("Audio autoplay blocked by browser:", err.message);
        setIsAudioBlocked(true);
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [incomingQueue.length, isMuted]);

  // Audio Unlock on user click/interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (
        incomingQueue.length > 0 &&
        audioRef.current &&
        audioRef.current.paused &&
        !isMuted
      ) {
        audioRef.current
          .play()
          .then(() => {
            setIsAudioBlocked(false);
          })
          .catch((err) => {
            console.log("Interaction play failed:", err);
          });
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [incomingQueue.length, isMuted]);

  // Action Handlers
  const handleAccept = async () => {
    if (!activeOrder || isProcessing) return;
    const orderIdToProcess = activeOrder.orderId;
    setIsProcessing(true);
    try {
      await updateOrderStatus({
        id: orderIdToProcess,
        status: "accepted",
      }).unwrap();
      // Remove from state queue
      setIncomingQueue((prev) =>
        prev.filter((o) => o.orderId !== orderIdToProcess)
      );
    } catch (err) {
      console.error("Failed to accept order:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!activeOrder || isProcessing) return;
    const orderIdToProcess = activeOrder.orderId;
    setIsProcessing(true);
    try {
      await updateOrderStatus({
        id: orderIdToProcess,
        status: "cancelled",
        reason: cancellationReason,
      }).unwrap();
      // Remove from state queue
      setIncomingQueue((prev) =>
        prev.filter((o) => o.orderId !== orderIdToProcess)
      );
      setCancellationReason("");
    } catch (err) {
      console.error("Failed to decline order:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlockAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsAudioBlocked(false))
        .catch(() => {});
    }
  };

  return {
    incomingQueue,
    isAudioBlocked,
    isMuted,
    setIsMuted,
    isProcessing,
    isConnected,
    cancellationReason,
    setCancellationReason,
    products,
    activeOrder,
    isStockAvailable,
    handleAccept,
    handleDecline,
    handleUnlockAudio,
  };
}
