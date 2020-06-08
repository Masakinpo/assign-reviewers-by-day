import { Octokit } from "@octokit/rest";
import { addDays, format, isWeekend } from 'date-fns';
import _ from 'lodash';
import { Config, ReviewerType } from "./config";

const getAvailableReviewers = (reviewers: ReviewerType[], date: Date) => {
  return reviewers.filter(
    r =>
      r.day === format(date, 'iii').toLowerCase() ||
      !r.day ||
      r.day === "everyday" ||
      (isWeekend(date) && r.day === "weekend") ||
      (!isWeekend(date) && r.day === "weekday")
  );
}

const setReviewers = async (octokit: Octokit, reviewers: string[]): Promise<object> => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')
  const pr = Number((process.env.GITHUB_REF || '').split('refs/pull/')[1].split('/')[0])

  return octokit.pulls.createReviewRequest({
    owner,
    repo,
    reviewers,
    pull_number: pr, // eslint-disable-line @typescript-eslint/camelcase
  })
};

export const assignReviewers = async (octokit: Octokit, config: Config): Promise<void> => {
  const today =  new Date();

  // select must reviewers
  let availableMustReviewers = getAvailableReviewers(config.reviewers, today).filter(r => r.kind === "must");
  let count = 1;
  while(availableMustReviewers.length < config.numOfReviewers.must || count < 7) {
    availableMustReviewers = _.uniq(availableMustReviewers.concat(
      getAvailableReviewers(config.reviewers, addDays(today, count)).filter(r => r.kind === "must")
    ));
    count++;
  }
  let selectedMustReviewers =
    _.sampleSize(availableMustReviewers, config.numOfReviewers.must)

  // select other reviewers
  let availableOtherReviewers = getAvailableReviewers(config.reviewers, today)
    .filter(r => !r.kind || r.kind !== "must");
  count = 1;
  while(availableOtherReviewers.length < config.numOfReviewers.other || count < 7) {
    availableOtherReviewers = _.uniq(availableOtherReviewers.concat(
      getAvailableReviewers(config.reviewers, addDays(today, count)).filter(r => !r.kind || r.kind !== "must")
    ));
    count++;
  }
  let selectedOtherReviewers =
    _.sampleSize(availableOtherReviewers, config.numOfReviewers.other)

  await setReviewers(octokit, [...selectedMustReviewers, ...selectedOtherReviewers].map(r => r.name))
}
