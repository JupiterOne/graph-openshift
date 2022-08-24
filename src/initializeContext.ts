import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import OpenShiftClient from "./openshift/OpenShiftClient";
import { OpenShiftExecutionContext } from "./types";

export default async function initializeContext(
  context: IntegrationExecutionContext,
): Promise<OpenShiftExecutionContext> {
  const {
    instance: { config },
  } = context;

  const insecureSkipTlsVerify =
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
    process.env.OPENSHIFT_SKIP_TLS_VERIFY === "1";

  context.logger.info(
    {
      cluster: config.cluster,
      insecureSkipTlsVerify,
    },
    "Authenticating with OpenShift cluster...",
  );

  const openshift = new OpenShiftClient();
  await openshift.authenticate(
    config.apiToken,
    config.cluster,
    insecureSkipTlsVerify,
  );

  context.logger.info(
    {
      cluster: config.cluster,
    },
    "Authenticated with OpenShift cluster",
  );

  return {
    ...context,
    ...context.clients.getClients(),
    openshift,
  };
}
