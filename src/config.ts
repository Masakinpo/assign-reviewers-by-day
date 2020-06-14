import { getInput, setFailed, error } from '@actions/core';
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

export type ReviewerType = {
  name: string;
  group: string[];
  day?: Array<typeof listOfValidDay[number]>;
};

export type NumOfReviewersType = {
  [key in ReviewerType['group'][number]]: number;
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
  // validate day
  if (
    config.reviewers.some(
      (r) => !!r.day && r.day.some((d) => !listOfValidDay.includes(d!))
    )
  ) {
    error('Invalid day is included');
    return false;
  }

  // numOfReviewers must be provided
  if (
    !config.numOfReviewers ||
    !config.numOfReviewers.must ||
    !config.numOfReviewers.other
  ) {
    error('Invalid numOfReviewers');
    return false;
  }

  // validate duplicated name
  if (_.uniqBy(config.reviewers, 'name').length !== config.reviewers.length) {
    error('Duplicated name');
    return false;
  }
  return true;
};
