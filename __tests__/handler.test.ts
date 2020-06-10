import { generateDictFromConfig, selectReviewers } from '../src/handler';
import { format } from 'date-fns';

// TODO
// add test for generateDictFromConfig

describe('generateDictFromConfig test', () => {
  test('valid config', () => {
    expect(
      generateDictFromConfig([
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
          name: 'zlatan',
          day: ['fri'],
        },
        {
          name: 'aubameyang',
          day: ['weekend'],
        },
      ])
    ).toEqual({
      must: {
        mon: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        tue: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        wed: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        thu: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        fri: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        sat: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
        sun: [{ day: ['everyday'], kind: 'must', name: 'messi' }],
      },
      other: {
        mon: [{ day: ['mon', 'tue', 'wed'], name: 'cr7' }],
        tue: [{ day: ['mon', 'tue', 'wed'], name: 'cr7' }],
        wed: [{ day: ['mon', 'tue', 'wed'], name: 'cr7' }],
        thu: [],
        fri: [{ day: ['fri'], name: 'zlatan' }],
        sat: [{ day: ['weekend'], name: 'aubameyang' }],
        sun: [{ day: ['weekend'], name: 'aubameyang' }],
      },
    });
  });
});
// add test for selectReviewers

describe('selectReviewers test', () => {
  // const today = new Date();
  // const youbi: string = format(today, 'iii').toLowerCase();

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  for (let i in days) {
    let youbi = days[i];
    let result: string[];
    switch (youbi) {
      case 'mon':
        result = ['messi', 'cr7'];
        break;
      case 'tue':
        result = ['messi', 'cr7'];
        break;
      case 'wed':
        result = ['messi', 'cr7'];
        break;
      case 'thu':
        result = ['messi', 'zlatan'];
        break;
      case 'fri':
        result = ['messi', 'zlatan'];
        break;
      case 'sat':
        result = ['messi', 'aubameyang'];
        break;
      case 'sun':
        result = ['messi', 'aubameyang'];
        break;
    }

    test(`${youbi} selectReviewers`, () => {
      expect(
        selectReviewers({ must: 1, other: 1 }, [
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
            name: 'zlatan',
            day: ['fri'],
          },
          {
            name: 'aubameyang',
            day: ['weekend'],
          },
        ])
      ).toEqual(result);
    });
  }
});
