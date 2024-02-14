import { type ITypedLocalObjectReference } from "kubernetes-models/v1";
import { is, optional, string, type } from "superstruct";

const resourceSchema = type({
  apiVersion: string(),
  kind: string(),
  metadata: type({
    namespace: optional(string()),
    name: string()
  })
});

export interface ResourceMeta {
  apiVersion: string;
  kind: string;
  namespace: string;
  name: string;
}

export function createResourceMeta(value: unknown): ResourceMeta | undefined {
  if (!is(value, resourceSchema)) return;

  return {
    apiVersion: value.apiVersion,
    kind: value.kind,
    namespace: value.metadata.namespace ?? "",
    name: value.metadata.name
  };
}

export interface ResourcePosition extends ResourceMeta {
  path: string[];
}

function stringifyMeta(meta: ResourceMeta): string {
  return `${meta.apiVersion}/${meta.kind} ${meta.namespace}/${meta.name}`;
}

export class ResourceMap {
  private readonly resources: Map<string, unknown> = new Map();

  public add(value: unknown): void {
    const meta = createResourceMeta(value);
    if (!meta) return;

    this.resources.set(stringifyMeta(meta), value);
  }

  public get(meta: ResourceMeta): unknown {
    return this.resources.get(stringifyMeta(meta));
  }

  public getByTypedRef(
    ref: ITypedLocalObjectReference & { namespace: string }
  ): unknown {
    // TODO
    return;
  }
}
