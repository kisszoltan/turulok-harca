import numbro from "numbro";
import {
  DateArg,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  Locale,
} from "date-fns";
import { hu } from "date-fns/locale";
const locales: { [key: string]: Locale } = { hu };

export function normalizeString(input?: string) {
  return (
    input &&
    input
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // remove accents
      .toLowerCase()
  );
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const format = (
  value?: number | string | null,
  short = false,
): string => {
  try {
    return numbro(forcedNum(value)).format({
      average: short,
      thousandSeparated: true,
    });
  } catch {
    return "N/A";
  }
};

export const forcedNum = (value?: string | number | null): number =>
  !value ? 0 : typeof value === "string" ? Number.parseInt(value, 10) : value;

export const timeAgo = (
  value: DateArg<Date>,
  locale?: string,
  includeSeconds = true,
): string =>
  formatDistanceToNow(value, {
    locale: locales[locale ?? "enGB"],
    addSuffix: true,
    includeSeconds,
  });

export const timeRemaining = (
  to: Date,
  locale: string = "hu",
): { value: string; text: string } => {
  const from = new Date();

  if (to.getTime() <= from.getTime()) return { value: "0s", text: "0s" };

  const duration = intervalToDuration({ start: from, end: to });

  const formatTwoDigits = (num: number) => num.toString().padStart(2, "0");

  const formatted = formatDuration(duration, {
    locale: locales[locale] ?? hu,
    zero: true,
    format: ["days", "hours", "minutes", "seconds"],
  });

  return {
    value:
      formatTwoDigits(forcedNum(duration.days)) +
      ":" +
      formatTwoDigits(forcedNum(duration.hours)) +
      ":" +
      formatTwoDigits(forcedNum(duration.minutes)) +
      ":" +
      formatTwoDigits(forcedNum(duration.seconds)),
    text: formatted || "0s",
  };
};
