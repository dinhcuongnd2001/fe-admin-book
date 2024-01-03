"use client";
import React, { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { axiosPublic } from "@/configs/axios/axios.public";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
function LoginComponent() {
  const [visibalePass, setVisibalePass] = useState(false);
  const [account, setAccount] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const handleLogin = async () => {
    axiosPublic
      .post<any, { data: { accessToken: string; refreshToken: string } }>(
        "/auth/login",
        {
          ...account,
        }
      )
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        router.push("/orders");
        toast.success("Đăng nhập thành công");
      })
      .catch((e) => {
        toast.error("Đăng nhập thất bại");
      });
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-4 fixed inset-0 z-10 bg-gray-50 dark:bg-gray-900">
      <div className="w-[500px] rounded-[10px] bg-gray-50 h-[90%] sm:px-[55px] sm:pt-[65px] sm:pb-[54px]">
        <p className="font-Popins font-bold text-[39px] text-[#333] leading-[1.2] text-center pb-[49px]">
          Đăng Nhập
        </p>

        <div className="flex  flex-wrap border-b-2 mb-5 pb-[2px] relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-600  after:transition-all after:ease-linear hover:after:w-full after:duration-500">
          <span className="text-sm text-[#333] font-Popins leading-[1.5]">
            Email
          </span>
          <div className="w-full flex justify-start items-center h-[55px] relative">
            <IoPersonCircle className="text-white absolute left-1 " />
            <input
              style={{
                color: "white",
              }}
              value={account.email}
              onChange={(e) =>
                setAccount({ ...account, email: e.target.value })
              }
              placeholder="Nhập email của bạn"
              className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark: focus:bg-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
            />
          </div>
        </div>

        <div className="flex flex-wrap border-b-2 mb-5 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-600  after:transition-all after:ease-linear hover:after:w-full after:duration-500">
          <span className="text-sm text-[#333] font-Popins leading-[1.5]">
            Mật Khẩu
          </span>
          <div className="w-full flex justify-start items-center h-[55px]  relative">
            <FaLock className="text-white absolute left-1" />
            <input
              className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark: focus:bg-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập mật khẩu của bạn"
              type={visibalePass ? "text" : "password"}
              value={account.password}
              onChange={(e) =>
                setAccount({ ...account, password: e.target.value })
              }
            />
            <div
              className="cursor-pointer absolute right-1"
              onClick={() => setVisibalePass(!visibalePass)}
            >
              {visibalePass ? (
                <FaRegEye className="text-white" />
              ) : (
                <FaEyeSlash className="text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="text-right pt-2 pb-8 w-full font-Popins"></div>

        <div className="cursor-pointer flex justify-center items-center rounded-[25px] bg-gradient-to-l from-gray-900 via-gray-400 to-gray-900 bg-200% hover:bg-right transition-all ease-in-out duration-700">
          <button
            className="uppercase tracking-[2px] w-full p-4 text-white"
            onClick={handleLogin}
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
