import React from "react";
import { useParams } from "react-router-dom";

import { StatusChip } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { useGetPaymentByIdQuery } from "../../../store/rtkServices/paymentsMgmt";

export function usePaymentDetails() {
  /*
    Hooks & Theme Configuration
   */
  const { paymentId } = useParams();

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: paymentDetailsData = null,
    isLoading,
    isFetching,
  } = useGetPaymentByIdQuery(paymentId);

  /*
    Computed Values & Memos (State Aggregates)
   */
  // Flatten customer address for easy display
  const customerAddress = paymentDetailsData?.customer?.address
    ? `${paymentDetailsData?.customer.address.line1}, ${paymentDetailsData?.customer.address.line2}, ${paymentDetailsData?.customer.address.city}, ${paymentDetailsData?.customer.address.state} - ${paymentDetailsData?.customer.address.postalCode}, ${paymentDetailsData?.customer.address.country}`
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

  const visualizeRefundDetails = {
    "Is Refunded": paymentDetailsData?.refund?.isRefunded ? "Yes" : "No",
    "Refund Amount": formatCurrency(
      paymentDetailsData?.refund?.refundAmount || 0
    ),
    "Refunded At": paymentDetailsData?.refund?.refundedAt,
  };

  return {
    paymentId,
    isLoading: isLoading || isFetching,
    isFetching,
    paymentDetailsData,
    visualizePaymentDetails,
    visualizeCustomerDetails,
    visualizeRefundDetails,
  };
}
