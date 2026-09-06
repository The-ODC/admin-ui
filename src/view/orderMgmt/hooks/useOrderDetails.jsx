import React from "react";
import { useParams } from "react-router-dom";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../store/rtkServices/ordersMgmt";
import { handleMutation, toaster } from "../../../utility";

const getAvailableActions = (status) => {
  switch (status) {
    case "pending":
    case "ordered":
      return ["Accept", "Cancel"];
    case "accepted":
      return ["MarkPreparing", "Cancel"];
    case "preparing":
      return ["MarkOutForDelivery", "Cancel"];
    case "shipped":
      return ["MarkOutForDelivery", "Return"];
    case "outForDelivery":
      return ["MarkDelivered", "Return"];
    case "delivered":
      return ["Return"];
    case "returned":
    case "cancelled":
    default:
      return [];
  }
};

const formatAmount = (value) => formatCurrency(value, { showSymbol: false });

export function useOrderDetails() {
  /*
    Hooks & Theme Configuration
   */
  const { orderId } = useParams();

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: order = null,
    isLoading,
    isFetching,
  } = useGetOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const actions = getAvailableActions(order?.status);
  const priceSummary = order?.priceSummary || {};
  const deliveryAddress = order?.delivery?.address || {};

  const visualizeOrderSummary = {
    "Order ID": order?.orderId,
    Status: <StatusChip status={order?.status} />,
    "Ordered On": order?.orderDate,
  };

  const visualizeTimeline = {
    "Placed At": order?.timeline?.placedAt,
    "Accepted At": order?.timeline?.acceptedAt,
    "Preparing At": order?.timeline?.preparingAt,
    ...(order?.timeline?.shippedAt
      ? { "Shipped At": order?.timeline?.shippedAt }
      : {}),
    "Out For Delivery At": order?.timeline?.outForDeliveryAt,
    "Delivered At": order?.timeline?.deliveredAt,
    "Cancelled At": order?.timeline?.cancelledAt,
    "Returned At": order?.timeline?.returnedAt,
  };

  const visualizePriceSummary = {
    Subtotal: formatAmount(priceSummary.subTotal),
    Discount: formatAmount(priceSummary.discount),
    Tax: formatAmount(priceSummary.tax),
    Delivery: formatAmount(priceSummary.deliveryFee),
    "Grand Total": formatAmount(priceSummary.grandTotal || order?.totalAmount),
  };

  /*
    Handlers & Callback Actions
   */
  const handleStatusUpdate = async (status) => {
    await handleMutation({
      mutationFn: updateOrderStatus,
      payload: { id: orderId, status },
      onSuccess: (data) => {
        toaster.success(data?.message || "Order status updated successfully");
      },
    });
  };

  return {
    orderId,
    order,
    isLoading: isLoading || isFetching,
    isFetching,
    isUpdatingStatus,
    actions,
    deliveryAddress,
    handleStatusUpdate,
    visualizeOrderSummary,
    visualizeTimeline,
    visualizePriceSummary,
    formatAmount,
  };
}
