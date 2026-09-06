import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar, Box, Container, Link, Stack, Typography } from "@mui/material";
import { MarkEmailReadTwoTone } from "@mui/icons-material";

import { Button, FormInput } from "TheOdcMfUI/sharedComp";

import { useForgetPassword } from "../hooks";

function ForgotPassword() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Computed API Data & Memos
     */
    control,
    isSubmitted,
    submittedEmail,

    /*
      RTK Query API State Indicators
     */
    isLoading,

    /*
      Event Handler Callbacks
     */
    handleSubmit,
    handleResetForm,
  } = useForgetPassword();

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
          {isSubmitted ? (
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.25)"
                      : "rgba(25, 118, 210, 0.12)",
                  color: "primary.main",
                  border: "2px solid",
                  borderColor: "primary.main",
                  width: 68,
                  height: 68,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 0 24px rgba(25, 118, 210, 0.35)"
                      : "0 0 16px rgba(25, 118, 210, 0.2)",
                }}
              >
                <MarkEmailReadTwoTone sx={{ fontSize: 38 }} />
              </Avatar>

              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We have sent password reset instructions to:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ mt: 0.5 }}
                >
                  {submittedEmail}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.disabled">
                Didn't receive the email? Check your spam folder or try another
                email address.
              </Typography>

              <Stack direction="row" spacing={2} width="100%">
                <Button variant="outlined" fullWidth onClick={handleResetForm}>
                  Try Another Email
                </Button>
                <Button
                  component={NavLink}
                  to="/signin"
                  variant="contained"
                  fullWidth
                >
                  Back to Sign In
                </Button>
              </Stack>
            </Stack>
          ) : (
            <>
              <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                gutterBottom
              >
                Forgot Password
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                mb={3}
                color="text.secondary"
              >
                Enter your email address and we’ll send you a link to reset your
                password.
              </Typography>

              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                  <FormInput
                    name="email"
                    control={control}
                    label="Email Address"
                    inputType="email"
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
