import { get, patch } from "@/lib/request";
import {
  AdminSettingType,
  UpdateAdminSettingType,
} from "@/schema/admin-setting.schema";

export const getAdminSettings = async (): Promise<AdminSettingType> => {
  const response = await get<{ data: AdminSettingType }>(
    "/api/admin/setting",
    undefined,
    {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  if (response.status === 200) {
    const payload = response.payload as { data: AdminSettingType };
    return payload.data;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to fetch admin settings";

  throw new Error(errorMessage);
};

export const updateAdminSettings = async (
  data: UpdateAdminSettingType,
): Promise<AdminSettingType> => {
  const response = await patch<{ data: AdminSettingType }>(
    "/api/admin/setting",
    data,
    {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  );

  if (response.status === 200) {
    const payload = response.payload as { data: AdminSettingType };
    return payload.data;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to update admin settings";

  throw new Error(errorMessage);
};
