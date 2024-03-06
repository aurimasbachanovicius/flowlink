import { test } from "bun:test";
import { run } from "./run";
import { createSettingsFromGithub } from "./settings";
import { createServicesFromOctokit } from "./services";

test("run test with github integration (.env)", async () => {
  const settings = createSettingsFromGithub();
  const services = createServicesFromOctokit(settings);

  try {
    await run(settings, services);
  } catch (e) {}
}, 60000);
