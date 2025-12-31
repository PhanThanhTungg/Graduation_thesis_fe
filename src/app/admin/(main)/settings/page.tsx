"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  getAdminSettings,
  updateAdminSettings,
} from "@/service/admin/setting.service";
import {
  AdminSettingType,
  UpdateAdminSettingSchema,
  UpdateAdminSettingType,
} from "@/schema/admin-setting.schema";
import { showToast } from "@/lib/toast";
import {
  LearningStep,
  convertToSeconds,
  convertFromSecondsToObject,
  TimeUnit,
} from "@/lib/time-converter";
import { WebSettingsForm } from "@/components/admin/web-settings-form";
import { SprSettingsForm } from "@/components/admin/spr-settings-form";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [learningSteps, setLearningSteps] = useState<LearningStep[]>([]);
  const [iniInterval, setIniInterval] = useState<{
    value: number;
    unit: TimeUnit;
  }>({ value: 0, unit: "seconds" });
  const [iniEasyInterval, setIniEasyInterval] = useState<{
    value: number;
    unit: TimeUnit;
  }>({ value: 0, unit: "seconds" });

  const form = useForm<UpdateAdminSettingType>({
    resolver: zodResolver(UpdateAdminSettingSchema),
    defaultValues: {
      webTitle: "",
      webFavicon: "",
      webDescription: "",
      webKeywords: [],
      webAuthor: "",
      webCopyright: "",
      learningSteps: [],
      lastStepFromLearningToReview: 5,
      iniInterval: 120,
      iniEasyInterval: 240,
      leechThreshold: 8,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminSettings();
        setSettings(data);

        const learningStepsValue = data.learningSteps || [];
        const iniIntervalValue = data.iniInterval ?? 120;
        const iniEasyIntervalValue = data.iniEasyInterval ?? 240;

        const isInMinutes =
          (iniIntervalValue < 100 && iniIntervalValue > 0) ||
          (iniEasyIntervalValue < 1000 &&
            iniEasyIntervalValue > 0 &&
            iniIntervalValue < 100);

        const stepsInSeconds = learningStepsValue.map((value) =>
          isInMinutes && value < 1000 ? value * 60 : value,
        );
        const iniIntervalInSeconds = isInMinutes
          ? iniIntervalValue * 60
          : iniIntervalValue;
        const iniEasyIntervalInSeconds = isInMinutes
          ? iniEasyIntervalValue * 60
          : iniEasyIntervalValue;

        const convertedSteps = stepsInSeconds.map((seconds) =>
          convertFromSecondsToObject(seconds),
        );
        setLearningSteps(
          convertedSteps.length > 0
            ? convertedSteps
            : [{ value: 0, unit: "seconds" }],
        );

        const convertedIniInterval =
          convertFromSecondsToObject(iniIntervalInSeconds);
        const convertedIniEasyInterval = convertFromSecondsToObject(
          iniEasyIntervalInSeconds,
        );
        setIniInterval(convertedIniInterval);
        setIniEasyInterval(convertedIniEasyInterval);

        form.reset({
          webTitle: data.webTitle || "",
          webFavicon: data.webFavicon || "",
          webDescription: data.webDescription || "",
          webKeywords: data.webKeywords || [],
          webAuthor: data.webAuthor || "",
          webCopyright: data.webCopyright || "",
          learningSteps: stepsInSeconds,
          lastStepFromLearningToReview: data.lastStepFromLearningToReview || 5,
          iniInterval: iniIntervalInSeconds,
          iniEasyInterval: iniEasyIntervalInSeconds,
          leechThreshold: data.leechThreshold || 8,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
        showToast("error", "Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: UpdateAdminSettingType) => {
    try {
      setIsSaving(true);
      const stepsInSeconds = learningSteps.map((step) =>
        convertToSeconds(step.value, step.unit),
      );
      const iniIntervalInSeconds = convertToSeconds(
        iniInterval.value,
        iniInterval.unit,
      );
      const iniEasyIntervalInSeconds = convertToSeconds(
        iniEasyInterval.value,
        iniEasyInterval.unit,
      );

      const submitData = {
        ...data,
        learningSteps: stepsInSeconds,
        iniInterval: Math.round(iniIntervalInSeconds),
        iniEasyInterval: Math.round(iniEasyIntervalInSeconds),
      };
      const updatedSettings = await updateAdminSettings(submitData);
      setSettings(updatedSettings);

      const stepsInSecondsFromBackend = updatedSettings.learningSteps || [];
      const iniIntervalInSecondsFromBackend =
        updatedSettings.iniInterval || 120;
      const iniEasyIntervalInSecondsFromBackend =
        updatedSettings.iniEasyInterval || 240;

      const convertedSteps = stepsInSecondsFromBackend.map((seconds) =>
        convertFromSecondsToObject(seconds),
      );
      setLearningSteps(
        convertedSteps.length > 0
          ? convertedSteps
          : [{ value: 0, unit: "seconds" }],
      );

      const convertedIniInterval = convertFromSecondsToObject(
        iniIntervalInSecondsFromBackend,
      );
      const convertedIniEasyInterval = convertFromSecondsToObject(
        iniEasyIntervalInSecondsFromBackend,
      );
      setIniInterval(convertedIniInterval);
      setIniEasyInterval(convertedIniEasyInterval);

      showToast("success", "Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      showToast("error", "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage system-wide settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Web Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <WebSettingsForm form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SPR Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SprSettingsForm
                form={form}
                learningSteps={learningSteps}
                onLearningStepsChange={setLearningSteps}
                iniInterval={iniInterval}
                onIniIntervalChange={(value, unit) =>
                  setIniInterval({ value, unit })
                }
                iniEasyInterval={iniEasyInterval}
                onIniEasyIntervalChange={(value, unit) =>
                  setIniEasyInterval({ value, unit })
                }
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
