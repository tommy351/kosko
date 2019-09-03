import { Environment, Paths, VariablesLayer } from "./environment";

export default new Environment(process.cwd());
export { Environment, Paths, VariablesLayer };

// HACK: Export default to module.exports and maintain types above.
module.exports = Object.assign(exports.default, exports);
Object.defineProperty(module.exports, "__esModule", { value: true });
