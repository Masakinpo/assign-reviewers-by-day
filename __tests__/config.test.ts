import { validateConfig } from './../src/config';

describe('validate config test', () => {
  test('valid config', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            kind: 'must',
            day: ['everyday'],
          },
          {
            name: 'cr7',
            day: ['mon', 'tue', 'wed'],
          },
          {
            name: 'cr7',
            day: ['mon', 'tue', 'wed'],
          },
          {
            name: 'zlatan',
            day: ['fri'],
          },
          {
            name: 'aubameyang',
            day: ['weekend'],
          },
        ],
        numOfReviewers: { must: 1, other: 2 },
      })
    ).toBe(true);
  });

  test('invalid config: invalid must numOfReviewers', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            kind: 'must',
            day: ['everyday'],
          },
        ],
        numOfReviewers: { must: 2, other: 0 },
      })
    ).toBe(false);
  });

  test('invalid config: invalid other numOfReviewers', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            day: ['everyday'],
          },
        ],
        numOfReviewers: { must: 0, other: 2 },
      })
    ).toBe(false);
  });

  test('invalid config: 0 numOfReviewers in total', () => {
    expect(
      validateConfig({
        reviewers: [],
        numOfReviewers: { must: 0, other: 0 },
      })
    ).toBe(false);
  });

  test('invalid config: invalid day', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            kind: 'must',
            // @ts-ignore
            day: ['freitag'],
          },
        ],
        numOfReviewers: { must: 1, other: 0 },
      })
    ).toBe(false);
  });
});
