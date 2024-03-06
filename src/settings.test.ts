import { describe, expect, test } from "bun:test";
import { getRepository } from "./settings";
import type { Context } from "@actions/github/lib/context";

const ctx = {
  repo: {
    owner: "defaultOwner",
    repo: "defaultRepo",
  },
} as Context;

describe("get repository", () => {
  // Test for valid input
  test("should return the correct owner and repo for a valid input", () => {
    const input = "owner123/repo-name";
    const result = getRepository(input, ctx);
    expect(result).toEqual({ owner: "owner123", repo: "repo-name" });
  });

  // Test for empty input
  test("should return the default owner and repo from context if input is empty", () => {
    const input = "";
    const result = getRepository(input, ctx);
    expect(result).toEqual({ owner: "defaultOwner", repo: "defaultRepo" });
  });

  // Test for invalid input (no slash)
  test("should throw an error for input without a slash", () => {
    const input = "invalidInputWithoutSlash";
    expect(() => getRepository(input, ctx)).toThrow(
      'Invalid repository name. Expected format is "owner/repo". Got "invalidInputWithoutSlash"',
    );
  });

  // Test for invalid input (special characters)
  test("should throw an error for input with invalid characters", () => {
    const input = "owner@123/repo$%^";
    expect(() => getRepository(input, ctx)).toThrow(
      `Invalid repository name. Expected format is "owner/repo". Got "${input}"`,
    );
  });

  // Test for input with only owner part
  test("should throw an error if input has only the owner part", () => {
    const input = "onlyOwner/";
    expect(() => getRepository(input, ctx)).toThrow(
      `Invalid repository name. Expected format is "owner/repo". Got "${input}"`,
    );
  });

  // Test for input with only repo part
  test("should throw an error if input has only the repo part", () => {
    const input = "/onlyRepo";
    expect(() => getRepository(input, ctx)).toThrow(
      `Invalid repository name. Expected format is "owner/repo". Got "${input}"`,
    );
  });

  // Test for valid input with hyphens and underscores
  test("should return the correct owner and repo for valid input with hyphens and underscores", () => {
    const input = "owner-name/repo_name";
    const result = getRepository(input, ctx);
    expect(result).toEqual({ owner: "owner-name", repo: "repo_name" });
  });

  // Test for valid input with a period in the repo name
  test("should return the correct owner and repo for valid input with a period", () => {
    const input = "owner123/repo.name";
    const result = getRepository(input, ctx);
    expect(result).toEqual({ owner: "owner123", repo: "repo.name" });
  });
});
