import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";

import { formatCurrency } from "TheOdcMfUI/utility";

export const standardReasons = [
  "Customer requested cancellation",
  "Item out of stock / unavailable",
  "Quality / preparation dissatisfaction",
  "Delivery delay or unfulfilled",
  "Accidental duplicate charge",
  "Other administrative reason",
];

export function useRefundDialog({ open, payment, onConfirmRefund }) {
  /*
    Hooks & Theme Configuration
   */
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /*
    Local Form State
   */
  const [refundAmount, setRefundAmount] = useState("");
  const [selectedReason, setSelectedReason] = useState(standardReasons[0]);
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  /*
    Computed Values & Memos (State Aggregates)
   */
  const maxAmount = payment?.amount || 0;

  useEffect(() => {
    if (open && payment?.amount) {
      setRefundAmount(String(payment.amount));
      setSelectedReason(standardReasons[0]);
      setCustomReason("");
      setError("");
    }
  }, [open, payment]);

  /*
    Event Handler Callbacks / Actions
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(refundAmount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive refund amount.");
      return;
    }

    if (numAmount > maxAmount) {
      setError(
        `Refund amount cannot exceed total paid amount (${formatCurrency(maxAmount)}).`
      );
      return;
    }

    const finalReason =
      selectedReason === "Other administrative reason" && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    onConfirmRefund({
      amount: numAmount,
      reason: finalReason,
    });
  };

  return {
    isDark,
    refundAmount,
    setRefundAmount,
    selectedReason,
    setSelectedReason,
    customReason,
    setCustomReason,
    error,
    setError,
    maxAmount,
    handleSubmit,
  };
}

export default useRefundDialog;
