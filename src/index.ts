import * as core from "@actions/core";
import { run } from "./run";
import { createSettingsFromGithub } from "./settings";
import { createServicesFromOctokit } from "./services";

try {
  const settings = createSettingsFromGithub();
  const services = createServicesFromOctokit(settings);

  await run(settings, services);
} catch (e) {
  const errorMessage = (e as Error).message || "An unknown error occurred";
  core.setFailed(errorMessage);
  console.error(e);
}
