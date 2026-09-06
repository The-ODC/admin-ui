import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import packageJson from "../../package.json";

import { AdminLayout } from "TheOdcMfUI/layouts";
import { useCookies } from "TheOdcMfUI/hooks";

import { adminMenuItems } from "../constant";
import { OrderQueueNotifier } from "../sharedComponents";
import SignIn from "../view/auth/pages/SignIn";

import { useGetProfileDetailsQuery } from "../store/rtkServices";

function Layout() {
  const { getCookie } = useCookies();
  const isAuthenticated = !!getCookie("admin_auth_token");
  const userId = getCookie("admin_id");

  const { data: profileDetails = {} } = useGetProfileDetailsQuery(userId, {
    skip: !isAuthenticated || !userId,
  });

  return (
    <>
      {isAuthenticated ? (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminLayout
            version={packageJson.version}
            profileData={profileDetails}
            menuItems={adminMenuItems}
          >
            <Outlet />
          </AdminLayout>
          <OrderQueueNotifier />
        </Suspense>
      ) : (
        <SignIn />
      )}
    </>
  );
}

export default Layout;
