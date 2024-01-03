"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { axiosProtected } from "@/configs/axios/axios.protected";
import dayjs from "dayjs";
import { OrderStatus, PAGE_PER_PAGE, SortByDate } from "@/constants";
import { IOrder } from "@/interfaces";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import { formatCurrency } from "@/lib/formatCurrency";

const orderData = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    created: new Date(),
    price: 100000,
  },
  {
    buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" },
    editBtn: true,
    id: "2",
    name: "Nguyễn Văn B",
    created: new Date(),
    price: 100000,
  },
  {
    buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" },
    deleteBtn: true,
    id: "3",
    name: "Nguyễn Văn C",
    created: new Date(),
    price: 100000,
  },
];

const OrdersPage = () => {
  const [query, setQuery] = useState<{
    limit: number;
    page: number;
    status: OrderStatus | "";
    date: SortByDate | "";
  }>({ limit: PAGE_PER_PAGE, page: 1, status: "", date: "" });

  const [listOrder, setListOrder] = useState<IOrder[]>();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    axiosProtected
      .get(
        `/order?limit=${query.limit}&page=${query.page}&status=${query.status}&date=${query.date}`
      )
      .then((res) => {
        setListOrder(res.data.orders);
        setTotal(res.data.total);
      })
      .catch((e) => console.log("e :", e));
  }, [query]);

  const handleSortByDate = () => {
    if (!query.date || query.date === SortByDate.DESC) {
      setQuery({ ...query, date: SortByDate.ASC });
      return;
    }
    setQuery({ ...query, date: SortByDate.DESC });
  };

  const handleChangePage = (currentPage: number) => {
    setQuery({ ...query, page: currentPage });
  };
  return (
    <div className="pt-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Order
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Khách hàng
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <p
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={handleSortByDate}
                    >
                      Thời gian tạo
                      {!query.date || query.date === SortByDate.DESC ? (
                        <FaAngleDown />
                      ) : (
                        <FaAngleUp />
                      )}
                    </p>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Giá tiền
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listOrder?.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {order.tracking?.customerName || ""}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dayjs(order.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(order.payment.amount)}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        page={query.page}
        size={query.limit}
        total={total}
        onChange={handleChangePage}
      />
    </div>
  );
};

export default OrdersPage;
