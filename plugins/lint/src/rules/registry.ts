import banImage from "./ban-image";
import banServiceType from "./ban-service-type";
import noMissingConfigMap from "./no-missing-config-map";
import noMissingGateway from "./no-missing-gateway";
import noMissingGatewayClass from "./no-missing-gateway-class";
import noMissingNamespace from "./no-missing-namespace";
import noMissingPodVolumeMount from "./no-missing-pod-volume-mount";
import noMissingPv from "./no-missing-pv";
import noMissingPvc from "./no-missing-pvc";
import noMissingRole from "./no-missing-role";
import noMissingScaleTarget from "./no-missing-scale-target";
import noMissingSecret from "./no-missing-secret";
import noMissingService from "./no-missing-service";
import noMissingServiceAccount from "./no-missing-service-account";
import noReplicasWithHpa from "./no-replicas-with-hpa";
import requireContainerImage from "./require-container-image";
import requireContainerPortName from "./require-container-port-name";
import requireContainerResources from "./require-container-resources";
import requireEnvName from "./require-env-name";
import requireImageTag from "./require-image-tag";
import requireNamespace from "./require-namespace";
import requireProbe from "./require-probe";
import requireSecurityContext from "./require-security-context";
import requireServicePortName from "./require-service-port-name";
import requireServiceSelector from "./require-service-selector";
import uniqueContainerName from "./unique-container-name";
import uniqueContainerPortName from "./unique-container-port-name";
import uniqueEnvName from "./unique-env-name";
import uniqueServicePortName from "./unique-service-port-name";
import validCronJobSchedule from "./valid-cron-job-schedule";
import validHpaReplicas from "./valid-hpa-replicas";
import validPodSelector from "./valid-pod-selector";
import validProbePort from "./valid-probe-port";

export const rules = {
  "ban-image": banImage,
  "ban-service-type": banServiceType,
  "no-missing-config-map": noMissingConfigMap,
  "no-missing-gateway-class": noMissingGatewayClass,
  "no-missing-gateway": noMissingGateway,
  "no-missing-namespace": noMissingNamespace,
  "no-missing-pod-volume-mount": noMissingPodVolumeMount,
  "no-missing-pv": noMissingPv,
  "no-missing-pvc": noMissingPvc,
  "no-missing-role": noMissingRole,
  "no-missing-scale-target": noMissingScaleTarget,
  "no-missing-secret": noMissingSecret,
  "no-missing-service": noMissingService,
  "no-missing-service-account": noMissingServiceAccount,
  "no-replicas-with-hpa": noReplicasWithHpa,
  "require-container-image": requireContainerImage,
  "require-container-port-name": requireContainerPortName,
  "require-container-resources": requireContainerResources,
  "require-env-name": requireEnvName,
  "require-image-tag": requireImageTag,
  "require-namespace": requireNamespace,
  "require-probe": requireProbe,
  "require-security-context": requireSecurityContext,
  "require-service-port-name": requireServicePortName,
  "require-service-selector": requireServiceSelector,
  "unique-container-name": uniqueContainerName,
  "unique-container-port-name": uniqueContainerPortName,
  "unique-env-name": uniqueEnvName,
  "unique-service-port-name": uniqueServicePortName,
  "valid-cron-job-schedule": validCronJobSchedule,
  "valid-hpa-replicas": validHpaReplicas,
  "valid-pod-selector": validPodSelector,
  "valid-probe-port": validProbePort
} as const;
