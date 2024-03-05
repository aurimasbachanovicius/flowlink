import * as core from '@actions/core';
import * as github from '@actions/github';

export async function run(): Promise<void> {

    const token = core.getInput('github-token', {required: true});
    const octokit = github.getOctokit(token);

    const workflow = core.getInput('workflow', {required: true});
    const branch = core.getInput('branch', {required: true});

    const response = await octokit.request(`POST /repos/${github.context.repo.owner}/${github.context.repo.repo}/actions/workflows/${workflow}/dispatches`, {ref: branch});

    core.debug('Response: ');
    core.debug(response.data);
}
