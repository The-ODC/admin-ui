import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";

import {
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../../../store/rtkServices/userMgmt";
import { handleMutation, toaster } from "../../../utility";

export function useUserMgmtConfirmationAlert() {
  const [confirmAlert, setConfirmAlert] = useState({
    open: false,
    action: null,
    selectedUser: null,
  });

  const [toggleUserStatus, { isLoading: isToggling }] =
    useToggleUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const getDialogContent = (action, selectedUser) => {
    const name = selectedUser?.name || "N/A";
    const email = selectedUser?.email || "N/A";

    const userInfo = (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography fontWeight={600}>
          Name: <span style={{ fontWeight: 400 }}>{name},</span>
        </Typography>
        <Typography fontWeight={600}>
          Email: <span style={{ fontWeight: 400 }}>{email}</span>
        </Typography>
      </Stack>
    );

    switch (action) {
      case "block":
        return {
          title: "Block User Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This action will block the following user:
              </Typography>
              {userInfo}
              <Typography color="primary.main" fontWeight={600}>
                Note: This action can be undone by unblocking the user later.
              </Typography>
              <Typography>Are you sure you want to continue?</Typography>
            </Stack>
          ),
          confirmLabel: "Block",
        };
      case "unblock":
        return {
          title: "Unblock User Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This action will unblock the following user:
              </Typography>
              {userInfo}
              <Typography color="success.main" fontWeight={600}>
                The user will regain access to their account.
              </Typography>
              <Typography>Are you sure you want to continue?</Typography>
            </Stack>
          ),
          confirmLabel: "Unblock",
        };
      case "delete":
        return {
          title: "Delete User Confirmation",
          description: (
            <Stack spacing={1}>
              <Typography>
                This action will permanently delete the following user:
              </Typography>
              {userInfo}
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

  const handleAction = (action, selectedUser) => {
    setConfirmAlert({ open: true, action, selectedUser });
  };

  const handleConfirm = async () => {
    const selectedUser = confirmAlert.selectedUser;

    if (confirmAlert.action === "delete") {
      await handleMutation({
        mutationFn: deleteUser,
        payload: selectedUser?.id,
        onSuccess: (data) => {
          toaster.success(data.message);
        },
      });
    }

    if (confirmAlert.action === "block") {
      await handleMutation({
        mutationFn: toggleUserStatus,
        payload: { id: selectedUser?.id, status: "blocked" },
        onSuccess: (data) => {
          toaster.success(data.message);
        },
      });
    }

    if (confirmAlert.action === "unblock") {
      await handleMutation({
        mutationFn: toggleUserStatus,
        payload: { id: selectedUser?.id, status: "active" },
        onSuccess: (data) => {
          toaster.success(data.message);
        },
      });
    }

    setConfirmAlert({ open: false, action: null, selectedUser: null });
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
