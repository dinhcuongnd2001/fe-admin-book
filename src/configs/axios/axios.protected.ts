import axios, {
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshTokenFn } from "@/common";

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

const axiosProtected = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @param : config: this is the all config will passed with request
 *
 */

axiosProtected.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // before send req
    // we will get accessToken from localhost and bind it into header;
    const accessToken = String(localStorage.getItem("accessToken"));
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosProtected.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (err: AxiosError) => {
    const config = err.config as CustomAxiosConfig;

    if (err.response?.status === 401 && !config.sent) {
      config.sent = true;
      const { accessToken } = await refreshTokenFn();
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        } as AxiosRequestHeaders;
      }
      // Gửi lại request lỗi
      return await axiosProtected(config);
    }
    return Promise.reject(err);
  }
);

export { axiosProtected };
