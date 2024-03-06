import * as core from "@actions/core";
import * as github from "@actions/github";
import type { Settings } from "./run";
import type { Context } from "@actions/github/lib/context";

export function createSettingsFromGithub(): Settings {
  return {
    branch: core.getInput("branch", { required: true }),
    repo: getRepository(core.getInput("repository"), github.context),
    workflow: core.getInput("workflow", { required: true }),
    octokit: github.getOctokit(
      core.getInput("github-token", { required: true }),
    ),
  };
}

export function getRepository(
  input: string,
  ctx: Context,
): { owner: string; repo: string } {
  if (input === "") {
    return { owner: ctx.repo.owner, repo: ctx.repo.repo };
  }

  const repoRegex =
    /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\/[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9]+)*$/;

  if (!repoRegex.test(input)) {
    throw new Error(
      `Invalid repository name. Expected format is "owner/repo". Got "${input}"`,
    );
  }

  const [owner, repositoryName] = input.split("/");
  return { owner: owner, repo: repositoryName };
}
