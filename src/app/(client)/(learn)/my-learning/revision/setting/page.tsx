"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Settings } from "lucide-react";
import { getSprSettings, updateSprSettings } from "@/service/setting.service";
import { SprSettingType } from "@/schema/spr-setting.schema";
import { showToast } from "@/lib/toast";
import { SprSettingForm } from "@/components/custom/spr-setting-form";

export default function RevisionSettingPage() {
  const [settings, setSettings] = useState<SprSettingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getSprSettings();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching SPR settings:", err);
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (
    updateData: Partial<
      Pick<SprSettingType, "sprBot" | "sprModel" | "sprInterval">
    >,
  ): Promise<SprSettingType> => {
    const updatedSettings = await updateSprSettings(updateData);
    setSettings(updatedSettings);
    showToast("success", "Settings updated successfully");
    return updatedSettings;
  };

  return (
    <div className="py-8 container-sm">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/courses">
              My Learning
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/my-learning/revision">
              Revision
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revision Settings</h1>
        <p className="text-muted-foreground">
          Configure your spaced repetition learning preferences
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading settings...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : settings ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Spaced Repetition Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SprSettingForm
              settings={settings}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
