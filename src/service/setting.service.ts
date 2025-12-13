import { get, patch } from "@/lib/request";
import { SprSettingType } from "@/schema/spr-setting.schema";

export const getSprSettings = async (): Promise<SprSettingType> => {
  const response = await get<{ data: SprSettingType }>(
    "/api/setting/spr",
    undefined,
  );

  if (response.status === 200) {
    const payload = response.payload as { data: SprSettingType };
    return payload.data;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to fetch SPR settings";

  throw new Error(errorMessage);
};

export const updateSprSettings = async (
  data: Partial<Pick<SprSettingType, "sprBot" | "sprModel" | "sprInterval">>,
): Promise<SprSettingType> => {
  const response = await patch<{ data: SprSettingType }>(
    "/api/setting/spr",
    data,
  );

  if (response.status === 200) {
    const payload = response.payload as { data: SprSettingType };
    return payload.data;
  }

  const errorMessage =
    typeof response.payload === "object" &&
    response.payload !== null &&
    "message" in response.payload &&
    typeof response.payload.message === "string"
      ? response.payload.message
      : "Failed to update SPR settings";

  throw new Error(errorMessage);
};
