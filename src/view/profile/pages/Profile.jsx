import React from "react";
import { Box, Card, Divider, Grid, Stack, Typography } from "@mui/material";

import { AvatarUpload, Button, FormInput } from "TheOdcMfUI/sharedComp";

import { PageHeader } from "../../../sharedComponents";
import { ProfileSkeleton, UpdatePasswordModal } from "../components";

import { useProfile } from "../hooks";

function Profile() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Local State Accessors & Mutators
     */
    isEditing,
    setIsEditing,
    updatePasswordModal,
    setUpdatePasswordModal,

    /*
      RTK Query API State Indicators
     */
    isFetching,
    isSaving,
    isProfilePicUpdating,

    /*
      Computed API Data & Memos
     */
    profileDetails,
    control,
    avatarSrc,

    /*
      Event Handler Callbacks
     */
    handleSubmit,
    reset,
    handelUpdateProfilePic,
  } = useProfile();

  return (
    <>
      <PageHeader pageTitle="Profile" hideExportBtn showBackBtn />
      {isFetching ? (
        <ProfileSkeleton />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          <Card sx={{ width: { xs: "100%", lg: 350 } }}>
            <Stack spacing={2} alignItems="center">
              <AvatarUpload
                avatar={avatarSrc}
                name={`${profileDetails.firstName || ""} ${
                  profileDetails.lastName || ""
                }`.trim()}
                alt={`${profileDetails.firstName || ""} ${
                  profileDetails.lastName || ""
                }`.trim()}
                loading={isProfilePicUpdating}
                onSave={handelUpdateProfilePic}
              />

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {`${profileDetails.firstName || "N/A"} ${
                  profileDetails.lastName || "N/A"
                }`}
              </Typography>
              <Button
                size="micro"
                type="button"
                onClick={() => setUpdatePasswordModal({ open: true })}
              >
                Update Password
              </Button>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom={3}
                  color="textDisabled"
                >
                  Description
                </Typography>
                <Typography variant="body1">
                  {profileDetails?.description || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ my: 1 }} />

            <Grid
              component="form"
              container
              spacing={1.5}
              onSubmit={handleSubmit}
            >
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="firstName"
                  label="First Name"
                  control={control}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="lastName"
                  label="Last Name"
                  control={control}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="email"
                  label="Email"
                  control={control}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item size={12}>
                <FormInput
                  name="description"
                  label="Description"
                  inputType="textarea"
                  control={control}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={12} mt={1}>
                {!isEditing ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      disabled={isSaving}
                      sx={{ px: 4 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
      <UpdatePasswordModal
        updatePasswordModal={updatePasswordModal}
        setUpdatePasswordModal={setUpdatePasswordModal}
      />
    </>
  );
}

export default Profile;
