import { type Run } from "./octokit-requests";
import { delay } from "./utils";
import type { Octokit } from "@octokit/core";

export type Settings = {
  workflow: string;
  branch: string;
  repo: { owner: string; repo: string };
  octokit: Octokit;
};

export type Services = {
  dispatchWorkflow: (settings: Settings) => Promise<{ status: number }>;
  getLatestRunByBranch: (branch: string) => Promise<Run>;
  getRunDetails: (run: Run) => Promise<Run>;
};

export async function run(
  settings: Settings,
  services: Services,
): Promise<void> {
  const lastRun = await services.getLatestRunByBranch(settings.branch);
  const response = await services.dispatchWorkflow(settings);
  if (response.status !== 204) {
    throw new Error(
      `Failed to dispatch workflow. Got status ${response.status}. Expected 204`,
    );
  }

  const newlyCreatedRun = await retryUpdateUntilCondition(
    services.getLatestRunByBranch,
    [settings.branch],
    (run: Run) => run.run_number > lastRun.run_number,
    10,
  );

  const runAfterConclusionCheck = await retryUpdateUntilCondition(
    services.getRunDetails,
    [newlyCreatedRun],
    (run: Run) => run.conclusion !== null,
    60,
  );

  if (runAfterConclusionCheck.conclusion !== "success") {
    throw new Error(
      `Run ${runAfterConclusionCheck.run_number} failed with conclusion ${runAfterConclusionCheck.conclusion}`,
    );
  }
}

async function retryUpdateUntilCondition(
  fetcher: (...any: any[]) => Promise<Run>,
  args: any[],
  condition: (...any: any[]) => boolean,
  maximumRetries: number,
  retries: number = 0,
) {
  if (retries > maximumRetries) {
    throw new Error("Exceeded maximum retries waiting for a newer run.");
  }

  const updatedRun = await fetcher(...args);
  if (condition(updatedRun, retries)) {
    return updatedRun;
  }

  await delay(2000);
  return retryUpdateUntilCondition(
    fetcher,
    args,
    condition,
    maximumRetries,
    retries + 1,
  );
}
