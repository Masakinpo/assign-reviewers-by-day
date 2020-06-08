import {Octokit} from "@octokit/rest";
import {Config} from "./config";
import { format, isWeekend } from 'date-fns'

export const assignReviewers = async (octokit: Octokit, config: Config): Promise<void> => {
  const availableReviewers = config.reviewers.filter(
    r =>
      r.day === format(new Date(), 'iii').toLowerCase() ||
      r.day === "everyday" ||
      (isWeekend(new Date()) && r.day === "weekend") ||
      (!isWeekend(new Date()) && r.day === "weekday")
  );
  //TODO 指定された数のreviewerを選んで、PRにアサインする
}
