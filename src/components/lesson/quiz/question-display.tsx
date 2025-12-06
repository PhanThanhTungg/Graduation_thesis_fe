import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import {
  TypeQuestion,
  QUESTION_TYPE_LABELS,
  type GeneratedQuestion,
} from "@/service/question.service";
import { OptionItem } from "./option-item";

interface QuestionDisplayProps {
  question: GeneratedQuestion;
  onReset: () => void;
}

export function QuestionDisplay({ question, onReset }: QuestionDisplayProps) {
  const isChoiceQuestion =
    question.type === TypeQuestion.SINGLE_CHOICE ||
    question.type === TypeQuestion.MULTIPLE_CHOICE;
  const isTrueFalse = question.type === TypeQuestion.TRUE_FALSE;
  const isTextQuestion =
    question.type === TypeQuestion.SHORT_ANSWER ||
    question.type === TypeQuestion.FILL_IN_THE_BLANK;

  return (
    <div className="px-6 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Generated Question</h2>
            <p className="text-muted-foreground">
              {QUESTION_TYPE_LABELS[question.type]}
            </p>
          </div>
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>

        {/* Question Card */}
        <Card className="p-6">
          <div className="mb-6">
            {/* Question Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center font-semibold">
                Q
              </div>
              <p className="text-lg font-semibold flex-1">
                {question.statement}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {isChoiceQuestion &&
                question.options.map((opt) => (
                  <OptionItem
                    key={opt.name}
                    label={`${opt.name}. ${opt.text}`}
                  />
                ))}

              {isTrueFalse && (
                <>
                  <OptionItem label="True" />
                  <OptionItem label="False" />
                </>
              )}

              {isTextQuestion && (
                <Textarea
                  placeholder="Your answer..."
                  className="min-h-32"
                  disabled
                />
              )}
            </div>
          </div>

          {/* Explanation */}
          {question.aiExplanation && (
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="font-semibold mb-2 text-sm">Explanation</p>
              <p className="text-sm text-muted-foreground">
                {question.aiExplanation}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
