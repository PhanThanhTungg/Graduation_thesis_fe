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
  const [difficultyValue, setDifficultyValue] = useState<string>("");
  const [typeQuesValue, setTypeQuesValue] = useState<string>("");

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        setIsLoading(true);
        const data = await getLessonReviewSettingByLessonId(lessonId);
        setSetting(data);
        setNoteValue(data.note || "");
        setDifficultyValue(data.difficulty);
        setTypeQuesValue(data.typeQues);
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

  const hasChanges = () => {
    if (!setting) return false;
    return (
      noteValue !== (setting.note || "") ||
      difficultyValue !== setting.difficulty ||
      typeQuesValue !== setting.typeQues
    );
  };

  const handleSaveSettings = async () => {
    if (!setting || !hasChanges()) return;
    try {
      setIsUpdating(true);
      const updateData: {
        note?: string;
        difficulty?: string;
        typeQues?: string;
      } = {};

      if (noteValue !== (setting.note || "")) {
        updateData.note = noteValue || undefined;
      }
      if (difficultyValue !== setting.difficulty) {
        updateData.difficulty = difficultyValue;
      }
      if (typeQuesValue !== setting.typeQues) {
        updateData.typeQues = typeQuesValue;
      }

      const updated = await updateLessonReviewSetting(lessonId, updateData);
      setSetting(updated);
      setNoteValue(updated.note || "");
      setDifficultyValue(updated.difficulty);
      setTypeQuesValue(updated.typeQues);
      showToast("success", "Settings updated successfully");
    } catch (err) {
      console.error("Error updating settings:", err);
      showToast("error", "Failed to update settings");
      setNoteValue(setting.note || "");
      setDifficultyValue(setting.difficulty);
      setTypeQuesValue(setting.typeQues);
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
    difficultyValue,
    setDifficultyValue,
    typeQuesValue,
    setTypeQuesValue,
    handleToggleReviewEnabled,
    handleSaveSettings,
    hasChanges: hasChanges(),
  };
}
