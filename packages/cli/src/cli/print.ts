export function print(data: string | Buffer) {
  return new Promise((resolve, reject) => {
    process.stdout.write(data, (err: any) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
