import { isCronJob } from "../utils/manifest";
import { createRule } from "./types";

const macros = new Set([
  "@yearly",
  "@annually",
  "@monthly",
  "@weekly",
  "@daily",
  "@midnight",
  "@hourly"
]);

const weekdays = new Set(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]);

function isPartValid(part: string, min: number, max: number): boolean {
  if (part === "*") return true;

  if (part.includes(",")) {
    return part.split(",").every((p) => isPartValid(p, min, max));
  }

  if (part.includes("/")) {
    const parts = part.split("/");
    if (parts.length !== 2) return false;

    if (!isPartValid(parts[0], min, max)) return false;

    const interval = parseInt(parts[1], 10);

    return !isNaN(interval) && interval > 0 && interval <= max;
  }

  const range = part.split("-").map((n) => parseInt(n, 10));

  if (range.length > 2 || range.some((n) => n < min || n > max)) return false;
  if (range.length === 2 && range[0] > range[1]) return false;

  const value = parseInt(part, 10);
  return !isNaN(value) && value >= min && value <= max;
}

function isWeekdayValid(part: string): boolean {
  return isPartValid(part, 0, 6) || weekdays.has(part.toLowerCase());
}

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        if (!isCronJob(manifest)) return;

        const schedule = manifest.data.spec?.schedule;

        if (!schedule) {
          ctx.report(manifest, "Schedule must not be empty");
          return;
        }

        if (macros.has(schedule)) return;

        const parts = schedule.split(" ");

        if (parts.length !== 5) {
          ctx.report(manifest, "Schedule must have 5 parts");
          return;
        }

        if (!isPartValid(parts[0], 0, 59)) {
          ctx.report(manifest, "Minute part is invalid");
        }

        if (!isPartValid(parts[1], 0, 23)) {
          ctx.report(manifest, "Hour part is invalid");
        }

        if (!isPartValid(parts[2], 1, 31)) {
          ctx.report(manifest, "Day of month part is invalid");
        }

        if (!isPartValid(parts[3], 1, 12)) {
          ctx.report(manifest, "Month part is invalid");
        }

        if (!isWeekdayValid(parts[4])) {
          ctx.report(manifest, "Day of week part is invalid");
        }
      }
    };
  }
});
