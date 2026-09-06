import React from "react";
import { RestrictedToGuests } from "TheOdcMfUI/hoc";

export const userRoutes = [
  {
    path: "/",
    name: "Dashboard",
    exact: true,
    component: React.lazy(() => import("../view/dashboard/pages/Dashboard")),
  },
  {
    path: "/user-management",
    name: "UserManagement",
    exact: true,
    component: React.lazy(
      () => import("../view/userMgmt/pages/UserManagement")
    ),
  },
  {
    path: "/user-management/:id",
    name: "UserDetails",
    exact: true,
    component: React.lazy(() => import("../view/userMgmt/pages/UserDetails")),
  },
  {
    path: "/dish-management",
    name: "DishManagement",
    exact: true,
    component: React.lazy(
      () => import("../view/productMgmt/pages/ProductManagement")
    ),
  },
  {
    path: "/dish-management/:id",
    name: "DishDetails",
    exact: true,
    component: React.lazy(
      () => import("../view/productMgmt/pages/ProductDetails")
    ),
  },
  {
    path: "/dish-management/add-dish",
    name: "AddDish",
    exact: true,
    component: React.lazy(
      () => import("../view/productMgmt/pages/AddEditProduct")
    ),
  },
  {
    path: "/dish-management/edit-dish/:id",
    name: "EditDish",
    exact: true,
    component: React.lazy(
      () => import("../view/productMgmt/pages/AddEditProduct")
    ),
  },
  {
    path: "/order-management",
    name: "OrderManagement",
    exact: true,
    component: React.lazy(
      () => import("../view/orderMgmt/pages/OrderManagement")
    ),
  },
  {
    path: "/order-management/:orderId",
    name: "OrderDetails",
    exact: true,
    component: React.lazy(() => import("../view/orderMgmt/pages/OrderDetails")),
  },
  {
    path: "/payment-management",
    name: "PaymentManagement",
    exact: true,
    component: React.lazy(
      () => import("../view/paymentMgmt/pages/PaymentManagement")
    ),
  },
  {
    path: "/payment-management/:paymentId",
    name: "PaymentDetails",
    exact: true,
    component: React.lazy(
      () => import("../view/paymentMgmt/pages/PaymentDetails")
    ),
  },
  {
    path: "/support",
    name: "Support",
    exact: true,
    component: React.lazy(() => import("../view/support/pages/Support")),
  },
  {
    path: "/inquiries",
    name: "ContactInquiries",
    exact: true,
    component: React.lazy(
      () => import("../view/inquiriesMgmt/pages/InquiriesMgmt")
    ),
  },
  {
    path: "/profile",
    name: "Profile",
    exact: true,
    component: React.lazy(() => import("../view/profile/pages/Profile")),
  },
  {
    redirectRoute: true,
    name: "Dashboard",
    path: "/",
  },
];

export const guestRoutes = [
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    exact: true,
    component: RestrictedToGuests(
      React.lazy(() => import("../view/auth/pages/ForgotPassword"))
    ),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    exact: true,
    component: RestrictedToGuests(
      React.lazy(() => import("../view/auth/pages/ResetPassword"))
    ),
  },
  {
    redirectRoute: true,
    name: "ForgotPassword",
    path: "/forgot-password",
  },
];
