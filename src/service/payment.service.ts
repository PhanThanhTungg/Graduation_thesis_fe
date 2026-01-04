import { get, post } from "@/lib/request";

type CreatePaypalOrderResponse = {
  message: string;
  data: {
    orderId: string;
    orderCode: string;
    paypalOrderId?: string;
    approvalUrl?: string;
    finalPrice: number;
    discountAmount: number;
  };
};

type CapturePaypalOrderResponse = {
  message: string;
  data: {
    orderId: string;
    orderCode: string;
    paymentId?: string;
    status: string;
  };
};

type CreateOrderPayload = {
  courseId: string;
  voucherCode?: string;
};

export const createPaypalOrder = async (payload: CreateOrderPayload) => {
  const response = await post<CreatePaypalOrderResponse>(
    "/api/payment/client/orders",
    payload,
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreatePaypalOrderResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to create PayPal order",
  );
};

export const capturePaypalOrder = async (
  orderId: string,
  paypalOrderId: string,
) => {
  const response = await post<CapturePaypalOrderResponse>(
    `/api/payment/client/orders/${orderId}/capture`,
    {
      paypalOrderId,
    },
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CapturePaypalOrderResponse).data;
  }

  throw new Error(
    "payload" in response.payload && "message" in response.payload
      ? response.payload.message
      : "Failed to capture payment",
  );
};

type CheckPurchaseResponse = {
  message: string;
  data: {
    hasPurchased: boolean;
    orderId: string | null;
  };
};

export const checkPurchase = async (courseId: string) => {
  const response = await get<CheckPurchaseResponse>(
    "/api/payment/client/check-purchase",
    { courseId },
  );
  console.log("response", response);
  if (response.status === 200) {
    return (response.payload as CheckPurchaseResponse).data;
  }

  return {
    hasPurchased: false,
    orderId: null,
  };
};
