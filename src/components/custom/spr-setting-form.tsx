"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { SprSettingType } from "@/schema/spr-setting.schema";
import {
  convertToSeconds,
  convertFromSeconds,
  getDefaultUnit,
  TimeUnit,
  TIME_UNITS,
} from "@/lib/time-converter";

const SPR_BOT_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "discord", label: "Discord" },
  { value: "chrome_extension", label: "Chrome Extension" },
] as const;

const AI_MODEL_OPTIONS = [
  { value: "gemini", label: "GEMINI" },
  { value: "groq", label: "GROQ" },
] as const;

interface SprSettingFormProps {
  settings: SprSettingType;
  onSave: (
    data: Partial<Pick<SprSettingType, "sprBot" | "sprModel" | "sprInterval">>,
  ) => Promise<SprSettingType>;
  isSaving: boolean;
}

export function SprSettingForm({
  settings,
  onSave,
  isSaving,
}: SprSettingFormProps) {
  const [formData, setFormData] = useState({
    sprBot: settings.sprBot,
    sprModel: settings.sprModel,
  });
  const [intervalUnit, setIntervalUnit] = useState<TimeUnit>(() =>
    getDefaultUnit(settings.sprInterval),
  );
  const [intervalValue, setIntervalValue] = useState<string>(() => {
    const unit = getDefaultUnit(settings.sprInterval);
    return convertFromSeconds(settings.sprInterval, unit).toString();
  });

  const hasChanges = useMemo(() => {
    const newIntervalInSeconds = parseFloat(intervalValue)
      ? convertToSeconds(parseFloat(intervalValue), intervalUnit)
      : settings.sprInterval;

    return (
      formData.sprBot !== settings.sprBot ||
      formData.sprModel !== settings.sprModel ||
      newIntervalInSeconds !== settings.sprInterval
    );
  }, [formData, intervalValue, intervalUnit, settings]);

  const handleUnitChange = (newUnit: TimeUnit) => {
    const currentValue = parseFloat(intervalValue);
    if (!isNaN(currentValue)) {
      const currentInSeconds = convertToSeconds(currentValue, intervalUnit);
      const newValue = convertFromSeconds(currentInSeconds, newUnit);
      setIntervalValue(newValue.toString());
    }
    setIntervalUnit(newUnit);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: Partial<
      Pick<SprSettingType, "sprBot" | "sprModel" | "sprInterval">
    > = {};

    if (formData.sprBot !== settings.sprBot) {
      updateData.sprBot = formData.sprBot;
    }
    if (formData.sprModel !== settings.sprModel) {
      updateData.sprModel = formData.sprModel;
    }

    const newIntervalValue = parseFloat(intervalValue);
    if (!isNaN(newIntervalValue)) {
      const newIntervalInSeconds = convertToSeconds(
        newIntervalValue,
        intervalUnit,
      );
      if (newIntervalInSeconds !== settings.sprInterval) {
        updateData.sprInterval = newIntervalInSeconds;
      }
    }

    if (Object.keys(updateData).length === 0) return;

    const updatedSettings = await onSave(updateData);

    const defaultUnit = getDefaultUnit(updatedSettings.sprInterval);
    setIntervalUnit(defaultUnit);
    setIntervalValue(
      convertFromSeconds(updatedSettings.sprInterval, defaultUnit).toString(),
    );
    setFormData({
      sprBot: updatedSettings.sprBot,
      sprModel: updatedSettings.sprModel,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Telegram ID
          </Label>
          <p className="text-base mt-1">
            {settings.telegramId || "Not connected"}
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Discord ID
          </Label>
          <p className="text-base mt-1">
            {settings.discordId || "Not connected"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sprBot">SPR Bot</Label>
          <Select
            value={formData.sprBot}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                sprBot: value as SprSettingType["sprBot"],
              })
            }
          >
            <SelectTrigger id="sprBot" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPR_BOT_OPTIONS.map((bot) => (
                <SelectItem key={bot.value} value={bot.value}>
                  {bot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sprModel">AI Model</Label>
          <Select
            value={formData.sprModel}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                sprModel: value as SprSettingType["sprModel"],
              })
            }
          >
            <SelectTrigger id="sprModel" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODEL_OPTIONS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sprInterval">Review Interval</Label>
          <div className="flex gap-2">
            <Input
              id="sprInterval"
              type="number"
              min="0.01"
              step="0.01"
              value={intervalValue}
              onChange={(e) => setIntervalValue(e.target.value)}
              className="flex-1"
            />
            <Select value={intervalUnit} onValueChange={handleUnitChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
