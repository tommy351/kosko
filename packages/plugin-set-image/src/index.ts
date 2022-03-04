import { PluginFactory } from "@kosko/plugin";
import { object, assert, union, string, optional, Infer } from "superstruct";
import { Pod } from "kubernetes-models/v1/Pod";
import { IPodSpec } from "kubernetes-models/v1/PodSpec";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { StatefulSet } from "kubernetes-models/apps/v1/StatefulSet";
import { Job } from "kubernetes-models/batch/v1/Job";
import { CronJob } from "kubernetes-models/batch/v1/CronJob";

function getPodSpec(data: unknown): IPodSpec | undefined {
  if (Pod.is(data)) {
    return data.spec;
  }

  if (Deployment.is(data) || StatefulSet.is(data) || Job.is(data)) {
    return data.spec?.template?.spec;
  }

  if (CronJob.is(data)) {
    return data.spec?.jobTemplate?.spec?.template?.spec;
  }
}

interface ImageSpec {
  name: string;
  tag: string;
}

function parseImage(image: string): ImageSpec {
  const nameParts = image.split("/");
  const parts = nameParts[nameParts.length - 1].split(":", 2);

  return {
    name: parts[0],
    tag: parts[1] || ""
  };
}

function joinImageSpec(spec: ImageSpec): string {
  if (!spec.tag) return spec.name;
  return `${spec.name}:${spec.tag}`;
}

function isImageMatch(image: string, spec: ImageSpec, match: Image): boolean {
  if (typeof match === "string") {
    return image === match;
  }

  if (match.name && spec.name !== match.name) return false;
  if (match.tag && spec.tag !== match.tag) return false;
  return true;
}

function replaceImage(spec: ImageSpec, replace: Image): string {
  if (typeof replace === "string") return replace;

  return joinImageSpec({
    name: replace.name || spec.name,
    tag: replace.tag || spec.tag
  });
}

const imageSchema = union([
  string(),
  object({
    name: optional(string()),
    tag: optional(string())
  })
]);

type Image = Infer<typeof imageSchema>;

const schema = object({
  from: imageSchema,
  to: imageSchema
});

const factory: PluginFactory = (ctx, options) => {
  assert(options, schema);

  return {
    hooks: {
      transformManifest(manifest) {
        const spec = getPodSpec(manifest);

        if (
          !spec ||
          !Array.isArray(spec.containers) ||
          !spec.containers.length
        ) {
          return manifest;
        }

        for (const container of spec.containers) {
          if (!container.image) continue;

          const spec = parseImage(container.image);

          if (!isImageMatch(container.image, spec, options.from)) {
            continue;
          }

          container.image = replaceImage(spec, options.to);
        }

        return manifest;
      }
    }
  };
};

export default factory;
