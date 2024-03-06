import { Octokit } from "@octokit/core";
import type { Settings } from "./run";

export type Run = {
  id: number;
  run_number: number;
  conclusion:
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "skipped"
    | "timed_out"
    | "action_required"
    | null;
};

async function dispatchWorkflow(settings: Settings) {
  return await settings.octokit
    .request(
      `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches`,
      {
        ...settings.repo,
        ref: settings.branch,
        workflow_id: settings.workflow,
      },
    )
    .then((r) => {
      return { status: r.status };
    });
}

function fetchLatestRunByBranch(
  repo: { owner: string; repo: string },
  octokit: Octokit,
) {
  return async (branch: string): Promise<Run> => {
    return octokit
      .request(`GET /repos/{owner}/{repo}/actions/runs`, {
        ...repo,
        per_page: 1,
        page: 1,
        branch: branch,
      })
      .then((response) => {
        return {
          id: response.data?.workflow_runs[0].id,
          run_number: response.data?.workflow_runs[0].run_number,
          conclusion: response.data?.workflow_runs[0].conclusion,
        } as Run;
      });
  };
}

function fetchRunDetails(
  repo: { owner: string; repo: string },
  octokit: Octokit,
) {
  return async (run: Run): Promise<Run> => {
    return octokit
      .request(`GET /repos/{owner}/{repo}/actions/runs/{run_id}`, {
        ...repo,
        run_id: run.id,
        exclude_pull_requests: true,
      })
      .then((response) => {
        return {
          id: response.data.id,
          run_number: response.data.run_number,
          conclusion: response.data.conclusion,
        } as Run;
      });
  };
}

export { fetchRunDetails, fetchLatestRunByBranch, dispatchWorkflow };
