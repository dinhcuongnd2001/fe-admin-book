"use client";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { axiosProtected } from "@/configs/axios/axios.protected";
import { IOrder } from "@/interfaces";
import { formatCurrency } from "@/lib/formatCurrency";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import dayjs from "dayjs";

const statusOrder = [
  {
    name: "PENDING",
    value: "Chờ Xác Nhận",
    desc: "khoảng 1 ngày",

    img: "/images/clipboard.png",
  },
  {
    name: "READY_TO_PICK",
    value: "Shipper Đang Lấy Hàng",
    desc: "khoảng 2-3 ngày",
    img: "/images/delivery-man.png",
  },
  {
    name: "SHIPPING",
    value: "Đang Giao Hàng",
    desc: "khoảng 7-9 ngày",
    img: "/images/fast-delivery.png",
  },
  {
    name: "DONE",
    value: "Giao Hàng Thành Công",
    desc: "",
    img: "/images/check.png",
  },

  {
    name: "CANCEL",
    value: "Đã Hủy Đơn",
    desc: "",
    img: "/images/remove.png",
  },
];

const statuaOrderWithoutTracking = [
  {
    name: "PENDING",
    value: "Chờ Xác Nhận",
    desc: "khoảng 1 ngày",

    // img: "/images/clipboard.png",
    icon: <MdOutlinePendingActions />,
  },
  {
    name: "DONE",
    value: "Thanh toán thành công",
    desc: "",
    // img: "/images/check.png",
    icon: <FaCheckCircle />,
  },

  {
    name: "CANCEL",
    value: "Đã Hủy Đơn",
    desc: "",
    icon: <MdCancel />,

    // img: "/images/remove.png",
  },
];
const OrderDetail = () => {
  const { id } = useParams() as { id: string };

  const [order, setOrder] = useState<IOrder>();

  const [refetch, setRefetch] = useState<Boolean>(false);

  useEffect(() => {
    if (!id) return;

    axiosProtected
      .get<any, { data: IOrder }>(`/order/${id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((e) => {
        toast.error("Lỗi không lấy được đơn hàng");
      });
    setRefetch(false);
  }, [id, refetch]);

  const productPrice = useMemo(() => {
    if (!order) return 0;
    return order.booksOrders.reduce(
      (res, curr) => (res += curr.amount * curr.currentBookPrice),
      0
    );
  }, [order]);

  const handleConfirm = () => {
    axiosProtected
      .patch(`/order/confirm/${id}`)
      .then((res) => {
        console.log("res :", res);
        toast.success("Xác nhận đơn hàng thành công");
        setRefetch(!refetch);
      })
      .catch((e) => {
        toast.error("Xác nhận đơn hàng thất bại");
      });
  };

  const handleCancel = () => {
    axiosProtected
      .patch(`/order/cancel/${id}`)
      .then((res) => {
        toast.success("Hủy đơn hàng thành công");
        setRefetch(!refetch);
      })
      .catch((e) => {
        toast.error("Hủy đơn hàng thất bại");
      });
  };

  return (
    <div className="bg-gray-50">
      {order ? (
        <main className="mx-auto max-w-2xl pb-24 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8 lg:pt-2 mt-10">
          <div className="p-5 grid grid-cols-12 gap-x-5">
            <div className="lg:col-span-4 md:col-span-8 ssm:col-span-12">
              <ol className="relative text-gray-500 border-l border-gray-200">
                {order.tracking
                  ? statusOrder.map((x, index) => (
                      <li key={index} className="mb-10 ml-6">
                        <span
                          className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4  ring-gray-500 ${
                            x.name === order.status ? "bg-green-700" : ""
                          }`}
                        >
                          <Image
                            src={x.img}
                            alt="#Error_Image"
                            width={500}
                            height={500}
                            className="w-6 h-6 object-contain"
                          />
                        </span>
                        <h3 className="font-medium leading-tight">{x.value}</h3>
                        <p className="text-sm">{x.desc}</p>
                      </li>
                    ))
                  : statuaOrderWithoutTracking.map((x, ind) => (
                      <li key={ind} className="mb-10 ml-6">
                        <span
                          className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4  ring-gray-500 ${
                            x.name === order.status
                              ? "bg-green-700 fill-green-700"
                              : ""
                          }`}
                        >
                          {x.icon}
                        </span>
                        <h3 className="font-medium leading-tight">{x.value}</h3>
                        <p className="text-sm">{x.desc}</p>
                      </li>
                    ))}
              </ol>
            </div>

            <div className="lg:col-span-8 space-y-4 ssm:col-span-12 ssm:ml-[-20px] lg:mt-[-10px]">
              <div className="">
                <h2 className="text-lg font-medium text-gray-900">
                  Thông Tin Đơn Hàng
                </h2>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Ngày tạo đơn</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {dayjs(order.createdAt).format("DD-MM-YYYY")}
                      </dd>
                    </div>
                    {order.tracking ? (
                      <Fragment>
                        {order.tracking.customerName ? (
                          <div className="flex items-center justify-between">
                            <dt className="text-sm">Người đặt đơn</dt>
                            <dd className="text-sm font-medium text-gray-900">
                              {order.tracking.customerName}
                            </dd>
                          </div>
                        ) : null}

                        <div className="flex items-center justify-between">
                          <dt className="text-sm">Địa chỉ nhận hàng</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {order.tracking.address}
                          </dd>
                        </div>
                      </Fragment>
                    ) : null}

                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Thanh toán:</dt>
                      <dd className="text-base font-medium text-gray-900">
                        thanh toán bằng: {order.payment.gateway}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="">
                <h2 className="text-lg font-medium text-gray-900">Sản phẩm</h2>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <h3 className="sr-only">Sản Phẩm Trong Giỏ Hàng</h3>
                  <ul role="list" className="divide-y divide-gray-200">
                    {order.booksOrders.map((x, index) => (
                      <li key={index} className="flex px-4 py-6 sm:px-6">
                        <div className="flex-shrink-0">
                          <img
                            src={x.book.thumbnailUrl}
                            alt="#Error_Picture"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>

                        <div className="ml-6 flex flex-1 flex-col">
                          <div className="flex">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm">
                                <span className="font-medium text-gray-700 hover:text-gray-800">
                                  {x.book.name}
                                </span>
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                {x.bookType}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-1 items-end justify-between pt-2">
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatCurrency(x.currentBookPrice)}
                            </p>

                            <div className="ml-4">
                              <label htmlFor="quantity" className="sr-only">
                                Quantity
                              </label>
                              <span className="mr-1">x {x.amount}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Tiền Sản Phẩm</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(productPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.tracking?.fee || 0)}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Tổng</dt>
                      <dd className="text-base font-medium text-gray-900">
                        {formatCurrency(
                          productPrice + (order.tracking?.fee || 0)
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6 grid grid-cols-12 gap-x-5">
                    <button
                      disabled={order.status !== "PENDING"}
                      onClick={handleConfirm}
                      className={[
                        order.status !== "PENDING"
                          ? "cursor-default opacity-50"
                          : "",
                        " col-span-6 rounded-md border border-transparent bg-green-500 px-4 py-3 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2 focus:ring-offset-gray-50",
                      ].join(" ")}
                    >
                      Xác Nhận
                    </button>

                    <button
                      disabled={order.status !== "PENDING"}
                      onClick={handleCancel}
                      className={[
                        order.status !== "PENDING"
                          ? "cursor-default opacity-50"
                          : "",
                        "col-span-6 rounded-md border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-gray-50",
                      ].join(" ")}
                    >
                      Hủy Đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
};

export default OrderDetail;
