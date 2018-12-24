export function getDefault(mod: any) {
  return mod.__esModule ? mod.default : mod;
}

export function requireDefault(id: any) {
  return getDefault(require(id));
}
