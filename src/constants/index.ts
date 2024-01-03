export const PAGE_PER_PAGE = 8;

export enum OrderStatus {
  PENDING = "PENDING",
  READY_TO_PICK = "READY_TO_PICK",
  SHIPPING = "SHIPPING",
  DONE = "DONE",
  CANCEL = "CANCEL",
}

export enum SortByDate {
  ASC = "asc",
  DESC = "desc",
}

export enum PaymentGateway {
  VNPAY = "VNPAY",
  CASH = "CASH",
}

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REJECTED = "REJECTED",
}
