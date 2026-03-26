import axios from "axios";

const REFRESH_URL = `${import.meta.env.VITE_API_URL}/auth/refresh`;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/**
 * Handles 401 responses by transparently refreshing the access token
 * and retrying all failed requests.
 *
 * - First 401 triggers a refresh; concurrent 401s queue up and wait.
 * - On refresh success: all queued requests retry with the new token.
 * - On refresh failure: all queued requests are rejected and user is logged out.
 * - Auth endpoints (/auth/*) are never retried (a 401 there means bad credentials).
 * - Each request is retried at most once (_retry flag prevents infinite loops).
 */
export const handle401Error = async (error) => {
  const originalRequest = error.config;
  const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

  if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    const token = await new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return await axios(originalRequest);
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return new Promise((resolve, reject) => {
    axios
      .post(REFRESH_URL, {}, { withCredentials: true, _skipGlobalLoader: true })
      .then((response) => {
        const newToken = response?.data?.data?.accessToken;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        resolve(axios(originalRequest));
      })
      .catch((refreshError) => {
        processQueue(refreshError);
        if (window.__handleLogout) window.__handleLogout();
        reject(refreshError);
      })
      .finally(() => {
        isRefreshing = false;
      });
  });
};
