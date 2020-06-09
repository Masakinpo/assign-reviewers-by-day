import { Octokit } from '@octokit/rest';
import { debug } from '@actions/core';
import { addDays, format } from 'date-fns';
import _ from 'lodash';
import {Config, dayOfWeek, NumOfReviewersType, ReviewerType} from './config';

type ReviewerDict = {
  must: {
    [key in typeof dayOfWeek[number]]: ReviewerType[];
  };
  other: {
    [key in typeof dayOfWeek[number]]: ReviewerType[];
  };
};

const mustReviewerCond = (r: ReviewerType): boolean => r.kind === 'must';
const otherReviewerCond = (r: ReviewerType): boolean =>
  !r.kind || r.kind !== 'must';

const generateDictFromConfig = (reviewers: ReviewerType[]): ReviewerDict => {
  const reviewerDict = {};
  dayOfWeek.forEach((d) => {
    const availableReviewers = reviewers.filter(
      (r) =>
        r.day === d ||
        !r.day ||
        r.day === 'everyday' ||
        ((d === 'sat' || d === 'sun') && r.day === 'weekend') ||
        (d !== 'sat' && d !== 'sun' && r.day === 'weekday')
    );
    _.set<ReviewerDict>(
      reviewerDict,
      ['must', d],
      availableReviewers.filter((r) => mustReviewerCond(r))
    );
    _.set<ReviewerDict>(
      reviewerDict,
      ['other', d],
      availableReviewers.filter((r) => otherReviewerCond(r))
    );
  });
  return reviewerDict as ReviewerDict;
};

const selectReviewers = (numOfReviewers: NumOfReviewersType, reviewers: ReviewerType[]): string[] => {
  const today = new Date();
  const reviewerDict = generateDictFromConfig(reviewers);

  // select must reviewers
  const selectedMustReviewers: ReviewerType[] =
    _.sampleSize(reviewerDict.must[
      format(today, 'iii').toLowerCase() as typeof dayOfWeek[number]
      ], numOfReviewers.must);
  let count = 1;
  while (selectedMustReviewers.length < numOfReviewers.must) {
    const nextDayMustReviewers =
      reviewerDict.must[
        format(
          addDays(today, count),
          'iii'
        ).toLowerCase() as typeof dayOfWeek[number]
        ];
    selectedMustReviewers.length + nextDayMustReviewers.length <
    numOfReviewers.must
      ? selectedMustReviewers.concat(nextDayMustReviewers)
      : selectedMustReviewers.concat(
      _.sampleSize(
        nextDayMustReviewers,
        numOfReviewers.must - selectedMustReviewers.length
      )
      );
    count++;
  }

  // select other reviewers
  const selectedOtherReviewers: ReviewerType[] =
    _.sampleSize(
    reviewerDict.other[
      format(today, 'iii').toLowerCase() as typeof dayOfWeek[number]
      ], numOfReviewers.other);
  count = 1;
  while (selectedOtherReviewers.length < numOfReviewers.other) {
    const nextDayOtherReviewers =
      reviewerDict.other[
        format(
          addDays(today, count),
          'iii'
        ).toLowerCase() as typeof dayOfWeek[number]
        ];
    selectedOtherReviewers.length + nextDayOtherReviewers.length <
    numOfReviewers.other
      ? selectedOtherReviewers.concat(nextDayOtherReviewers)
      : selectedOtherReviewers.concat(
      _.sampleSize(
        nextDayOtherReviewers,
        numOfReviewers.other - selectedOtherReviewers.length
      )
      );
    count++;
  }

  return [...selectedMustReviewers, ...selectedOtherReviewers].map((r) => r.name);
}

const setReviewers = async (
  octokit: Octokit,
  reviewers: string[]
): Promise<void> => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const pr = Number(
    (process.env.GITHUB_REF || '').split('refs/pull/')[1].split('/')[0]
  );

  const result = await octokit.pulls.createReviewRequest({
    owner,
    repo,
    reviewers,
    pull_number: pr,
  });
  debug(JSON.stringify(result));
};

export const assignReviewers = async (
  octokit: Octokit,
  config: Config
): Promise<void> => {
  const {numOfReviewers, reviewers} = config;
  const nameOfSelectedReviewers = selectReviewers(numOfReviewers, reviewers);
  await setReviewers(
    octokit,
    nameOfSelectedReviewers
  );
};
