import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { Octokit } from "@octokit/rest"
import {fetchConfigurationFile} from "./utils";


export const run = async () => {
  try {
    const token = getInput('repo-token', { required: true })
    const configPath = getInput('configuration-path', {
      required: true,
    })

    const octokit = new Octokit();
    const { repo, sha } = context
    const config = await fetchConfigurationFile(octokit, {
      owner: repo.owner,
      repo: repo.repo,
      path: configPath,
      ref: sha,
    })

    // await handler.handlePullRequest(octokit, context, config)
  } catch (error) {
    setFailed(error.message)
  }
}
