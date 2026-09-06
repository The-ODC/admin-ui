import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "TheOdcMfUI/hooks";

const RestrictedToGuests = (WrappedComponent) => {
  const Wrapped = (props) => {
    const { getCookie } = useCookies();
    const isAuthenticated = !!getCookie("admin_auth_token");

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapped;
};

export default RestrictedToGuests;
