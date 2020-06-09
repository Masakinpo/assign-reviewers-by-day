import { Octokit } from "@octokit/rest";
import { addDays, format, isWeekend } from 'date-fns';
import _ from 'lodash';
import {Config, dayOfWeek, ReviewerType} from "./config";

const mustReviewerCond = (r: ReviewerType): boolean => r.kind === "must";
const otherReviewerCond = (r: ReviewerType): boolean => !r.kind || r.kind !== "must";

type ReviewerDict = {
  must: {
    [key in (typeof dayOfWeek)[number] ]: ReviewerType[]
  },
  other: {
    [key in (typeof dayOfWeek)[number] ]: ReviewerType[]
  }
}

const generateDictFromConfig = (reviewers: ReviewerType[]): ReviewerDict => {
  const reviewerDict = {};
  dayOfWeek.forEach(
    d => {
      const availableReviewers = reviewers.filter(r =>
        r.day === d ||
        !r.day ||
        r.day === "everyday" ||
        ((d === 'sat' || d === 'sun') && r.day === "weekend") ||
        ((d !== 'sat' && d !== 'sun') && r.day === "weekday"))
      _.set<ReviewerDict>(reviewerDict, ["must", d], availableReviewers.filter(r => mustReviewerCond(r)))
      _.set<ReviewerDict>(reviewerDict, ["other", d], availableReviewers.filter(r => otherReviewerCond(r)))
    }
  )
  return reviewerDict as ReviewerDict;
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
  const reviewerDict = generateDictFromConfig(config.reviewers);

  // select must reviewers
  const selectedMustReviewers: ReviewerType[] = reviewerDict.must[format(today, 'iii').toLowerCase() as typeof dayOfWeek[number]];
  let count = 1;
  while (selectedMustReviewers.length < config.numOfReviewers.must) {
    const nextDayMustReviewers = reviewerDict.must[format(addDays(today, count), 'iii').toLowerCase() as typeof dayOfWeek[number]];
    selectedMustReviewers.length + nextDayMustReviewers.length < config.numOfReviewers.must ?
      selectedMustReviewers.concat(nextDayMustReviewers) :
      selectedMustReviewers.concat(_.sampleSize(nextDayMustReviewers, config.numOfReviewers.must - selectedMustReviewers.length));
    count++;
  }

  // select other reviewers
  const selectedOtherReviewers: ReviewerType[] = reviewerDict.other[format(today, 'iii').toLowerCase() as typeof dayOfWeek[number]];
  count = 1;
  while (selectedOtherReviewers.length < config.numOfReviewers.other) {
    const nextDayOtherReviewers = reviewerDict.other[format(addDays(today, count), 'iii').toLowerCase() as typeof dayOfWeek[number]];
    selectedOtherReviewers.length + nextDayOtherReviewers.length < config.numOfReviewers.other ?
      selectedOtherReviewers.concat(nextDayOtherReviewers) :
      selectedOtherReviewers.concat(_.sampleSize(nextDayOtherReviewers, config.numOfReviewers.other - selectedOtherReviewers.length))
    count++;
  }

  await setReviewers(octokit, [...selectedMustReviewers, ...selectedOtherReviewers].map(r => r.name))
}
