import { Environment } from "./environment";

export default new Environment(process.cwd());
export { Environment };

// HACK: Export default to module.exports and maintain types above.
module.exports = Object.assign(exports.default, exports);
Object.defineProperty(module.exports, "__esModule", { value: true });
