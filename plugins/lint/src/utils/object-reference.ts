import { Infer, assign, object, optional, string } from "superstruct";
import { compileNamespacedNamePattern, namespacedNameSchema } from "./manifest";
import { Matcher } from "./pattern";
import { ICrossVersionObjectReference } from "kubernetes-models/autoscaling/v1/CrossVersionObjectReference";

export const objectReferenceSchema = assign(
  namespacedNameSchema,
  object({
    apiVersion: optional(string()),
    kind: string()
  })
);

export function buildObjectReferenceMatcher(
  value: Infer<typeof objectReferenceSchema>
): Matcher<Partial<ICrossVersionObjectReference & { namespace?: string }>> {
  const match = compileNamespacedNamePattern(value);

  return (ref) => {
    return (
      ref.apiVersion === value.apiVersion &&
      ref.kind === value.kind &&
      match({ name: ref.name || "", namespace: ref.namespace })
    );
  };
}
