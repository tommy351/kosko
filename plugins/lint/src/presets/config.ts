import { enums } from "superstruct";
import recommended from "./recommended";

export const presets = { recommended };

export function buildPresetSchema() {
  return enums(Object.keys(presets) as (keyof typeof presets)[]);
}
