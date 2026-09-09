import { useTheme } from "@mui/material";
import { toast } from "react-toastify";

import {
  useCollectPaymentMutation,
  useGetOrderPaymentQrQuery,
} from "../../../store/rtkServices/ordersMgmt";

export function usePaymentQrDialog({
  open,
  onClose,
  orderId,
  orderTotal,
  isPaid,
}) {
  /*
    Hooks & Theme Configuration
   */
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: qrData,
    isLoading: isLoadingQr,
    isError: isQrError,
  } = useGetOrderPaymentQrQuery(orderId, {
    skip: !open || !orderId,
  });

  const [collectPaymentMutation, { isLoading: isCollecting }] =
    useCollectPaymentMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const payableAmount = qrData?.amount || orderTotal || 0;
  const upiUri = qrData?.upiUri || "";
  const qrCodeDataUrl = qrData?.qrCodeDataUrl || "";
  const upiId = qrData?.upiId || "theodc@upi";

  /*
    Event Handler Callbacks / Actions
   */
  const handleCopyUpi = () => {
    if (upiUri) {
      navigator.clipboard.writeText(upiUri);
      toast.success("UPI payment link copied to clipboard!");
    }
  };

  const handleDownloadQr = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.href = qrCodeDataUrl;
      link.download = `TheODC-QR-Order-${orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Payment QR code downloaded!");
    }
  };

  const handlePrintQr = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    try {
      const res = await collectPaymentMutation({
        id: orderId,
        method: "UPI (QR Code)",
        notes: "Collected on delivery arrival via dynamic UPI QR Code",
      }).unwrap();

      toast.success(
        res?.message || "Payment marked as collected successfully!"
      );
      if (onClose) onClose();
    } catch (err) {
      toast.error(
        err?.data?.error ||
          err?.message ||
          "Failed to mark payment as collected."
      );
    }
  };

  return {
    isDark,
    qrData,
    isLoadingQr,
    isQrError,
    isCollecting,
    payableAmount,
    upiUri,
    qrCodeDataUrl,
    upiId,
    isPaid,
    handleCopyUpi,
    handleDownloadQr,
    handlePrintQr,
    handleMarkAsPaid,
  };
}

export default usePaymentQrDialog;
