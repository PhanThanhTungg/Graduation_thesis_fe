import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/lesson/quiz/form-select";
import { TypeQuestion, QUESTION_TYPE_LABELS } from "@/enums/question.enum";
import { Difficulty, DIFFICULTY_LABELS } from "@/enums/question.enum";
import { Loader2 } from "lucide-react";

interface SettingCardProps {
  noteValue: string;
  difficulty: string;
  typeQues: string;
  isUpdating: boolean;
  hasChanges: boolean;
  onNoteChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onTypeQuesChange: (value: string) => void;
  onSave: () => void;
}

export function SettingCard({
  noteValue,
  difficulty,
  typeQues,
  isUpdating,
  hasChanges,
  onNoteChange,
  onDifficultyChange,
  onTypeQuesChange,
  onSave,
}: SettingCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Setting</CardTitle>
          {hasChanges && (
            <Button onClick={onSave} disabled={isUpdating} size="sm">
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row gap-6">
          <FormSelect
            label="Difficulty"
            value={difficulty}
            onChange={onDifficultyChange}
            disabled={isUpdating}
            options={Object.values(Difficulty)
              .filter((d) => d !== Difficulty.VERY_HARD)
              .map((level) => ({
                value: level,
                label: DIFFICULTY_LABELS[level],
              }))}
          />

          <FormSelect
            label="Question Type"
            value={typeQues}
            onChange={onTypeQuesChange}
            disabled={isUpdating}
            options={Object.values(TypeQuestion).map((type) => ({
              value: type,
              label: QUESTION_TYPE_LABELS[type],
            }))}
          />
        </div>

        <Textarea
          value={noteValue}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a note for this lesson..."
          className="min-h-32"
          disabled={isUpdating}
        />
      </CardContent>
    </Card>
  );
}
