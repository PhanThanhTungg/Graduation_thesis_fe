import { z } from "zod";

export const SprBotEnum = z.enum(["telegram", "discord", "chrome_extension"]);
export const AiModelEnum = z.enum(["gemini", "groq"]);

export const SprSettingSchema = z.object({
  telegramId: z.string().nullable(),
  discordId: z.string().nullable(),
  sprBot: SprBotEnum,
  sprModel: AiModelEnum,
  sprInterval: z.number(),
});

export type SprSettingType = z.infer<typeof SprSettingSchema>;
