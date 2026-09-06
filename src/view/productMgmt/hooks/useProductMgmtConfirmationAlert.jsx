import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";

import {
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} from "../../../store/rtkServices/productsMgmt";
import { handleMutation, toaster } from "../../../utility";

export function useProductMgmtConfirmationAlert() {
  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    action: null,
    selectedProduct: null,
  });

  // RTK Query
  const [activeInActiveProduct, { isLoading: isToggling }] =
    useToggleProductStatusMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const getDialogContent = (action, selectedProduct) => {
    const name = selectedProduct?.name || "N/A";
    const sku = selectedProduct?.sku || "N/A";

    const productInfo = (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight={600}>
          Dish: <span style={{ fontWeight: 400 }}>{name},</span>
        </Typography>
        <Typography fontWeight={600}>
          Code: <span style={{ fontWeight: 400 }}>{sku}</span>
        </Typography>
      </Stack>
    );

    switch (action) {
      case "inActive":
        return {
          title: "Inactive Dish Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This action will temporarily remove the following dish from your
                menu:
              </Typography>
              {productInfo}
              <Typography color="primary.main" fontWeight={600}>
                Note: You can active the dish later to restore it to your menu.
              </Typography>
              <Typography>Are you sure you want to continue?</Typography>
            </Stack>
          ),
          confirmLabel: "Inactive",
        };
      case "active":
        return {
          title: "Active Dish Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This will make the following dish available on your menu again:
              </Typography>
              {productInfo}
              <Typography color="success.main" fontWeight={600}>
                Customers will be able to see and order this dish.
              </Typography>
              <Typography>Are you sure you want to continue?</Typography>
            </Stack>
          ),
          confirmLabel: "Active",
        };
      case "delete":
        return {
          title: "Delete Dish Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This will permanently delete the following dish from your menu:
              </Typography>
              {productInfo}
              <Typography color="error.main" fontWeight={700}>
                Warning: This action cannot be undone.
              </Typography>
              <Typography>Are you sure you want to continue?</Typography>
            </Stack>
          ),
          confirmLabel: "Delete",
        };
      default:
        return { title: "", description: "", confirmLabel: "Confirm" };
    }
  };

  const handleAction = (action, selectedProduct) => {
    setConfirmAlert({ open: true, action, selectedProduct });
  };

  const handleConfirm = async () => {
    if (confirmAlert.action === "delete") {
      await handleMutation({
        mutationFn: deleteProduct,
        payload: confirmAlert.selectedProduct?._id,
        onSuccess: (data) => {
          toaster.success(data.message);
        },
      });
    } else {
      await handleMutation({
        mutationFn: activeInActiveProduct,
        payload: confirmAlert.selectedProduct?._id,
        onSuccess: (data) => {
          toaster.success(data.message);
        },
      });
    }
    setConfirmAlert({ open: false, action: null, selectedProduct: null });
  };

  return {
    confirmAlert,
    setConfirmAlert,
    getDialogContent,
    handleAction,
    handleConfirm,
    isLoading: isToggling || isDeleting,
  };
}
