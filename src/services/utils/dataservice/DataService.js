import axios from 'axios';

import { setGlobalLoading } from '@/core/store/loadingSlice';
import store from '@/core/store/store';
import { handle401Error } from '@/services/utils/tokenRefreshHandler';
import { deepTrimStrings, isMultipartOrBinary } from '@/utils/sanitizeUtils';

const BASE_URL = import.meta.env.VITE_API_URL;

// --- Security defaults ---
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Endpoints that should NOT trigger the global loader
const NO_LOADER_ENDPOINTS = [];

// Track active requests for global loading
let activeRequests = 0;

// --- Global Interceptors (applied to ALL axios instances) ---
axios.interceptors.request.use(
  (config) => {
    const shouldShowLoader =
      !config._skipGlobalLoader &&
      !NO_LOADER_ENDPOINTS.some((ep) => config.url?.includes(ep));

    if (shouldShowLoader) {
      activeRequests++;
      store.dispatch(setGlobalLoading(true));
    }

    // Trim all string values in request body (skip file uploads)
    if (config.data && !isMultipartOrBinary(config)) {
      config.data = deepTrimStrings(config.data);
    }
    //  uncomment when using ngrok BE server
    config.headers['ngrok-skip-browser-warning'] = 'true';

    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => {
    if (!response.config._skipGlobalLoader) {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) store.dispatch(setGlobalLoading(false));
    }
    return response;
  },
  (error) => {
    if (!error.config?._skipGlobalLoader) {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) store.dispatch(setGlobalLoading(false));
    }

    return handle401Error(error);
  },
);

/**
 * Base DataService class — Axios wrapper with token injection.
 * Extend or instantiate for different base URLs / configs.
 */
class DataService {
  constructor(config = {}) {
    this._baseUrl = config.baseURL || BASE_URL;
    this._headers = config.headers || {};
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  _getConfig(config = {}) {
    const token = DataService.getToken();
    const headers = {
      'Content-Type': config.isFormData
        ? 'multipart/form-data'
        : 'application/json',
      ...this._headers,
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Remove our custom flags before passing to axios
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { isFormData: _isFormData, _skipGlobalLoader, ...rest } = config;

    return {
      ...rest,
      headers,
      _skipGlobalLoader: config._skipGlobalLoader || false,
    };
  }

  _url(path) {
    return `${this._baseUrl}/${path}`;
  }

  get(path, config = {}) {
    return axios.get(this._url(path), this._getConfig(config));
  }

  post(path, data, config = {}) {
    return axios.post(this._url(path), data, this._getConfig(config));
  }

  put(path, data, config = {}) {
    return axios.put(this._url(path), data, this._getConfig(config));
  }

  patch(path, data, config = {}) {
    return axios.patch(this._url(path), data, this._getConfig(config));
  }

  delete(path, config = {}) {
    return axios.delete(this._url(path), this._getConfig(config));
  }
}

/**
 * Factory: create a DataService instance with a custom base URL.
 * Usage: const billingApi = createDataService({ baseURL: "https://billing.api.com" });
 */
export function createDataService(config = {}) {
  return new DataService(config);
}

export default DataService;
