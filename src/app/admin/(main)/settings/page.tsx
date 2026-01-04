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
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const { hasPermission, isLoading: isCheckingPermission } =
    useAdminPermissions();
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

  const hasAccess = hasPermission("setting", "view");

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
      if (!hasAccess) return;

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

    if (!isCheckingPermission && hasAccess) {
      fetchSettings();
    } else if (!isCheckingPermission && !hasAccess) {
      setIsLoading(false);
    }
  }, [form, isCheckingPermission, hasAccess]);

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

  if (isCheckingPermission || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">
            You do not have permission to view this content.
          </p>
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
