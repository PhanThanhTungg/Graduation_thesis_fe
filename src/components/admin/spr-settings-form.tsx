"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateAdminSettingType } from "@/schema/admin-setting.schema";
import { UseFormReturn } from "react-hook-form";
import { LearningStepsField } from "./learning-steps-field";
import { LearningStep, convertToMinutes } from "@/lib/time-converter";
import { IntervalField } from "./interval-field";
import { TimeUnit } from "@/lib/time-converter";

interface SprSettingsFormProps {
  form: UseFormReturn<UpdateAdminSettingType>;
  learningSteps: LearningStep[];
  onLearningStepsChange: (steps: LearningStep[]) => void;
  iniInterval: { value: number; unit: TimeUnit };
  onIniIntervalChange: (value: number, unit: TimeUnit) => void;
  iniEasyInterval: { value: number; unit: TimeUnit };
  onIniEasyIntervalChange: (value: number, unit: TimeUnit) => void;
}

export function SprSettingsForm({
  form,
  learningSteps,
  onLearningStepsChange,
  iniInterval,
  onIniIntervalChange,
  iniEasyInterval,
  onIniEasyIntervalChange,
}: SprSettingsFormProps) {
  const updateLearningStepsInForm = (steps: LearningStep[]) => {
    const stepsInMinutes = steps.map((step) =>
      convertToMinutes(step.value, step.unit),
    );
    form.setValue("learningSteps", stepsInMinutes, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="learningSteps"
        render={() => (
          <LearningStepsField
            learningSteps={learningSteps}
            onStepsChange={onLearningStepsChange}
            onFormUpdate={updateLearningStepsInForm}
          />
        )}
      />

      <FormField
        control={form.control}
        name="lastStepFromLearningToReview"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Step From Learning To Review</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="Enter last step"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <IntervalField
        form={form}
        name="iniInterval"
        label="Initial Interval"
        value={iniInterval.value}
        unit={iniInterval.unit}
        onValueChange={(value) => onIniIntervalChange(value, iniInterval.unit)}
        onUnitChange={(unit) => onIniIntervalChange(iniInterval.value, unit)}
        onChange={onIniIntervalChange}
      />

      <IntervalField
        form={form}
        name="iniEasyInterval"
        label="Initial Easy Interval"
        value={iniEasyInterval.value}
        unit={iniEasyInterval.unit}
        onValueChange={(value) =>
          onIniEasyIntervalChange(value, iniEasyInterval.unit)
        }
        onUnitChange={(unit) =>
          onIniEasyIntervalChange(iniEasyInterval.value, unit)
        }
        onChange={onIniEasyIntervalChange}
      />

      <FormField
        control={form.control}
        name="leechThreshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leech Threshold</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="Enter leech threshold"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
