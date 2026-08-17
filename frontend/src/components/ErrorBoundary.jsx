import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { RefreshCw, Home as HomeIcon } from "lucide-react";

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Route error boundary caught error:", error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center accent-bg-mode accent-text-mode">
      <div className="max-w-md w-full p-8 rounded-2xl border accent-border shadow-xl accent-bg-mode">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold accent-text mb-2">Something went wrong</h2>
        <p className="text-sm opacity-70 mb-6">
          {error?.message || "An unexpected error occurred while rendering this page."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              localStorage.removeItem("bloggr_cached_posts");
              localStorage.removeItem("bloggr_cached_categories");
              window.location.reload();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
          >
            <RefreshCw className="w-4 h-4" /> Reload App
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border accent-border hover:opacity-80 transition"
          >
            <HomeIcon className="w-4 h-4" /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
