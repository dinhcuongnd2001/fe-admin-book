import { OrderStatus } from "@/constants";

export interface TypeGenTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TypeLogin {
  username: string;
  password: string;
}

export interface TypeResponse {
  message: string;
  data?: any;
}

export interface IOrder {
  booksOrders: IBookInOrders[];
  createdAt: Date;
  id: string;
  payment: IPayment;
  status: OrderStatus;
  tracking: ITracking;
}

interface IBookInOrders {
  name: string;
}

interface IPayment {
  gateway: PaymentGateway;
  status: PaymentStatus;
  amount: number;
}

interface ITracking {
  url: string;
  address: string;
  fee: number;
  customerName: string;
}
