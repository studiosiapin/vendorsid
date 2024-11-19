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

// Statistic response
export interface StatisticResponse {
  role: string;
  totalCompletedOrders: number;
  totalWorkers: number;
  totalResellers: number;
  top5Bahan: TopBahan[];
  top5Jenis: TopJenis[];
  top5Reseller: TopReseller[];
  totalPemasukan: number;
  totalSisa: number;
  barchartData: [
    {
      date: string;
      amount: number;
      order: number;
    }
  ];
}

export interface TopBahan {
  count: number;
  bahan: {
    code: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

export interface TopJenis {
  count: number;
  jenis: {
    code: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

export interface TopReseller {
  count: number;
  totalAmount: number;
  reseller: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}
