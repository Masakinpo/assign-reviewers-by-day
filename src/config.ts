import { getInput, setFailed, error } from '@actions/core';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';

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

const kindType = 'must' as const;

export type ReviewerType = {
  name: string;
  kind?: typeof kindType;
  day?: Partial<typeof listOfValidDay>;
};

export type NumOfReviewersType = {
  must: number;
  other: number;
};

export type Config = {
  reviewers: ReviewerType[];
  numOfReviewers: NumOfReviewersType;
};

export const getConfig = (): Config | null => {
  const configPath = getInput('config', { required: true });

  try {
    return safeLoad(readFileSync(configPath, 'utf8'));
  } catch (error) {
    setFailed(error.message);
  }

  return null;
};

export const validateConfig = (config: Config): boolean => {
  // validate number of reviewers
  const {
    must: expectedNumMustReviewer,
    other: expectedNumOtherReviewer,
  } = config.numOfReviewers;
  const numMustReviewers = config.reviewers.filter((e) => e.kind === 'must')
    .length;
  const numOtherReviewers = config.reviewers.length - numMustReviewers;

  if (
    config.reviewers.length < 1 ||
    numMustReviewers < expectedNumMustReviewer ||
    numOtherReviewers < expectedNumOtherReviewer ||
    expectedNumMustReviewer + expectedNumOtherReviewer < 1
  ) {
    error("Invalid number of reviewers")
    return false;
  }

  // validate day
  if (config.reviewers.some(
    (r) => !!r.day && r.day.some(d => !listOfValidDay.includes(d!)))) {
    error("Invalid day is included")
    return false;
  }
  return true
};
