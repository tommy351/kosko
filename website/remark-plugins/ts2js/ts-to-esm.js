// @ts-check

import { transform } from "sucrase";

/**
 * @param {string} input
 * @returns {string}
 */
export default function tsToEsm(input) {
  const result = transform(input, {
    transforms: ["typescript"],
    disableESTransforms: true
  });

  return result.code.trim();
}
