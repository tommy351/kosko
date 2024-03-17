import { getPodSpec } from "../utils/pod";
import { createRule } from "./types";
import type { IContainer } from "kubernetes-models/v1/Container";

export default createRule({
  factory(ctx) {
    return {
      validate(manifest) {
        function checkPort(container: IContainer, port: number | string) {
          if (typeof port !== "string") return;

          const ports = container.ports ?? [];

          if (!ports.some((p) => p.name === port)) {
            ctx.report(
              manifest,
              `Port "${port}" is not defined in container "${container.name}".`
            );
          }
        }

        const podSpec = getPodSpec(manifest.data);
        if (!podSpec || !podSpec.containers?.length) return;

        for (const container of podSpec.containers) {
          for (const probe of [
            container.livenessProbe,
            container.readinessProbe,
            container.startupProbe
          ]) {
            if (!probe) continue;

            const { httpGet, tcpSocket, grpc } = probe;

            if (httpGet) {
              checkPort(container, httpGet.port);
            } else if (tcpSocket) {
              checkPort(container, tcpSocket.port);
            } else if (grpc) {
              checkPort(container, grpc.port);
            }
          }
        }
      }
    };
  }
});
