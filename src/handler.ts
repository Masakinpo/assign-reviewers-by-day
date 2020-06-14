import { Octokit } from '@octokit/rest';
import { debug, info } from '@actions/core';
import { format } from 'date-fns';
import _ from 'lodash';
import { Config, dayOfWeek, NumOfReviewersType, ReviewerType } from './config';

type ReviewerDict = {
  [key in ReviewerType['group']]: {
    [key in typeof dayOfWeek[number]]: ReviewerType[];
  };
};

export const generateDictFromConfig = (
  reviewers: ReviewerType[]
): ReviewerDict => {
  const groups = _.uniq(reviewers.map((r) => r.group));
  const reviewerDict: ReviewerDict = {};
  groups.forEach((g) => {
    dayOfWeek.forEach((d) => {
      const availableReviewers = reviewers.filter(
        (r) =>
          r.group === g ||
          !r.day ||
          r.day.includes(d) ||
          r.day.includes('everyday') ||
          ((d === 'sat' || d === 'sun') && r.day.includes('weekend')) ||
          (d !== 'sat' && d !== 'sun' && r.day.includes('weekday'))
      );
      _.set<ReviewerDict>(reviewerDict, [g, d], availableReviewers);
    });
  });
  return reviewerDict;
};

export const selectReviewers = (
  numOfReviewers: NumOfReviewersType,
  reviewers: ReviewerType[],
  PR: PR
): string[] => {
  const reviewerDict = generateDictFromConfig(reviewers);

  const selectedReviewers: ReviewerType[] = [];
  Object.keys(reviewerDict).forEach((d) => {
    selectedReviewers.concat(
      _.sampleSize(
        reviewerDict[d][
          format(new Date(), 'iii').toLowerCase() as typeof dayOfWeek[number]
        ].filter((r) => r.name != PR.user.login),
        numOfReviewers[d]
      )
    );
  });

  return selectedReviewers.map((r) => r.name);
};

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

export type PR = {
  user: {
    login: string;
  };
  title: string;
  // eslint-disable-next-line camelcase
  requested_reviewers: {
    login: string;
  }[];
  draft: boolean;
};

const getPR = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  prNum: number
): Promise<PR | null> => {
  const { data } = await octokit.pulls.get({
    owner,
    repo,
    // eslint-disable-next-line camelcase
    pull_number: prNum,
  });
  return data;
};

export const skipCondition = (PR: PR | null, config: Config) => {
  if (!PR) {
    return true;
  }
  // if PR is draft, skip
  if (PR.draft) {
    return true;
  }
  // if PR's title contains WIP/wip, skip
  if (PR.title.includes('WIP') || PR.title.includes('wip')) {
    return true;
  }
  // if num of requested reviewers are already more than config.numOfReviewers.must + config.numOfReviewers.other, skip
  if (
    PR.requested_reviewers.length >=
    config.numOfReviewers.must + config.numOfReviewers.other
  ) {
    return true;
  }
  return false;
};

export const assignReviewers = async (
  octokit: Octokit,
  config: Config
): Promise<void> => {
  const { numOfReviewers, reviewers } = config;
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  const prNum = Number(
    (process.env.GITHUB_REF || '').split('refs/pull/')[1].split('/')[0]
  );
  const PR: PR | null = await getPR(octokit, owner, repo, prNum);
  if (skipCondition(PR, config)) {
    info(`skip to assign reviewers`);
    return;
  }
  const nameOfSelectedReviewers = selectReviewers(
    numOfReviewers,
    reviewers,
    PR!
  );
  info(
    `Added reviewers to PR #${prNum}: ${nameOfSelectedReviewers.join(', ')}`
  );
  await setReviewers(octokit, nameOfSelectedReviewers);
};
