import { getInput, setFailed } from '@actions/core';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import _ from 'lodash';

export const dayOfWeek = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
] as const;

const listOfValidDay = [
  ...dayOfWeek,
  'weekday',
  'weekend',
  'everyday',
] as const;

export type ReviewerType<T extends string> = {
  name: string;
  group: T;
  day?: Array<typeof listOfValidDay[number]>;
};

export type NumOfReviewersType<T extends string> = {
  [key in T]: number;
};

export type Config<T extends string[]> = {
  reviewers: ReviewerType<T[number]>[];
  numOfReviewers: NumOfReviewersType<T[number]>[];
};

export const getConfig = (): Config<string[]> | null => {
  const configPath = getInput('config', { required: true });

  try {
    return safeLoad(readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(error.message);
  }

  return null;
};

export const validateConfig = (config: Config<string[]>): boolean => {
  // validate day
  if (
    config.reviewers.some(
      (r) => !!r.day && r.day.some((d) => !listOfValidDay.includes(d!))
    )
  ) {
    throw new Error(
      `Invalid day is included: ${config.reviewers.map((r) => r.day)}`
    );
  }

  if (
    !config.numOfReviewers ||
    !_.isEqual(
      _.uniq(config.reviewers.map((r) => r.group)).sort(),
      _.uniq(config.numOfReviewers.map((r) => Object.keys(r)[0])).sort()
    ) ||
    config.numOfReviewers.some((r) => !Number.isInteger(Object.values(r)[0]))
  ) {
    throw new Error(
      `numOfGroup must be provided for all groups: ${JSON.stringify(config)}`
    );
  }
  return true;
};
