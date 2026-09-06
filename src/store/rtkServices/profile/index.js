import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../api";
import { adminApiEndpoints } from "../../../api/adminEndpoints";

export const profileService = createApi({
  reducerPath: "profileService",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Profile", "Profile_Picture"],
  endpoints: (builder) => ({
    getProfileDetails: builder.query({
      query: (id) => ({
        url: adminApiEndpoints.profile.base(id),
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? {},
      providesTags: ["Profile"],
    }),

    updateProfileDetails: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: adminApiEndpoints.profile.base(id),
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Profile"],
    }),

    getProfilePhoto: builder.query({
      query: (id) => ({
        url: adminApiEndpoints.profile.photo(id),
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? {},
      providesTags: ["Profile_Picture"],
    }),

    updateProfilePhoto: builder.mutation({
      query: ({ id, imgData }) => ({
        url: adminApiEndpoints.profile.photo(id),
        method: "PUT",
        body: imgData,
      }),
      invalidatesTags: ["Profile_Picture", "Profile"],
    }),
  }),
});

export const {
  useGetProfileDetailsQuery,
  useUpdateProfileDetailsMutation,
  useGetProfilePhotoQuery,
  useUpdateProfilePhotoMutation,
} = profileService;
