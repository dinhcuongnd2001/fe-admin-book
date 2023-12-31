import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPublic.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export { axiosPublic };
