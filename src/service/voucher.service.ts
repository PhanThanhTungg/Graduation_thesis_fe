import { get, post, patch, del } from "@/lib/request";
import {
  VoucherType,
  CreateVoucherType,
  UpdateVoucherType,
} from "@/schema/voucher.schema";

type GetVouchersByCourseIdResponse = {
  message: string;
  data: {
    items: VoucherType[];
    total: number;
  };
};

export const getVouchersByCourseId = async (
  courseId: string,
): Promise<VoucherType[]> => {
  const response = await get<GetVouchersByCourseIdResponse>(
    `/api/voucher/course/${courseId}`,
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as GetVouchersByCourseIdResponse).data.items;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get vouchers",
    );
  }
};

type GetVoucherByIdResponse = {
  message: string;
  data: VoucherType;
};

export const getVoucherById = async (id: string): Promise<VoucherType> => {
  const response = await get<GetVoucherByIdResponse>(
    `/api/voucher/${id}`,
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as GetVoucherByIdResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get voucher",
    );
  }
};

type GetMyVouchersResponse = {
  message: string;
  data: {
    items: VoucherType[];
    total: number;
  };
};

export const getMyVouchers = async (): Promise<VoucherType[]> => {
  const response = await get<GetMyVouchersResponse>(
    "/api/voucher/teacher-area/my-vouchers",
    undefined,
  );

  if (response.status === 200) {
    return (response.payload as GetMyVouchersResponse).data.items;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to get my vouchers",
    );
  }
};

type CreateVoucherResponse = {
  message: string;
  data: VoucherType;
};

export const createVoucher = async (
  data: CreateVoucherType,
): Promise<VoucherType> => {
  const response = await post<CreateVoucherResponse>(
    "/api/voucher/teacher-area",
    data,
  );

  if (response.status === 200 || response.status === 201) {
    return (response.payload as CreateVoucherResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to create voucher",
    );
  }
};

type UpdateVoucherResponse = {
  message: string;
  data: VoucherType;
};

export const updateVoucher = async (
  id: string,
  data: UpdateVoucherType,
): Promise<VoucherType> => {
  const response = await patch<UpdateVoucherResponse>(
    `/api/voucher/teacher-area/${id}`,
    data,
  );

  if (response.status === 200) {
    return (response.payload as UpdateVoucherResponse).data;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to update voucher",
    );
  }
};

type DeleteVoucherResponse = {
  message: string;
};

export const deleteVoucher = async (id: string): Promise<void> => {
  const response = await del<DeleteVoucherResponse>(
    `/api/voucher/teacher-area/${id}`,
  );

  if (response.status === 200) {
    return;
  } else {
    throw new Error(
      "payload" in response.payload && "message" in response.payload
        ? response.payload.message
        : "Failed to delete voucher",
    );
  }
};

type ApplyVoucherResponse = {
  message: string;
  data: {
    isValid: boolean;
    discountType?: string;
    discountValue?: number;
    originalPrice?: number;
    finalPrice?: number;
    message?: string;
  };
};

export const applyVoucher = async (
  code: string,
  courseId: string,
): Promise<ApplyVoucherResponse["data"]> => {
  const response = await post<ApplyVoucherResponse>("/api/voucher/apply", {
    code,
    courseId,
  });

  if (response.status === 200 || response.status === 201) {
    return (response.payload as ApplyVoucherResponse).data;
  } else {
    throw new Error(
      response?.payload?.message
        ? response.payload.message
        : "Failed to apply voucher",
    );
  }
};
