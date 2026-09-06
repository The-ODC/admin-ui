import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar, Box, Container, Link, Stack, Typography } from "@mui/material";
import {
  CheckCircleOutlineTwoTone,
  LockResetTwoTone,
} from "@mui/icons-material";

import { Button, FormInput } from "TheOdcMfUI/sharedComp";

import { useResetPassword } from "../hooks";

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

function ResetPassword() {
  /*
    Hook Configuration & Destructuring
   */
  const { token, control, newPassword, isSuccess, isLoading, handleSubmit } =
    useResetPassword();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            boxShadow: 6,
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            backgroundColor: "background.paper",
          }}
        >
          {isSuccess ? (
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(46, 125, 50, 0.25)"
                      : "rgba(46, 125, 50, 0.12)",
                  color: "success.main",
                  border: "2px solid",
                  borderColor: "success.main",
                  width: 68,
                  height: 68,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 24px rgba(46, 125, 50, 0.35)"
                      : "0 0 16px rgba(46, 125, 50, 0.2)",
                }}
              >
                <CheckCircleOutlineTwoTone sx={{ fontSize: 38 }} />
              </Avatar>

              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Password Reset Complete
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your admin account password has been successfully updated. You
                  can now sign in with your new credentials.
                </Typography>
              </Box>

              <Button
                component={NavLink}
                to="/signin"
                variant="contained"
                fullWidth
              >
                Proceed to Sign In
              </Button>
            </Stack>
          ) : !token ? (
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(211, 47, 47, 0.25)"
                      : "rgba(211, 47, 47, 0.12)",
                  color: "error.main",
                  border: "2px solid",
                  borderColor: "error.main",
                  width: 68,
                  height: 68,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 24px rgba(211, 47, 47, 0.35)"
                      : "0 0 16px rgba(211, 47, 47, 0.2)",
                }}
              >
                <LockResetTwoTone sx={{ fontSize: 38 }} />
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Invalid or Missing Reset Link
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This password reset link is invalid or has expired. Please
                  request a new reset link.
                </Typography>
              </Box>

              <Button
                component={NavLink}
                to="/forgot-password"
                variant="contained"
                fullWidth
              >
                Request New Link
              </Button>
            </Stack>
          ) : (
            <>
              <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                gutterBottom
              >
                Reset Password
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                mb={3}
                color="text.secondary"
              >
                Create a new secure password for your admin account.
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <FormInput
                    name="newPassword"
                    control={control}
                    label="New Password"
                    inputType="password"
                    required
                  />

                  <FormInput
                    name="confirmPassword"
                    control={control}
                    label="Confirm New Password"
                    inputType="password"
                    required
                  />

                  {/* Password Requirement Checklist */}
                  <Box pl={1} pt={0.5}>
                    {passwordChecks.map((check, index) => {
                      const passed = check.test(newPassword);
                      return (
                        <Typography
                          key={index + 1}
                          variant="caption"
                          display="block"
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

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <Box textAlign="center">
                    <Link
                      component={NavLink}
                      to="/signin"
                      variant="body2"
                      underline="hover"
                    >
                      Back to Login
                    </Link>
                  </Box>
                </Stack>
              </form>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ResetPassword;
