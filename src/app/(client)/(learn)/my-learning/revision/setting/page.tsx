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
import { Home, Settings, Bot, CheckCircle2 } from "lucide-react";
import { getSprSettings, updateSprSettings } from "@/service/setting.service";
import { SprSettingType } from "@/schema/spr-setting.schema";
import { showToast } from "@/lib/toast";
import { SprSettingForm } from "@/components/custom/spr-setting-form";
import { getMyProfile } from "@/service/user.service";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function RevisionSettingPage() {
  const [settings, setSettings] = useState<SprSettingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [settingsData, userData] = await Promise.all([
          getSprSettings(),
          getMyProfile(),
        ]);
        setSettings(settingsData);
        if (userData) {
          setUserId(userData.id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (
    updateData: Partial<
      Pick<SprSettingType, "sprBot" | "sprModel" | "sprInterval" | "enabledSpr">
    >,
  ): Promise<SprSettingType> => {
    const updatedSettings = await updateSprSettings(updateData);
    setSettings(updatedSettings);
    showToast("success", "Settings updated successfully");
    return updatedSettings;
  };

  const handleToggleEnabledSpr = async (checked: boolean) => {
    try {
      setIsSaving(true);
      const updatedSettings = await updateSprSettings({ enabledSpr: checked });
      setSettings(updatedSettings);
      showToast("success", "Settings updated successfully");
    } catch (err) {
      console.error("Error updating enabledSpr:", err);
      showToast("error", "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
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
        <>
          <Card className="mb-6">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                Spaced Repetition Settings
              </CardTitle>
              <div className="absolute top-4 right-4">
                <Switch
                  checked={settings.enabledSpr}
                  onCheckedChange={handleToggleEnabledSpr}
                  disabled={isSaving}
                />
              </div>
            </CardHeader>
            <CardContent>
              <SprSettingForm
                settings={settings}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5" />
                Connected Bot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.telegramId ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-foreground border border-green/20">
                    <CheckCircle2 className="size-5 text-green shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-green">
                        Connected to Telegram
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your Telegram bot is connected and ready to send
                        reminders
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Connect your Telegram bot to receive spaced repetition
                      reminders and notifications.
                    </p>
                    {userId && process.env.NEXT_PUBLIC_BOT_TELE_NAME ? (
                      <Button asChild>
                        <Link
                          href={`https://t.me/${process.env.NEXT_PUBLIC_BOT_TELE_NAME}?start=${userId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Connect to Telegram Bot
                        </Link>
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Unable to generate bot connection link. Please try again
                        later.
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
