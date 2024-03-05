import * as core from '@actions/core';
import * as github from '@actions/github';

export async function run(): Promise<void> {
    try {
        // const token = core.getInput('GITHUB_TOKEN', {required: true});
        // const octokit = github.getOctokit(token);

        // const {context = {}} = github;

        const {pull_request} = github.context.payload;

        if (!pull_request) {
            core.setFailed('Action must be run on pull_request event');
            return;
        }

        const body = pull_request.body;

        if (body && body.includes("urgent")) {
            console.log('PR marked as urgent.');
        } else {
            core.setFailed('PR description must contain "urgent".');
        }
    } catch (error) {
        // Type guard to narrow down the type of `error`
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed('An unknown error occurred');
        }
    }
}
