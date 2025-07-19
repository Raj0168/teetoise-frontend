import axios from "axios";
import { store } from "./redux/store";
import { login, logout } from "./redux/slices/userSlice";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosAuth = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No token found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.user.refreshToken;

      if (refreshToken) {
        try {
          const response = await axiosAuth.post("/auth/refresh-token", {
            refreshToken,
          });

          const { token } = response.data;

          store.dispatch(
            login({
              user: state.user.user,
              token: token,
              refreshToken: state.user.refreshToken,
            })
          );

          axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return axiosInstance(originalRequest);
        } catch (err) {
          store.dispatch(logout());
          return Promise.reject(err);
        }
      } else {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosAuth };
