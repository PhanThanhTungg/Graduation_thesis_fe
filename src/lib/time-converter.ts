export type TimeUnit = "seconds" | "minutes" | "hours" | "days";

const TIME_UNIT_MULTIPLIERS: Record<TimeUnit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
};

export const convertToSeconds = (value: number, unit: TimeUnit): number => {
  return value * TIME_UNIT_MULTIPLIERS[unit];
};

export const convertFromSeconds = (seconds: number, unit: TimeUnit): number => {
  return seconds / TIME_UNIT_MULTIPLIERS[unit];
};

export const getDefaultUnit = (seconds: number): TimeUnit => {
  if (seconds >= 86400 && seconds % 86400 === 0) return "days";
  if (seconds >= 3600 && seconds % 3600 === 0) return "hours";
  if (seconds >= 60 && seconds % 60 === 0) return "minutes";
  return "seconds";
};

export const TIME_UNITS: { value: TimeUnit; label: string }[] = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
];
