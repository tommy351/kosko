// Source: https://github.com/sindresorhus/get-stdin/blob/v9.0.0/index.js
export async function getStdin(): Promise<string> {
  let result = "";

  if (process.stdin.isTTY) {
    return result;
  }

  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    result += chunk;
  }

  return result;
}
