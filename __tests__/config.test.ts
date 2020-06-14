import { validateConfig } from './../src/config';

describe('validate config test', () => {
  test('valid config', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            group: 'barcelona',
            day: ['everyday'],
          },
          {
            name: 'iniesta',
            group: 'barcelona',
            day: ['mon', 'tue', 'wed'],
          },
          {
            name: 'cr7',
            group: 'juventus',
            day: ['weekday'],
          },
          {
            name: 'zlatan',
            group: 'milan',
            day: ['fri'],
          },
        ],
        numOfReviewers: { barcelona: 1, juventus: 1, milan: 1 },
      })
    ).toBe(true);
  });

  test('invalid config: 0 numOfReviewers in total', () => {
    expect(
      validateConfig({
        reviewers: [],
        numOfReviewers: { must: 0, other: 0 },
      })
    ).toBe(false);
  });

  test('invalid config: numOfReviewers must be provided for all groups', () => {
    expect(
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            group: 'barcelona',
            day: ['everyday'],
          },
          {
            name: 'iniesta',
            group: 'barcelona',
            day: ['mon', 'tue', 'wed'],
          },
          {
            name: 'cr7',
            group: 'juventus',
            day: ['weekday'],
          },
          {
            name: 'zlatan',
            group: 'milan',
            day: ['fri'],
          },
        ],
        numOfReviewers: { barcelona: 1 },
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
