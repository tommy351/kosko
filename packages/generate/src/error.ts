interface Component {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
  };
}

function isComponent(value: unknown): value is Component {
  if (value == null || typeof value !== "object") return false;

  const { apiVersion, kind, metadata = {} } = value as any;

  return (
    typeof apiVersion === "string" &&
    typeof kind === "string" &&
    typeof metadata.name === "string"
  );
}

export interface ValidationErrorOptions {
  path: string;
  index: number[];
  cause: Error;
  component: unknown;
}

function generateAdditionalInfo(
  { path, index, component }: ValidationErrorOptions,
  { separator }: { separator: string }
) {
  const parts: string[] = [
    `path: ${JSON.stringify(path)}`,
    `index: [${index.join(", ")}]`
  ];

  if (isComponent(component)) {
    const {
      apiVersion,
      kind,
      metadata: { name, namespace }
    } = component;

    parts.push(`kind: ${JSON.stringify(`${apiVersion}/${kind}`)}`);

    if (typeof namespace === "string" && namespace) {
      parts.push(`namespace: ${JSON.stringify(namespace)}`);
    }

    parts.push(`name: ${JSON.stringify(name)}`);
  }

  return parts.join(separator);
}

export class ValidationError extends Error {
  public readonly path: string;
  public readonly index: number[];
  public readonly cause: Error;
  public readonly component: unknown;

  public constructor(options: ValidationErrorOptions) {
    super(
      `${options.cause.message} (${generateAdditionalInfo(options, {
        separator: ", "
      })})`
    );

    this.path = options.path;
    this.index = options.index;
    this.cause = options.cause;
    this.component = options.component;

    // Regular expression is from: https://github.com/sindresorhus/extract-stack
    const stack = this.cause.stack || this.stack;
    if (!stack) return;

    const pos = stack.search(/(?:\n {4}at .*)+/);
    const separator = "\n- ";

    this.stack = `${this.name}: ${
      this.cause.message
    }${separator}${generateAdditionalInfo(options, { separator })}${
      ~pos ? stack.substring(pos) : "\n" + stack
    }`;
  }
}

ValidationError.prototype.name = "ValidationError";
