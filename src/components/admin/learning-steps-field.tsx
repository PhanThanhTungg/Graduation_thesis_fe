"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import {
  LearningStep,
  TimeUnit,
  convertBetweenUnits,
} from "@/lib/time-converter";

interface LearningStepsFieldProps {
  learningSteps: LearningStep[];
  onStepsChange: (steps: LearningStep[]) => void;
  onFormUpdate: (steps: LearningStep[]) => void;
}

export function LearningStepsField({
  learningSteps,
  onStepsChange,
  onFormUpdate,
}: LearningStepsFieldProps) {
  const updateLearningStep = (
    index: number,
    field: "value" | "unit",
    newValue: number | TimeUnit,
  ) => {
    const newSteps = [...learningSteps];
    const currentStep = newSteps[index];

    if (field === "unit") {
      const newUnit = newValue as TimeUnit;
      if (currentStep.unit !== newUnit) {
        const convertedValue = convertBetweenUnits(
          currentStep.value,
          currentStep.unit,
          newUnit,
        );
        newSteps[index] = {
          value: convertedValue,
          unit: newUnit,
        };
      }
    } else {
      const newValueNumber = newValue as number;
      newSteps[index] = {
        ...currentStep,
        value: newValueNumber,
      };
    }

    onStepsChange(newSteps);
    onFormUpdate(newSteps);
  };

  const addLearningStep = () => {
    const newSteps = [
      ...learningSteps,
      { value: 0, unit: "minutes" as TimeUnit },
    ];
    onStepsChange(newSteps);
    onFormUpdate(newSteps);
  };

  const removeLearningStep = (index: number) => {
    if (learningSteps.length <= 1) return;
    const newSteps = learningSteps.filter((_, i) => i !== index);
    onStepsChange(newSteps);
    onFormUpdate(newSteps);
  };

  const canAddStep = () => {
    if (learningSteps.length === 0) return true;
    const lastStep = learningSteps[learningSteps.length - 1];
    return lastStep.value > 0;
  };

  return (
    <FormItem>
      <FormLabel>Learning Steps</FormLabel>
      <div className="space-y-2">
        {learningSteps.map((step, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex items-center justify-center w-8 h-9 rounded-md bg-muted text-sm font-medium shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter time value"
                value={step.value || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  updateLearningStep(index, "value", value);
                }}
                className="flex-1"
              />
              <Select
                value={step.unit}
                onValueChange={(value: TimeUnit) => {
                  updateLearningStep(index, "unit", value);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeLearningStep(index)}
              disabled={learningSteps.length <= 1}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLearningStep}
          disabled={!canAddStep()}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
}
