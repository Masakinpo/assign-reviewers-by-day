import { getInput, setFailed } from "@actions/core";
import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'

type ReviewerType = {
  name: string
  kind?: "must"
  day: "mon"| "tue" | "wed" | "thu" | "fri"| "sat" | "sun"
    | "weekday"
    | "weekend"
    | "everyday"
}

type NumOfReviewersType = {
  must: number
  other: number
}

export type Config = {
  reviewers: ReviewerType[]
  numOfReviewers: NumOfReviewersType
}

export const getConfig = (): Config | null => {
  const configPath = getInput('config', {required: true})

  try {
    return safeLoad(readFileSync(configPath, 'utf8'))
  } catch (error) {
    setFailed(error.message)
  }

  return null
}

export const validateConfig = (config: Config): boolean => {
  //TODO
  // add validation of config
  // for example, listed reviewers are less than numOfReviewers ...
  const needs_must: number = config.numOfReviewers.must;
  const needs_other: number = config.numOfReviewers.other;
  const must_reviewers: number = Object.keys(config.reviewers.filter(e => e.kind == 'must')).length;
  const other_reviewers: number = Object.keys(config.reviewers.filter(e => e.kind == null)).length;

  //condition1
  if (needs_must + needs_other < 1)
    return false;
  //condition2
  if (must_reviewers < needs_must)
    return false;
  //condition3
  if (other_reviewers < needs_other)
    return false;

  return true
}
