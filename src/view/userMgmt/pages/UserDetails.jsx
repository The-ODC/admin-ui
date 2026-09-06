import React from "react";
import {
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  DriveFileRenameOutline,
  LocationOn,
  Phone,
  PhoneAndroid,
} from "@mui/icons-material";

import { AvatarUpload, Button } from "TheOdcMfUI/sharedComp";
import { formatCurrency } from "TheOdcMfUI/utility";

import { PageHeader } from "../../../sharedComponents";
import { AddEditUserModal, UserDetailsSkeleton } from "../components";

import { useUserDetails } from "../hooks";

function UserDetails() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Theme & Layout
     */
    id,

    /*
      Local State Accessors & Mutators
     */
    addEditUserModal,
    setAddEditUserModal,

    /*
      RTK Query API State Indicators
     */
    isLoading,
    isFetching,
    isUpdatingPhoto,

    /*
      Computed API Data & Memos
     */
    userDetails,
    visualizeFormatUserDetails,
    avatarSrc,

    /*
      Event Handler Callbacks
     */
    handleProfilePictureSave,
  } = useUserDetails();

  return (
    <>
      <PageHeader
        pageTitle={
          <>
            User Details -
            <Typography
              variant="span"
              color="text.disabled"
              ml={2}
            >{`# ${userDetails?.id || id}`}</Typography>
          </>
        }
        hideExportBtn
        showBackBtn
      />
      {isLoading || !userDetails?.id ? (
        <UserDetailsSkeleton />
      ) : (
        <Stack spacing={3}>
          <Card>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
              <AvatarUpload
                avatar={avatarSrc}
                name={`${userDetails?.firstName || ""} ${
                  userDetails?.lastName || ""
                }`.trim()}
                alt={`${userDetails?.firstName || ""} ${
                  userDetails?.lastName || ""
                }`.trim()}
                loading={isUpdatingPhoto}
                viewOnly={
                  isFetching ||
                  isUpdatingPhoto ||
                  userDetails?.createdBy !== "admin"
                }
                onSave={handleProfilePictureSave}
              />

              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {`${userDetails?.firstName || "N/A"} ${
                    userDetails?.lastName || ""
                  }`}
                  <Typography
                    component="span"
                    color="textDisabled"
                    ml={1}
                  >{`#${id}`}</Typography>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total Order: {userDetails?.orders || 0}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total Spent: {formatCurrency(userDetails?.totalSpent)}
                </Typography>
              </Box>
            </Box>
          </Card>
          <Card>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                User's Information
              </Typography>
              <Button
                size="micro"
                endIcon={<DriveFileRenameOutline />}
                disabled={userDetails?.createdBy !== "admin"}
                onClick={() =>
                  setAddEditUserModal({
                    open: true,
                    selectedUser: userDetails,
                    action: "EDIT",
                  })
                }
              >
                Edit
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {Object.entries(visualizeFormatUserDetails).map(
                ([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography
                      variant="body2"
                      gutterBottom={3}
                      color="textDisabled"
                    >
                      {label}
                    </Typography>
                    <Typography variant="body1">{value || "N/A"}</Typography>
                  </Grid>
                )
              )}
            </Grid>
          </Card>

          {/* ── Saved Addresses ────────────────────────────────────────── */}
          <Card>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Saved Addresses
              </Typography>
              <Chip
                label={`${(userDetails?.addresses || []).length} address${(userDetails?.addresses || []).length !== 1 ? "es" : ""}`}
                size="small"
                variant="outlined"
              />
            </Box>
            <Divider sx={{ my: 2 }} />

            {(userDetails?.addresses || []).length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, color: "text.disabled" }}>
                <LocationOn sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                <Typography variant="body2">No saved addresses</Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {(userDetails?.addresses || []).map((addr) => (
                  <Grid
                    key={addr.id || addr._id}
                    size={{ xs: 12, sm: 6, md: 4 }}
                  >
                    <Box
                      sx={(theme) => ({
                        border: `1px solid ${addr.isDefault ? theme.palette.primary.main : theme.palette.divider}`,
                        borderRadius: 2,
                        p: 2,
                        height: "100%",
                        position: "relative",
                        backgroundColor: addr.isDefault
                          ? `${theme.palette.primary.main}08`
                          : "transparent",
                      })}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <LocationOn
                          fontSize="small"
                          color={addr.isDefault ? "primary" : "disabled"}
                        />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {addr.label || "Address"}
                        </Typography>
                        {addr.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            sx={{ ml: "auto" }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.city}, {addr.state} – {addr.postalCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.country}
                      </Typography>
                      {(addr.phone || addr.alternatePhone) && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.8,
                            mt: 1.2,
                          }}
                        >
                          {addr.phone && (
                            <Chip
                              icon={
                                <Phone sx={{ fontSize: "14px !important" }} />
                              }
                              label={addr.phone}
                              size="small"
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                            />
                          )}
                          {addr.alternatePhone && (
                            <Chip
                              icon={
                                <PhoneAndroid
                                  sx={{ fontSize: "14px !important" }}
                                />
                              }
                              label={`Alt: ${addr.alternatePhone}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Stack>
      )}

      <AddEditUserModal
        addEditUserModal={addEditUserModal}
        setAddEditUserModal={setAddEditUserModal}
      />
    </>
  );
}

export default UserDetails;
