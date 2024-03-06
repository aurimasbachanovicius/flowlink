import type { Services, Settings } from "./run";
import {
  dispatchWorkflow,
  fetchLatestRunByBranch,
  fetchRunDetails,
} from "./octokit-requests";

export function createServicesFromOctokit(settings: Settings): Services {
  return {
    dispatchWorkflow: dispatchWorkflow,
    getRunDetails: fetchRunDetails(settings.repo, settings.octokit),
    getLatestRunByBranch: fetchLatestRunByBranch(
      settings.repo,
      settings.octokit,
    ),
  };
}
