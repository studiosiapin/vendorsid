import { OrderStatus } from '@prisma/client';

export interface OrderResponse {
  id: string;
  invoiceId: string;
  title: string;
  description: string;
  linkMockup: string;
  linkCollar: string;
  linkLayout: string;
  linkSharedrive: string;
  linkTracking: string;
  bahanCode: string;
  status: OrderStatus;
  totalAmount: number;
  dpAmount: number;
  settlementAmount: number;
  startAt: Date;
  finishAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
  orderDetails: {
    ukuranId: string;
    quantity: number;
    ukuran: {
      id: string;
      name: string;
    };
  }[];
}
