import {Octokit} from "@octokit/rest";
import {Config, ReviewerType} from "./config";
import { format, isWeekend, addDays } from 'date-fns'
import _ from 'lodash'

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

  // assign to the selected reviewers using octokit
  // selectedMustReviewers.forEach(r =>
  // )
}
