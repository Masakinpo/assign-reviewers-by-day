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
