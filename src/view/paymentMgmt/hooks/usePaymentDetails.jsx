import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import {
  useGetPaymentByIdQuery,
  useRefundPaymentMutation,
} from "../../../store/rtkServices/paymentsMgmt";

export function usePaymentDetails() {
  /*
    Hooks & Theme Configuration
   */
  const { paymentId } = useParams();

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [paymentQrDialogOpen, setPaymentQrDialogOpen] = useState(false);

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: paymentDetailsData = null,
    isLoading,
    isFetching,
    refetch,
  } = useGetPaymentByIdQuery(paymentId);

  const [refundPaymentMutation, { isLoading: isRefunding }] =
    useRefundPaymentMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const customerAddress = paymentDetailsData?.customer?.address
    ? `${paymentDetailsData?.customer.address.line1 || ""}, ${paymentDetailsData?.customer.address.line2 || ""}, ${paymentDetailsData?.customer.address.city || ""}, ${paymentDetailsData?.customer.address.state || ""} - ${paymentDetailsData?.customer.address.postalCode || ""}, ${paymentDetailsData?.customer.address.country || ""}`
    : "N/A";

  const visualizePaymentDetails = {
    "Payment ID": paymentDetailsData?.id,
    "Order ID": paymentDetailsData?.orderId,
    Status: <StatusChip status={paymentDetailsData?.status} />,
    Amount: formatCurrency(paymentDetailsData?.amount),
    "Payment Method": paymentDetailsData?.method,
    "Payment Gateway": paymentDetailsData?.paymentGateway,
    "Transaction ID": paymentDetailsData?.transactionId,
    "Paid At": paymentDetailsData?.paidAt,
    Notes: paymentDetailsData?.notes,
  };

  const visualizeCustomerDetails = {
    Name: paymentDetailsData?.customer?.name,
    Phone: paymentDetailsData?.customer?.phone,
    Email: paymentDetailsData?.customer?.email,
    Address: customerAddress,
  };

  const isRefunded = Boolean(paymentDetailsData?.refund?.isRefunded);

  const visualizeRefundDetails = {
    "Is Refunded": isRefunded ? "Yes" : "No",
    "Refund Amount": formatCurrency(
      paymentDetailsData?.refund?.refundAmount || 0
    ),
    "Refunded At": paymentDetailsData?.refund?.refundedAt || "N/A",
    "Refund ID": paymentDetailsData?.refund?.refundId || "N/A",
    "Refund Reason": paymentDetailsData?.refund?.reason || "N/A",
  };

  const canRefund = paymentDetailsData?.status === "success" && !isRefunded;

  const canGenerateQr = paymentDetailsData?.status === "pending";

  /*
    Handlers & Callback Actions
   */
  const handleOpenRefundDialog = () => setRefundDialogOpen(true);
  const handleCloseRefundDialog = () => {
    if (!isRefunding) setRefundDialogOpen(false);
  };

  const handleOpenPaymentQrDialog = () => setPaymentQrDialogOpen(true);
  const handleClosePaymentQrDialog = () => setPaymentQrDialogOpen(false);

  const handleConfirmRefund = async ({ amount, reason }) => {
    try {
      const res = await refundPaymentMutation({
        id: paymentId,
        amount,
        reason,
      }).unwrap();

      toast.success(res?.message || "Refund processed successfully!");
      setRefundDialogOpen(false);
      refetch();
    } catch (err) {
      toast.error(
        err?.data?.error ||
          err?.message ||
          "Failed to process refund. Please try again."
      );
    }
  };

  return {
    paymentId,
    isLoading: isLoading || isFetching,
    isFetching,
    isRefunding,
    paymentDetailsData,
    visualizePaymentDetails,
    visualizeCustomerDetails,
    visualizeRefundDetails,
    canRefund,
    canGenerateQr,
    refundDialogOpen,
    paymentQrDialogOpen,
    handleOpenRefundDialog,
    handleCloseRefundDialog,
    handleOpenPaymentQrDialog,
    handleClosePaymentQrDialog,
    handleConfirmRefund,
  };
}
