import { stdout } from "node:process";

export function print(data: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stdout.write(data, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
