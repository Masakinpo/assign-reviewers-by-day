import { getInput, setFailed } from '@actions/core'
import { Octokit } from "@octokit/rest"
import {getConfig} from "./config";
import {assignReviewers} from "./handler";


export const run = async () => {
  try {
    const token = getInput('repo-token', { required: true })
    const config = getConfig()
    if (!!config) {
      await assignReviewers(new Octokit({auth: token}), config)
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run();
