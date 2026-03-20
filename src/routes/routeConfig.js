import { lazy } from "react";

// Lazy-loaded pages — add your pages here
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));

/**
 * Map-based route config.
 * Each route object supports:
 *   path       — URL path
 *   element    — lazy component
 *   label      — display name (for sidebar/breadcrumb)
 *   children   — nested routes
 */
export const routeConfig = [
  {
    path: "/dashboard",
    element: Dashboard,
    label: "Dashboard",
  },
  // Add more:
  // {
  //   path: "/users",
  //   element: lazy(() => import("@/pages/Users/Users")),
  //   label: "Users",
  // },
];

// Public-only routes (redirect to dashboard if already logged in)
export const publicRouteConfig = [
  {
    path: "/login",
    element: lazy(() => import("@/pages/Auth/Login")),
    label: "Login",
  },
  {
    path: "/forgot-password",
    element: lazy(() => import("@/pages/Auth/ForgotPassword")),
    label: "Forgot Password",
  },
  {
    path: "/reset-password",
    element: lazy(() => import("@/pages/Auth/ResetPassword")),
    label: "Reset Password",
  },
  {
    path: "/set-password",
    element: lazy(() => import("@/pages/Auth/SetPassword")),
    label: "Set Password",
  },
];

// Shared routes — accessible both publicly AND when logged in
// These render WITHOUT the MainAppLayout (no sidebar/navbar)
// If you want the layout when logged in, set `useLayout: true`
export const sharedRouteConfig = [
  // {
  //   path: "/about",
  //   element: lazy(() => import("@/pages/About/About")),
  //   label: "About",
  //   useLayout: false,
  // },
];
