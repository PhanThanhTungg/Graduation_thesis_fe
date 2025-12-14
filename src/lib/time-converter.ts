export type TimeUnit = "seconds" | "minutes" | "hours" | "days";

export interface LearningStep {
  value: number;
  unit: TimeUnit;
}

export const TIME_UNITS: { value: TimeUnit; label: string }[] = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
];

export const convertToSeconds = (value: number, unit: TimeUnit): number => {
  switch (unit) {
    case "seconds":
      return value;
    case "minutes":
      return value * 60;
    case "hours":
      return value * 60 * 60;
    case "days":
      return value * 24 * 60 * 60;
    default:
      return value;
  }
};

export const convertFromSeconds = (seconds: number, unit: TimeUnit): number => {
  switch (unit) {
    case "seconds":
      return seconds;
    case "minutes":
      return seconds / 60;
    case "hours":
      return seconds / (60 * 60);
    case "days":
      return seconds / (24 * 60 * 60);
    default:
      return seconds;
  }
};

export const getDefaultUnit = (seconds: number): TimeUnit => {
  if (seconds >= 86400 && seconds % 86400 === 0) return "days";
  if (seconds >= 3600 && seconds % 3600 === 0) return "hours";
  if (seconds >= 60 && seconds % 60 === 0) return "minutes";
  return "seconds";
};

export const convertToMinutes = (value: number, unit: TimeUnit): number => {
  switch (unit) {
    case "seconds":
      return value / 60;
    case "minutes":
      return value;
    case "hours":
      return value * 60;
    case "days":
      return value * 24 * 60;
    default:
      return value;
  }
};

export const convertFromMinutes = (
  minutes: number,
): { value: number; unit: TimeUnit } => {
  if (minutes < 60) {
    return { value: minutes, unit: "minutes" };
  } else if (minutes < 24 * 60) {
    return { value: minutes / 60, unit: "hours" };
  } else {
    return { value: minutes / (24 * 60), unit: "days" };
  }
};

export const convertBetweenUnits = (
  value: number,
  fromUnit: TimeUnit,
  toUnit: TimeUnit,
): number => {
  if (fromUnit === toUnit) return value;

  const minutes = convertToMinutes(value, fromUnit);

  switch (toUnit) {
    case "seconds":
      return minutes * 60;
    case "minutes":
      return minutes;
    case "hours":
      return minutes / 60;
    case "days":
      return minutes / (24 * 60);
    default:
      return minutes;
  }
};
