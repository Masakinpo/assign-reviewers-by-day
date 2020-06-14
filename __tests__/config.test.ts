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
        numOfReviewers: [{ barcelona: 1 }, { milan: 1 }, { juventus: 1 }],
      })
    ).toBe(true);
  });

  test('invalid config: numOfReviewers must be number', () => {
    expect(() =>
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
        // @ts-ignore
        numOfReviewers: [{ barcelona: 1, juventus: 'invalid', milan: 1 }],
      })
    ).toThrowError(/numOfGroup must be provided for all groups:/);
  });

  test('invalid config: numOfReviewers must be provided for all groups', () => {
    expect(() =>
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
        numOfReviewers: [{ barcelona: 1 }],
      })
    ).toThrowError(/numOfGroup must be provided for all groups:/);
  });

  test('invalid config: no numOfReviewers', () => {
    expect(() =>
      // @ts-ignore
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            group: 'gods',
            day: ['fri'],
          },
        ],
      })
    ).toThrowError(/numOfGroup must be provided for all groups:/);
  });

  test('invalid config: invalid day', () => {
    expect(() =>
      validateConfig({
        reviewers: [
          {
            name: 'messi',
            group: 'gods',
            // @ts-ignore
            day: ['freitag'],
          },
        ],
        numOfReviewers: [{ gods: 1 }],
      })
    ).toThrowError(/Invalid day is included/);
  });
});
