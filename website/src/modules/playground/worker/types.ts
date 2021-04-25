import type { RollupWarning } from "rollup";

export interface BundleOptions {
  files: Record<string, string>;
  component: string;
  environment: string;
  callback: string;
}

export interface BundleResult {
  code: string;
  warnings: RollupWarning[];
}

export interface PlaygroundWorker {
  bundle(options: BundleOptions): Promise<BundleResult>;
}
