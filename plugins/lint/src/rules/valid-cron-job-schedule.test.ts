/// <reference types="jest-extended" />
import { CronJob } from "kubernetes-models/batch/v1/CronJob";
import { createManifest, validate } from "../test-utils";
import rule from "./valid-cron-job-schedule";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test.each([
  // Minute
  "* * * * *",
  "5 * * * *",
  "*/5 * * * *",
  "5-10 * * * *",
  "5,10 * * * *",
  // Hour
  "* 5 * * *",
  // Day
  "* * 5 * *",
  // Month
  "* * * 5 *",
  // Weekday
  "* * * * 5",
  "* * * * sun",
  "* * * * mon",
  "* * * * tue",
  "* * * * wed",
  "* * * * thu",
  "* * * * fri",
  "* * * * sat",
  "* * * * SUN",
  // Macro
  "@yearly",
  "@annually",
  "@monthly",
  "@weekly",
  "@daily",
  "@midnight",
  "@hourly"
])("should pass when schedule is %s", (schedule) => {
  const manifest = createManifest(
    new CronJob({
      metadata: { name: "test" },
      spec: { schedule, jobTemplate: {} }
    })
  );
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test.each([
  { schedule: "", message: "Schedule must not be empty" },
  { schedule: "* * * *", message: "Schedule must have 5 parts" },
  // Minute
  { schedule: "60 * * * *", message: "Minute part is invalid" },
  { schedule: "foo * * * *", message: "Minute part is invalid" },
  { schedule: "*/0 * * * *", message: "Minute part is invalid" },
  { schedule: "1,foo * * * *", message: "Minute part is invalid" },
  { schedule: "1/foo * * * *", message: "Minute part is invalid" },
  { schedule: "20-10 * * * *", message: "Minute part is invalid" },
  { schedule: "50-60 * * * *", message: "Minute part is invalid" },
  { schedule: "1/2/3 * * * *", message: "Minute part is invalid" },
  // Hour
  { schedule: "* 24 * * *", message: "Hour part is invalid" },
  { schedule: "* foo * * *", message: "Hour part is invalid" },
  // Day
  { schedule: "* * 0 * *", message: "Day of month part is invalid" },
  { schedule: "* * 32 * *", message: "Day of month part is invalid" },
  { schedule: "* * foo * *", message: "Day of month part is invalid" },
  // Month
  { schedule: "* * * 0 *", message: "Month part is invalid" },
  { schedule: "* * * 13 *", message: "Month part is invalid" },
  { schedule: "* * * foo *", message: "Month part is invalid" },
  // Weekday
  { schedule: "* * * * 7", message: "Day of week part is invalid" },
  { schedule: "* * * * foo", message: "Day of week part is invalid" },
  // Macro
  { schedule: "@foo", message: "Schedule must have 5 parts" }
])("should report when schedule is $schedule", ({ schedule, message }) => {
  const manifest = createManifest(
    new CronJob({
      metadata: { name: "test" },
      spec: { schedule, jobTemplate: {} }
    })
  );
  expect(validate(rule, undefined, manifest)).toEqual([{ manifest, message }]);
});
