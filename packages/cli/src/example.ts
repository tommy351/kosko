export interface Example {
  description: string;
  command: string;
}

export function makeExamples(examples: Example[]): string[] {
  return examples
    .map(ex => `# ${ex.description}\n$ <%= config.bin %> ${ex.command}`)
    .reduce(
      (acc, line, i) => (i ? [...acc, "", line] : [...acc, line]),
      [] as string[]
    );
}
