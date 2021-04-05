"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMinimatch = void 0;
const Path = require("path");
const minimatch_1 = require("minimatch");
const unix = Path.sep === "/";
function normalize(pattern) {
    if (pattern.startsWith("!") || pattern.startsWith("#")) {
        return pattern[0] + normalize(pattern.substr(1));
    }
    if (unix) {
        pattern = pattern.replace(/[\\]/g, "/").replace(/^\w:/, "");
    }
    // pattern paths not starting with '**' are resolved even if it is an
    // absolute path, to ensure correct format for the current OS
    if (pattern.substr(0, 2) !== "**") {
        pattern = Path.resolve(pattern);
    }
    // On Windows we transform `\` to `/` to unify the way paths are intepreted
    if (!unix) {
        pattern = pattern.replace(/[\\]/g, "/");
    }
    return pattern;
}
/**
 * Convert array of glob patterns to array of minimatch instances.
 *
 * Handle a few Windows-Unix path gotchas.
 */
function createMinimatch(patterns) {
    return patterns.map((pattern) => new minimatch_1.Minimatch(normalize(pattern), { dot: true }));
}
exports.createMinimatch = createMinimatch;
