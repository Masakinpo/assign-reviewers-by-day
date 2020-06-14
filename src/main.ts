import { getInput, setFailed } from '@actions/core';
import { Octokit } from '@octokit/rest';
import { getConfig, validateConfig } from './config';
import { assignReviewers } from './handler';

export const run = async (): Promise<void> => {
  try {
    const token = getInput('repo-token', { required: true });
    const config = getConfig();
    const isValidConfig = !!config && validateConfig(config);
    if (isValidConfig) {
      return await assignReviewers(new Octokit({ auth: token }), config!);
    }
    throw new Error(`invalid config (${JSON.stringify(config)})`);
  } catch (error) {
    setFailed(error);
  }
};

run();
