export function print(data: string | Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.write(data, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
