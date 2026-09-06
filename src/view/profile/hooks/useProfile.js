import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cookies, buildAssetUrl } from "TheOdcMfUI/utility";

import {
  useGetProfileDetailsQuery,
  useGetProfilePhotoQuery,
  useUpdateProfileDetailsMutation,
  useUpdateProfilePhotoMutation,
} from "../../../store/rtkServices";
import { profileSchema } from "../validation";
import { VITE_APP_ASSETS_PATH } from "../../../config/env";
import { handleMutation, toaster } from "../../../utility";
import { useFormWithReinitialize } from "../../../hooks";

export function useProfile() {
  /*
    Hooks & Theme Configuration
   */
  const { getCookie } = cookies;
  const userId = getCookie("admin_id");

  /*
    Local State Declarations
   */
  const [isEditing, setIsEditing] = useState(false);
  const [updatePasswordModal, setUpdatePasswordModal] = useState({
    open: false,
  });

  /*
    Redux API Queries & Mutations (RTK Query)
   */
  const { data: profileDetails = {}, isFetching } =
    useGetProfileDetailsQuery(userId);
  const [updateProfileDetails, { isLoading: isUpdating }] =
    useUpdateProfileDetailsMutation();

  const {
    data: { folderLocation, photo } = {},
    isFetching: isProfilePicFetching,
  } = useGetProfilePhotoQuery(userId);
  const [updateProfilePhoto, { isLoading: isProfilePicUpdating }] =
    useUpdateProfilePhotoMutation();

  /*
    Computed Values & Memos (State Aggregates)
   */
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormWithReinitialize({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profileDetails?.firstName || "",
      lastName: profileDetails?.lastName || "",
      email: profileDetails?.email || "",
      description: profileDetails?.description || "",
    },
    mode: "onChange",
    enableReinitialize: true,
  });

  const avatarSrc = photo
    ? buildAssetUrl({
        baseUrl: VITE_APP_ASSETS_PATH,
        folderLocation,
        fileName: photo,
      })
    : "";

  /*
    Handlers & Callback Actions
   */
  const onSubmit = async (updatedData) => {
    await handleMutation({
      mutationFn: updateProfileDetails,
      payload: { id: userId, updatedData },
      onSuccess: (data) => {
        setIsEditing(false);
        toaster.success(data.message);
        reset();
      },
    });
  };

  const handelUpdateProfilePic = async (imgData) => {
    const formData = new FormData();
    formData.append("photo", imgData);

    await handleMutation({
      mutationFn: updateProfilePhoto,
      payload: { id: userId, imgData: formData },
      onSuccess: (data) => {
        toaster.success(data.message);
      },
    });
  };

  return {
    isEditing,
    setIsEditing,
    updatePasswordModal,
    setUpdatePasswordModal,
    profileDetails,
    isFetching: isFetching || isProfilePicFetching,
    isSaving: isSubmitting || isUpdating,
    isProfilePicUpdating,
    control,
    handleSubmit: handleSubmit(onSubmit),
    reset,
    handelUpdateProfilePic,
    avatarSrc,
  };
}
