import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";

import { FormInput } from "TheOdcMfUI/sharedComp";

import { CustomDialog } from "../../../sharedComponents/dialog";

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../store/rtkServices/userMgmt";
import { createUserSchema, editUserSchema } from "../validation";
import { dropDownOptions } from "../../../constant";
import { handleMutation, toaster } from "../../../utility";
import { useFormWithReinitialize } from "../../../hooks";

function AddEditUserModal({ addEditUserModal, setAddEditUserModal }) {
  const navigate = useNavigate();
  const { open = false, selectedUser = {}, action } = addEditUserModal;
  const isEditMode = action === "EDIT";
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormWithReinitialize({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      firstName: selectedUser?.firstName || "",
      lastName: selectedUser?.lastName || "",
      phone: selectedUser?.phone || "",
      email: selectedUser?.email || "",
      status: selectedUser?.status || "active",
      password: "",
    },
    mode: "onTouched",
    enableReinitialize: true,
  });

  const handleClose = () => {
    setAddEditUserModal({ open: false, action: "", selectedUser: null });
    reset(); // reset form on close
  };

  const handleFormSubmit = async (data) => {
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
    }

    if (payload.phone) {
      let cleanedPhone = payload.phone.trim();
      if (!cleanedPhone.startsWith("+")) {
        payload.phone = `+${cleanedPhone}`;
      }
    }

    await handleMutation({
      mutationFn: isEditMode ? updateUser : createUser,
      payload: isEditMode ? { id: selectedUser?.id, payload } : payload,
      onSuccess: (response) => {
        toaster.success(
          response?.message ||
            `User ${isEditMode ? "updated" : "created"} successfully`
        );
        handleClose();
        const userId =
          response?.data?.id || response?.data?._id || selectedUser?.id;
        if (userId) {
          navigate(`/user-management/${userId}`);
        }
      },
    });
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      handleConfirm={handleSubmit(handleFormSubmit)}
      confirmLabel={isEditMode ? "Update" : "Create"}
      cancelLabel="Cancel"
      title={isEditMode ? "Edit User" : "Add New User"}
      isLoading={isSubmitting || isCreating || isUpdating}
      loadingLabel={isEditMode ? "Updating..." : "Creating..."}
    >
      <FormInput
        name="firstName"
        control={control}
        label="First Name"
        inputType="text"
      />
      <FormInput
        name="lastName"
        control={control}
        label="Last Name"
        inputType="text"
      />
      <FormInput
        name="phone"
        control={control}
        label="Phone Number"
        inputType="phone"
      />
      <FormInput
        name="email"
        control={control}
        label="Email"
        inputType="email"
      />
      <FormInput
        name="status"
        control={control}
        label="Status"
        inputType="select"
        options={dropDownOptions.userMgmt.status.filter(
          (opt) => opt.value !== ""
        )}
      />
      {!isEditMode && (
        <FormInput
          name="password"
          control={control}
          label="Password"
          inputType="password"
        />
      )}
    </CustomDialog>
  );
}

// props validation
AddEditUserModal.propTypes = {
  addEditUserModal: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
    selectedUser: PropTypes.object,
  }).isRequired,
  setAddEditUserModal: PropTypes.func.isRequired,
};

export default memo(AddEditUserModal);
