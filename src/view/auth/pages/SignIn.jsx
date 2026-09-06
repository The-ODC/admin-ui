import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Container, Typography, Stack, Link } from "@mui/material";

import { Button, FormInput } from "TheOdcMfUI/sharedComp";

import { useSignIn } from "../hooks";

function SignIn() {
  /*
    Hook Configuration & Destructuring
   */
  const {
    /*
      Computed API Data & Memos
     */
    control,

    /*
      RTK Query API State Indicators
     */
    isSubmitting,

    /*
      Event Handler Callbacks
     */
    handleSubmit,
  } = useSignIn();

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
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="text.secondary"
          >
            Sign in to continue to your dashboard
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              <FormInput
                name="email"
                control={control}
                label="Email"
                inputType="text"
              />
              <FormInput
                name="password"
                control={control}
                label="Password"
                inputType="password"
              />

              <Box display="flex" justifyContent="flex-end">
                <Link component={NavLink} to="/forgot-password" variant="body2">
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default SignIn;
