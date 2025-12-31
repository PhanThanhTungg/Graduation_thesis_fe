import { Textarea } from "@/components/ui/textarea";
import {
  TypeQuestion,
  type GeneratedQuestion,
  type QuestionOption,
} from "@/service/question.service";
import { OptionItem } from "./option-item";

interface QuizOptionsProps {
  question: GeneratedQuestion;
  selectedAnswer: string;
  selectedAnswers: string[];
  textAnswer: string;
  disabled: boolean;
  onSelectSingle: (answer: string) => void;
  onToggleMultiple: (answer: string) => void;
  onTextChange: (value: string) => void;
}

export function QuizOptions({
  question,
  selectedAnswer,
  selectedAnswers,
  textAnswer,
  disabled,
  onSelectSingle,
  onToggleMultiple,
  onTextChange,
}: QuizOptionsProps) {
  const isSingleChoice = question.type === TypeQuestion.SINGLE_CHOICE;
  const isMultipleChoice = question.type === TypeQuestion.MULTIPLE_CHOICE;
  const isTrueFalse = question.type === TypeQuestion.TRUE_FALSE;
  const isTextQuestion =
    question.type === TypeQuestion.SHORT_ANSWER ||
    question.type === TypeQuestion.FILL_IN_THE_BLANK;

  const renderChoiceOptions = (
    options: QuestionOption[],
    isMultiple: boolean,
  ) =>
    options.map((opt) => (
      <OptionItem
        key={opt.name}
        label={`${opt.name}. ${opt.text}`}
        selected={
          isMultiple
            ? selectedAnswers.includes(opt.name)
            : selectedAnswer === opt.name
        }
        disabled={disabled}
        onClick={() =>
          isMultiple ? onToggleMultiple(opt.name) : onSelectSingle(opt.name)
        }
        isCheckbox={isMultiple}
      />
    ));

  return (
    <div className="space-y-3">
      {isSingleChoice && renderChoiceOptions(question.options, false)}

      {isMultipleChoice && renderChoiceOptions(question.options, true)}

      {isTrueFalse && (
        <>
          <OptionItem
            label="True"
            selected={selectedAnswer === "True"}
            disabled={disabled}
            onClick={() => onSelectSingle("True")}
          />
          <OptionItem
            label="False"
            selected={selectedAnswer === "False"}
            disabled={disabled}
            onClick={() => onSelectSingle("False")}
          />
        </>
      )}

      {isTextQuestion && (
        <Textarea
          placeholder="Your answer..."
          className="min-h-32"
          value={textAnswer}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
}
