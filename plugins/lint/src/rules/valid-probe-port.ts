import type { IContainerPort } from "kubernetes-models/v1/ContainerPort";
import { getPodSpec } from "../utils/pod";
import { createRule } from "./types";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        function checkPort(ports: IContainerPort[], port: number | string) {
          if (typeof port === "string") {
            if (!ports.some((p) => p.name === port)) {
              ctx.report(manifest, `Port "${port}" is not defined`);
            }
          } else {
            if (!ports.some((p) => p.containerPort === port)) {
              ctx.report(manifest, `Port ${port} is not defined`);
            }
          }
        }

        const podSpec = getPodSpec(manifest.data);
        if (!podSpec || !podSpec.containers?.length) return;

        for (const container of podSpec.containers) {
          const ports = container.ports ?? [];

          for (const probe of [
            container.livenessProbe,
            container.readinessProbe,
            container.startupProbe
          ]) {
            if (!probe) continue;

            const { httpGet, tcpSocket, grpc } = probe;

            if (httpGet) {
              checkPort(ports, httpGet.port);
            } else if (tcpSocket) {
              checkPort(ports, tcpSocket.port);
            } else if (grpc) {
              checkPort(ports, grpc.port);
            }
          }
        }
      }
    };
  }
});
