import { validateConfig } from './../src/config';

//TODO
// add test for validateConfig

describe('validate config test', () => {
  //TODO test名よさげに変えたほうがいいかも
  test('valid config: hoge', () => {
    expect(validateConfig({
      reviewers: [{ name: 'messi', kind: 'must', day: ['mon']}],
      numOfReviewers: { must: 1, other: 0 },
    })).toBe(true);
  })

  test('valid config: hogehoge', () => {
    expect(validateConfig({
      reviewers: [{ name: 'cr7', kind: 'must', day: ['mon', 'tue', 'wed']}],
      numOfReviewers: { must: 1, other: 0 },
    })).toBe(true);
  })

  test('invalid config: hogehogehoge', () => {
    expect(validateConfig({
      reviewers: [{ name: 'zlatan', day: ['mon', 'tue', 'wed']}],
      numOfReviewers: { must: 1, other: 0 },
    })).toBe(false);
  })

  test('valid config: just name', () => {
    expect(validateConfig({
      reviewers: [{ name: 'zlatan'}],
      numOfReviewers: { must: 0, other: 1 },
    })).toBe(true);
  })

  test('invalid config: 0 numOfReviewers in total', () => {
    expect(validateConfig({
      reviewers: [{ name: 'aubameyang'}],
      numOfReviewers: { must: 0, other: 0 },
    })).toBe(false);
  })
})
