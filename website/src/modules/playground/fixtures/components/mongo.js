import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";
import { PersistentVolumeClaim } from "kubernetes-models/v1/PersistentVolumeClaim";
import env from "@kosko/env";

const params = env.component("mongo");

const metadata = { name: "mongo", namespace: params.namespace };
const labels = { app: "mongo" };

const pvc = new PersistentVolumeClaim({
  metadata,
  spec: {
    accessModes: ["ReadWriteOnce"],
    resources: {
      requests: {
        storage: params.storageSize
      }
    }
  }
});

const deployment = new Deployment({
  metadata,
  spec: {
    replicas: 1,
    strategy: {
      type: "Recreate"
    },
    selector: {
      matchLabels: labels
    },
    template: {
      metadata: { labels },
      spec: {
        containers: [
          {
            image: "mongo:4.4",
            name: "mongo",
            ports: [{ containerPort: 27017 }],
            env: [
              {
                name: "MONGO_INITDB_DATABASE",
                value: params.database
              }
            ],
            volumeMounts: [
              {
                name: "data",
                mountPath: "/data/db"
              }
            ]
          }
        ],
        volumes: [
          {
            name: "data",
            persistentVolumeClaim: {
              claimName: metadata.name
            }
          }
        ]
      }
    }
  }
});

const service = new Service({
  metadata,
  spec: {
    selector: labels,
    ports: [{ port: 27017 }]
  }
});

export default [pvc, deployment, service];
