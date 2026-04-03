import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AppErrorBoundary from "@/components/AppErrorBoundary";
import MainAppLayout from "@/app/MainAppLayout";
import { setNavigateRef } from "@/utils/navigationService";
import { routeConfig, publicRouteConfig, sharedRouteConfig } from "./routeConfig";

function NavigationSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigateRef(navigate);
  }, [navigate]);
  return null;
}



// Auth guard — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Redirect away from login/signup if already authenticated
function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/master-data" replace />;
  return children;
}

// Conditionally wraps in MainAppLayout if user is logged in and route opts in
function SharedRoute({ children, useLayout = false }) {
  const token = localStorage.getItem("token");
  if (token && useLayout) {
    return <MainAppLayout>{children}</MainAppLayout>;
  }
  return children;
}

function renderChildren(children) {
  return children?.map((child) =>
    child.index ? (
      <Route key="index" index element={<child.element />} />
    ) : (
      <Route key={child.path} path={child.path} element={<child.element />}>
        {renderChildren(child.children)}
      </Route>
    )
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-neutral-400 animate-pulse">Loading...</div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <NavigationSetter />
      <AppErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public-only routes (login, signup — redirect if already logged in) */}
          {publicRouteConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PublicOnlyRoute>
                  <route.element />
                </PublicOnlyRoute>
              }
            />
          ))}

          {/* Shared routes — accessible by everyone, with or without auth */}
          {sharedRouteConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <SharedRoute useLayout={route.useLayout}>
                  <route.element />
                </SharedRoute>
              }
            />
          ))}

          {/* Protected routes — require auth, wrapped in MainAppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainAppLayout />
              </ProtectedRoute>
            }
          >
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              >
                {renderChildren(route.children)}
              </Route>
            ))}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/master-data" replace />} />
        </Routes>
      </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}
