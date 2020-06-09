import { Config, validateConfig } from './../src/config';

//TODO
// add test for validateConfig

describe('validate config test', () => {
  const config: Config = {
    reviewers: [{ name: 'messi', kind: 'must', day: ['mon'] }],
    numOfReviewers: { must: 1, other: 1 },
  };
  expect(validateConfig(config)).toBe(true);
})
