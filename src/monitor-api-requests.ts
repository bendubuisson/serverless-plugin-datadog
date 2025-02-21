import { MonitorParams } from "monitors";
import { Response } from "node-fetch";
import * as Serverless from "serverless";
import fetch from "node-fetch";

export class InvalidAuthenticationError extends Error {
  constructor(message: string) {
    super(...message);
    this.name = "Invalid Authentication Error";
    this.message = message;
  }
}

interface QueriedMonitor {
  query: string;
  id: number;
  name: string;
  tags: string[];
}

export async function createMonitor(
  site: string,
  monitorParams: MonitorParams,
  monitorsApiKey: string,
  monitorsAppKey: string,
) {
  const response: Response = await fetch(`https://api.${site}/api/v1/monitor`, {
    method: "POST",
    headers: {
      "DD-API-KEY": monitorsApiKey,
      "DD-APPLICATION-KEY": monitorsAppKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(monitorParams),
  });

  return response;
}

export async function updateMonitor(
  site: string,
  monitorId: number,
  monitorParams: MonitorParams,
  monitorsApiKey: string,
  monitorsAppKey: string,
) {
  const response: Response = await fetch(`https://api.${site}/api/v1/monitor/${monitorId}`, {
    method: "PUT",
    headers: {
      "DD-API-KEY": monitorsApiKey,
      "DD-APPLICATION-KEY": monitorsAppKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(monitorParams),
  });

  return response;
}

export async function deleteMonitor(site: string, monitorId: number, monitorsApiKey: string, monitorsAppKey: string) {
  const response: Response = await fetch(`https://api.${site}/api/v1/monitor/${monitorId}`, {
    method: "DELETE",
    headers: {
      "DD-API-KEY": monitorsApiKey,
      "DD-APPLICATION-KEY": monitorsAppKey,
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function searchMonitors(site: string, queryTag: string, monitorsApiKey: string, monitorsAppKey: string) {
  const query = `tag:"${queryTag}"`;
  const response: Response = await fetch(`https://api.${site}/api/v1/monitor/search?query=${query}`, {
    method: "GET",
    headers: {
      "DD-API-KEY": monitorsApiKey,
      "DD-APPLICATION-KEY": monitorsAppKey,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error(`Can't fetch monitors. Status code: ${response.status}. Message: ${response.statusText}`);
  }

  const json = await response.json();
  const monitors: QueriedMonitor[] = json.monitors;

  return monitors;
}

export async function getCloudFormationStackId(serverless: Serverless) {
  const stackName = serverless.getProvider("aws").naming.getStackName();
  const describeStackOutput = await serverless
    .getProvider("aws")
    .request(
      "CloudFormation",
      "describeStacks",
      { StackName: stackName },
      { region: serverless.getProvider("aws").getRegion() },
    )
    .catch(() => {
      // Ignore any request exceptions, fail silently and skip output logging
    });
  const cloudFormationStackId: string = describeStackOutput ? describeStackOutput.Stacks[0].StackId : "";
  return cloudFormationStackId;
}

export async function getExistingMonitors(
  site: string,
  cloudFormationStackId: string,
  monitorsApiKey: string,
  monitorsAppKey: string,
) {
  const existingMonitors = await searchMonitors(
    site,
    `aws_cloudformation_stack-id:${cloudFormationStackId}`,
    monitorsApiKey,
    monitorsAppKey,
  );
  const serverlessMonitorIdByMonitorId: { [key: string]: number } = {};
  for (const existingMonitor of existingMonitors) {
    for (const tag of existingMonitor.tags) {
      if (tag.startsWith("serverless_monitor_id:")) {
        const serverlessMonitorId = tag.substring(tag.indexOf(":") + 1);
        serverlessMonitorIdByMonitorId[serverlessMonitorId] = existingMonitor.id;
      }
    }
  }
  return serverlessMonitorIdByMonitorId;
}
