import { get } from "@/lib/request";

export type TransactionType =
  | "commission_income"
  | "upload_fee_income"
  | "ai_fee_income"
  | "disk_space_income";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface TransactionListItem {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  description: string | null;
  referenceId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetPlatformTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
  keySearch?: string;
  sortField?: "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PlatformTransactionsResponse {
  message: string;
  data: {
    transactions: TransactionListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const getPlatformTransactions = async (
  params?: GetPlatformTransactionsParams,
) => {
  try {
    const searchParams: Record<string, string> = {};

    if (params?.page) searchParams.page = params.page.toString();
    if (params?.limit) searchParams.limit = params.limit.toString();
    if (params?.type) searchParams.type = params.type;
    if (params?.keySearch) searchParams.keySearch = params.keySearch;
    if (params?.sortField) searchParams.sortField = params.sortField;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    const response = await get<PlatformTransactionsResponse>(
      "/api/admin/finance/transactions",
      Object.keys(searchParams).length > 0 ? searchParams : undefined,
      {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      },
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(
      response.payload.message || "Failed to fetch platform transactions",
    );
  } catch (error) {
    console.error("Error fetching platform transactions:", error);
    throw error;
  }
};

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export interface PaymentListItem {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  amount: number;
  status: PaymentStatus;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  note: string | null;
  rejectionReason: string | null;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetWithdrawalsParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  keySearch?: string;
  sortField?: "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface WithdrawalsResponse {
  message: string;
  data: {
    withdrawals: PaymentListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const getWithdrawals = async (params?: GetWithdrawalsParams) => {
  try {
    const searchParams: Record<string, string> = {};

    if (params?.page) searchParams.page = params.page.toString();
    if (params?.limit) searchParams.limit = params.limit.toString();
    if (params?.status) searchParams.status = params.status;
    if (params?.keySearch) searchParams.keySearch = params.keySearch;
    if (params?.sortField) searchParams.sortField = params.sortField;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    const response = await get<WithdrawalsResponse>(
      "/api/admin/finance/withdrawals",
      Object.keys(searchParams).length > 0 ? searchParams : undefined,
      {
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
      },
    );

    if (response.status === 200 && "data" in response.payload) {
      return response.payload.data;
    }

    throw new Error(response.payload.message || "Failed to fetch withdrawals");
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    throw error;
  }
};
