import { useEffect, useState } from "react";
import {
  getLessonReviewSettingByLessonId,
  updateLessonReviewSetting,
} from "@/service/review-space.service";
import { LessonReviewSettingType } from "@/schema/review-space.schema";
import { showToast } from "@/lib/toast";

export function useLessonReviewSetting(lessonId: string) {
  const [setting, setSetting] = useState<LessonReviewSettingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteValue, setNoteValue] = useState<string>("");

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setIsLoading(true);
        const data = await getLessonReviewSettingByLessonId(lessonId);
        setSetting(data);
        setNoteValue(data.note || "");
      } catch (err) {
        console.error("Error fetching lesson review setting:", err);
        setError("Failed to load lesson review setting");
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) {
      fetchSetting();
    }
  }, [lessonId]);

  const handleToggleReviewEnabled = async (checked: boolean) => {
    if (!setting) return;
    try {
      setIsUpdating(true);
      const updated = await updateLessonReviewSetting(lessonId, {
        reviewEnabled: checked,
      });
      setSetting(updated);
      showToast("success", "Review enabled updated successfully");
    } catch (err) {
      console.error("Error updating review enabled:", err);
      showToast("error", "Failed to update review enabled");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNoteBlur = async () => {
    if (!setting) return;
    if (noteValue === (setting.note || "")) return;
    try {
      setIsUpdating(true);
      const updated = await updateLessonReviewSetting(lessonId, {
        note: noteValue || undefined,
      });
      setSetting(updated);
      showToast("success", "Note updated successfully");
    } catch (err) {
      console.error("Error updating note:", err);
      showToast("error", "Failed to update note");
      setNoteValue(setting.note || "");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    setting,
    isLoading,
    error,
    isUpdating,
    noteValue,
    setNoteValue,
    handleToggleReviewEnabled,
    handleNoteBlur,
  };
}
