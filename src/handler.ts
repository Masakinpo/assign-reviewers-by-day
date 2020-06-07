import {Octokit} from "@octokit/rest";
import {Config} from "./config";

export const assignReviewers = async (octokit: Octokit, config: Config): Promise<void> => {
  console.log("assignReviewers");
}
