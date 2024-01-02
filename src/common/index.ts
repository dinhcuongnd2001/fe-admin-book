import mem from "mem";

import { axiosPublic } from "@/configs/axios/axios.public";
import { TypeGenTokenPair } from "@/interfaces";
const maxAge = parseInt(process.env.NEXT_PUBLIC_MAX_AGE || "10000");

interface TypeResponse {
  message: string;
  data: TypeGenTokenPair;
}

export const refreshTokenFn = mem(
  async (): Promise<TypeGenTokenPair> => {
    // b1 get refreshtoken from localStorage
    const refreshToken = String(localStorage.getItem("refreshToken"));

    try {
      const {
        data: { accessToken, refreshToken: newRefreshToken },
      } = await axiosPublic.post<never, TypeResponse>(
        "/auth/refresh-token",
        undefined,
        {
          headers: {
            Authorization: `BEARER ${refreshToken}`,
          },
        }
      );
      if (!accessToken || !newRefreshToken) {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
      }
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(newRefreshToken));
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      return { accessToken: "", refreshToken: "" };
    }
  },
  { maxAge }
);
