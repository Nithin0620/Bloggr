import axios from "axios";
import { toast } from "react-hot-toast";

let activeRequestsCount = 0;
let wakeupTimer = null;
let isWakeupToastActive = false;

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      activeRequestsCount++;

      // If this is the first active request and no timer is running, start cold-start detector timer
      if (!wakeupTimer && activeRequestsCount === 1) {
        wakeupTimer = setTimeout(() => {
          if (activeRequestsCount > 0) {
            isWakeupToastActive = true;
            toast.loading(
              "🚀 Server is waking up (cold start), please allow up to 60s...",
              {
                id: "server-wakeup-toast",
                duration: 60000,
                position: "top-center",
                style: {
                  background: "#1e293b",
                  color: "#f8fafc",
                  border: "1px solid #334155",
                  fontWeight: "500",
                },
              }
            );
          }
        }, 3500); // 3.5s threshold indicates backend is sleeping
      }

      return config;
    },
    (error) => {
      activeRequestsCount = Math.max(0, activeRequestsCount - 1);
      if (activeRequestsCount === 0 && wakeupTimer) {
        clearTimeout(wakeupTimer);
        wakeupTimer = null;
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      activeRequestsCount = Math.max(0, activeRequestsCount - 1);

      if (activeRequestsCount === 0) {
        if (wakeupTimer) {
          clearTimeout(wakeupTimer);
          wakeupTimer = null;
        }

        if (isWakeupToastActive) {
          isWakeupToastActive = false;
          toast.dismiss("server-wakeup-toast");
          toast.success("⚡ Server is ready!", {
            id: "server-ready-toast",
            duration: 3000,
            position: "top-center",
          });
        }
      }

      return response;
    },
    (error) => {
      activeRequestsCount = Math.max(0, activeRequestsCount - 1);

      if (activeRequestsCount === 0) {
        if (wakeupTimer) {
          clearTimeout(wakeupTimer);
          wakeupTimer = null;
        }

        if (isWakeupToastActive) {
          isWakeupToastActive = false;
          toast.dismiss("server-wakeup-toast");
        }
      }

      return Promise.reject(error);
    }
  );
};
