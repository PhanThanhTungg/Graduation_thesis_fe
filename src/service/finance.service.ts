import { get, post } from "@/lib/request";

type WalletResponse = {
  message: string;
  data: {
    id: string;
    userId: string;
    balance: number;
    totalDeposited: number;
    totalWithdrawn: number;
    totalEarned: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string | null;
  };
};

type TransactionResponse = {
  message: string;
  data: {
    transactions: {
      id: string;
      walletId: string;
      type: "deposit" | "withdrawal";
      amount: number;
      balanceBefore: number;
      balanceAfter: number;
      status: "pending" | "processing" | "completed" | "cancelled";
      description: string | null;
      referenceId: string | null;
      metadata: Record<string, unknown> | null;
      createdAt: string;
      updatedAt: string | null;
    }[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type WithdrawalResponse = {
  message: string;
  data: {
    withdrawals: {
      id: string;
      walletId: string;
      amount: number;
      status: "pending" | "processing" | "completed" | "cancelled";
      bankName: string | null;
      bankAccount: string | null;
      bankAccountName: string | null;
      note: string | null;
      rejectionReason: string | null;
      processedBy: string | null;
      processedAt: string | null;
      createdAt: string;
      updatedAt: string | null;
    }[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

type OrderResponse = {
  message: string;
  data: {
    orders: {
      id: string;
      Order_id: string;
      userId: string;
      courseId: string;
      discountAmount: number;
      finalPrice: number;
      status: "processing" | "success" | "cancelled";
      paymentMethod: "paypal";
      createdAt: string;
      completedAt: string | null;
      user: {
        id: string;
        fullName: string;
        email: string;
      };
      course: {
        id: string;
        title: string;
        slug: string;
      };
    }[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export const getWallet = async () => {
  const response = await get<WalletResponse>(
    "/api/finance/client/wallet",
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as WalletResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get wallet",
  );
};

export const getTransactions = async (params?: {
  page?: number;
  limit?: number;
  type?: "deposit" | "withdrawal";
  status?: "pending" | "processing" | "completed" | "cancelled";
}) => {
  const response = await get<TransactionResponse>(
    "/api/finance/client/transactions",
    params,
  );

  if (response.status === 200) {
    return (response.payload as TransactionResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get transactions",
  );
};

export const getWithdrawals = async (params?: {
  page?: number;
  limit?: number;
  status?: "pending" | "processing" | "completed" | "cancelled";
}) => {
  const response = await get<WithdrawalResponse>(
    "/api/finance/client/withdrawals",
    params,
  );

  if (response.status === 200) {
    return (response.payload as WithdrawalResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get withdrawals",
  );
};

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: "processing" | "success" | "cancelled";
  courseId?: string;
  sortField?: "finalPrice" | "createdAt";
  sortOrder?: "asc" | "desc";
}) => {
  const response = await get<OrderResponse>(
    "/api/finance/client/orders",
    params,
  );

  if (response.status === 200) {
    return (response.payload as OrderResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to get orders",
  );
};

type CreateWithdrawalResponse = {
  message: string;
  data: {
    id: string;
    walletId: string;
    amount: number;
    email: string;
    status: "pending" | "processing" | "completed" | "cancelled";
    note: string | null;
    createdAt: string;
  };
};

export const createWithdrawal = async (data: {
  amount: number;
  email: string;
  note?: string;
}) => {
  const response = await post<CreateWithdrawalResponse>(
    "/api/finance/client/withdrawals",
    data,
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateWithdrawalResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to create withdrawal request",
  );
};

type CreateDepositResponse = {
  message: string;
  data: {
    transactionId: string;
    approvalUrl: string;
    paypalOrderId: string;
  };
};

type CaptureDepositResponse = {
  message: string;
  data: {
    transactionId: string;
    captureId: string;
    amount: number;
  };
};

export const createDeposit = async (amount: number) => {
  const response = await post<CreateDepositResponse>(
    "/api/finance/client/deposit",
    { amount },
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateDepositResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to create deposit request",
  );
};

export const captureDeposit = async (
  transactionId: string,
  paypalOrderId: string,
) => {
  const response = await post<CaptureDepositResponse>(
    `/api/finance/client/deposit/${transactionId}/capture`,
    { paypalOrderId },
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CaptureDepositResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to capture deposit",
  );
};
