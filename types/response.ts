import { OrderStatus } from '@prisma/client';

// Tipe untuk User
type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    gender: string;
    picture: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

// Tipe untuk Transaction
export type OrderType = {
    id: string;
    title: string;
    invoiceId: string;
    description: string;
    linkMockup: string;
    linkCollar: string;
    linkLayout: string;
    linkSharedrive: string;
    startAt: string | null;
    finishAt: string | null;
    totalAmount: number;
    dpAmount: number;
    status: OrderStatus;
    bahanCode: string;
    jenisCode: string;
    shipmentCode: string;
    shipmentAddress: string | null;
    shipmentCost: number | null;
    shipmentLink: string | null;
    settlementAmount: number;
    linkTracking: string | null;
    proofDp: string | null;
    proofSettlement: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    user: UserType;
};

// Tipe untuk Pagination
type PaginationType = {
    page: number;
    total_data: number;
    total_page: number;
};

// Tipe untuk Response Utama
export type OrdersResponse = {
    message: string;
    code: number;
    data: OrderType[];
    pagination: PaginationType;
};

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
