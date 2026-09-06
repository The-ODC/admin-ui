import { handleApiError } from "TheOdcMfUI/utility/http";
import { cookies } from "TheOdcMfUI/utility";
import { toaster } from "./";

export default function errorHandler(error = {}) {
  const apiError = handleApiError(error, {
    notify: (message) => toaster.error(message),
    onUnauthorized: () => {
      cookies.removeCookie("admin_auth_token");
      cookies.removeCookie("admin_id");
      cookies.removeCookie("theODC_admin_theme");
      window.location.reload();
    },
  });

  return apiError.message;
}
