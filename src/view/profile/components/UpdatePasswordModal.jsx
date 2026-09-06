import React, { memo } from "react";
import { useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

import { FormInput } from "TheOdcMfUI/sharedComp";

import { CustomDialog } from "../../../sharedComponents/dialog";

import { useChangePasswordMutation } from "../../../store/rtkServices";
import { passwordSchema } from "../validation";
import { handleMutation, toaster } from "../../../utility";
import { useFormWithReinitialize } from "../../../hooks";

const passwordChecks = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least 1 number", test: (p) => /\d/.test(p) },
  {
    label: "At least 1 special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

function UpdatePasswordModal({ updatePasswordModal, setUpdatePasswordModal }) {
  const { open = false } = updatePasswordModal;

  // RTK state
  const [changePassword, { isFetching }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormWithReinitialize({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
  });

  const newPassword = useWatch({ control, name: "newPassword" }) || "";

  const handleClose = () => {
    setUpdatePasswordModal({ open: false });
    reset();
  };

  const handleFormSubmit = async (passwordData) => {
    await handleMutation({
      mutationFn: changePassword,
      payload: passwordData,
      onSuccess: (data) => {
        toaster.success(data?.message || "Password updated successfully");
        handleClose();
      },
    });
  };

  return (
    <CustomDialog
      open={open}
      title="Update Password"
      handleClose={handleClose}
      handleConfirm={handleSubmit(handleFormSubmit)}
      confirmLabel="Update"
      cancelLabel="Cancel"
      isLoading={isSubmitting || isFetching}
      loadingLabel="Updating..."
    >
      <FormInput
        name="currentPassword"
        control={control}
        label="Current Password"
        inputType="password"
      />

      <FormInput
        name="newPassword"
        control={control}
        label="New Password"
        inputType="password"
      />

      <FormInput
        name="confirmPassword"
        control={control}
        label="Confirm New Password"
        inputType="password"
      />
      {/* Password Hint Section */}
      <Box pl={1}>
        {passwordChecks.map((check, index) => {
          const passed = check.test(newPassword);
          return (
            <Typography
              key={index + 1}
              variant="body2"
              sx={{
                color: passed
                  ? "success.main"
                  : newPassword.length > 0
                    ? "error.main"
                    : "text.disabled",
              }}
            >
              • {check.label}
            </Typography>
          );
        })}
      </Box>
    </CustomDialog>
  );
}

UpdatePasswordModal.propTypes = {
  updatePasswordModal: PropTypes.shape({
    open: PropTypes.bool.isRequired,
  }).isRequired,
  setUpdatePasswordModal: PropTypes.func.isRequired,
};

export default memo(UpdatePasswordModal);
