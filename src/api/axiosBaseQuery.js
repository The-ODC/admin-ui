import axiosMain from "./axiosInstance";

export const axiosBaseQuery =
  ({ baseURL = "" } = {}) =>
  async ({ url, method, body, data, params }) => {
    try {
      const response = await axiosMain({
        url,
        method,
        data: data !== undefined ? data : body,
        params,
        baseURL: baseURL || undefined,
      });

      return { data: response.data };
    } catch (error) {
      return {
        error: {
          status: error.status || error.response?.status || 500,
          data: error.data || error.response?.data || error.message,
        },
      };
    }
  };
