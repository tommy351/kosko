import { Environment, Paths, Reducer } from "./environment";

export default new Environment(process.cwd());
export { Environment, Paths, Reducer };

// HACK: Export default to module.exports and maintain types above.
module.exports = Object.assign(exports.default, exports);
Object.defineProperty(module.exports, "__esModule", { value: true });
