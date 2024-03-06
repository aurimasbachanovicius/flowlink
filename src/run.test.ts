import { test } from "bun:test";
import { Octokit } from "@octokit/core";
import { run, type Services, type Settings } from "./run";

test("run test with mocked data", async () => {
  const settings = {
    workflow: "test",
    branch: "main",
    repo: { owner: "test", repo: "test" },
    octokit: new Octokit({ request: { fetch } }),
  } as Settings;

  let increase = 0;
  const services = {
    dispatchWorkflow: async () => ({ status: 204 }),
    getLatestRunByBranch: async () => {
      return {
        id: increase++,
        run_number: increase,
        conclusion: "success",
      };
    },
    getRunDetails: async () => ({
      id: increase,
      run_number: 1,
      conclusion: "success",
    }),
  } as Services;

  await run(settings, services);
});
