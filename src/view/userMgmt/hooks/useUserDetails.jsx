import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { StatusChip } from "TheOdcMfUI/sharedComp";

import {
  useGetUserByIdQuery,
  useUpdateProfilePictureMutation,
} from "../../../store/rtkServices/userMgmt";
import { VITE_APP_ASSETS_PATH } from "../../../config/env";
import { handleMutation, toaster } from "../../../utility";

export function useUserDetails() {
  /*
    Hooks & Theme Configuration
   */
  const { id } = useParams();

  /*
    Local State Declarations
   */
  const [addEditUserModal, setAddEditUserModal] = useState({
    open: false,
    selectedUser: null,
    action: "",
  });

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const {
    data: userDetails = null,
    isLoading,
    isFetching,
  } = useGetUserByIdQuery(id);
  const [updateProfilePicture, { isLoading: isUpdatingPhoto }] =
    useUpdateProfilePictureMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const visualizeFormatUserDetails = {
    "First Name": userDetails?.firstName,
    "Last Name": userDetails?.lastName,
    Status: <StatusChip status={userDetails?.status} />,
    "Created At": userDetails?.createdAt,
    "Updated At": userDetails?.updatedAt,
    "Created By": userDetails?.createdBy
      ? userDetails.createdBy.charAt(0).toUpperCase() +
        userDetails.createdBy.slice(1)
      : userDetails?.createdBy,
    "Email Address": userDetails?.email,
    "Phone Number": userDetails?.phone,
  };

  const avatarSrc = userDetails?.photo
    ? `${VITE_APP_ASSETS_PATH}${userDetails?.folderLocation}/${userDetails?.photo}`
    : "";

  /*
    Handlers & Callback Actions
   */
  const handleProfilePictureSave = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    await handleMutation({
      mutationFn: updateProfilePicture,
      payload: { id, formData },
      onSuccess: (data) => {
        toaster.success(
          data?.message || "Profile picture updated successfully"
        );
      },
    });
  };

  return {
    id,
    userDetails,
    isLoading: isLoading || isFetching,
    isFetching,
    isUpdatingPhoto,
    addEditUserModal,
    setAddEditUserModal,
    visualizeFormatUserDetails,
    avatarSrc,
    handleProfilePictureSave,
  };
}
