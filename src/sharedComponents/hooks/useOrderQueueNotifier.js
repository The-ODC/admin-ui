import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { cookies } from "TheOdcMfUI/utility";
import { VITE_APP_API_URL } from "../../config/env";
import {
  ordersService,
  useUpdateOrderStatusMutation,
} from "../../store/rtkServices/ordersMgmt";
import { paymentsService } from "../../store/rtkServices/paymentsMgmt";
import { useGetProductsQuery } from "../../store/rtkServices/productsMgmt";

export default function useOrderQueueNotifier() {
  const dispatch = useDispatch();
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

      // Synchronize Orders table & Payments table in real-time
      dispatch(ordersService.util.invalidateTags(["Order"]));
      dispatch(paymentsService.util.invalidateTags(["Payments"]));
    };

    socketInstance.on("new_order", handleNewOrder);

    // Keep queue and tables updated if order was processed elsewhere/externally
    const handleStatusUpdated = (updatedOrder) => {
      setIncomingQueue((prev) =>
        prev.filter((o) => o.orderId !== updatedOrder.orderId)
      );

      // Synchronize background views in real-time
      dispatch(ordersService.util.invalidateTags(["Order"]));
      dispatch(paymentsService.util.invalidateTags(["Payments"]));

      window.dispatchEvent(
        new CustomEvent("order_status_updated", { detail: updatedOrder })
      );
    };

    socketInstance.on("order_status_updated", handleStatusUpdated);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Order queue notifier socket disconnected.");
      }
    };
  }, [dispatch]);

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
