import axios from "axios";
import { createAxiosInstance } from "TheOdcMfUI/utility/http";
import { cookies } from "TheOdcMfUI/utility";
import { VITE_APP_API_URL } from "../config/env";
import { errorHandler } from "../utility";

const axiosMain = createAxiosInstance({
  axios,
  baseURL: VITE_APP_API_URL,
  timeout: 10000,
  getToken: () => cookies.getCookie("admin_auth_token"),
  onError: (apiError, originalError) => {
    console.error("Axios Error in axiosInstance:", originalError);
    errorHandler(apiError);
  },
});

export default axiosMain;
