import { generateDictFromConfig, selectReviewers } from '../src/handler';
import { NumOfReviewersType, ReviewerType } from '../src/config';
import _ from 'lodash';

const reviewers: ReviewerType[] = [
  {
    name: 'messi',
    kind: 'must',
    day: ['weekday'],
  },
  {
    name: 'cr7',
    day: ['mon', 'wed', 'fri'],
  },
  {
    name: 'zlatan',
    day: ['tue', 'thu'],
  },
  {
    name: 'aubameyang',
    kind: 'must',
    day: ['weekend'],
  },
];

describe('generateDictFromConfig test', () => {
  test('valid config', () => {
    expect(generateDictFromConfig(reviewers)).toEqual({
      must: {
        mon: [{ day: ['weekday'], kind: 'must', name: 'messi' }],
        tue: [{ day: ['weekday'], kind: 'must', name: 'messi' }],
        wed: [{ day: ['weekday'], kind: 'must', name: 'messi' }],
        thu: [{ day: ['weekday'], kind: 'must', name: 'messi' }],
        fri: [{ day: ['weekday'], kind: 'must', name: 'messi' }],
        sat: [{ day: ['weekend'], kind: 'must', name: 'aubameyang' }],
        sun: [{ day: ['weekend'], kind: 'must', name: 'aubameyang' }],
      },
      other: {
        mon: [{ day: ['mon', 'wed', 'fri'], name: 'cr7' }],
        tue: [{ day: ['tue', 'thu'], name: 'zlatan' }],
        wed: [{ day: ['mon', 'wed', 'fri'], name: 'cr7' }],
        thu: [{ day: ['tue', 'thu'], name: 'zlatan' }],
        fri: [{ day: ['mon', 'wed', 'fri'], name: 'cr7' }],
        sat: [],
        sun: [],
      },
    });
  });
});

const reviewers2: ReviewerType[] = [
  {
    name: 'messi',
  },
  {
    name: 'iniesta',
  },
  {
    name: 'cr7',
  },
];

const reviewers3: ReviewerType[] = [
  {
    name: 'messi',
    day: ['weekday'],
  },
  {
    name: 'iniesta',
    day: ['fri', 'sat'],
  },
  {
    name: 'cr7',
    day: ['mon', 'wed', 'fri'],
  },
  {
    name: 'zlatan',
    day: ['mon', 'tue', 'thu'],
  },
  {
    name: 'aubameyang',
    day: ['weekend'],
  },
];

describe('selectReviewers', () => {
  const OriginalDate = Date;
  let now: Date;
  let spiedDate: jest.SpyInstance;

  beforeEach(() => {
    now = new OriginalDate('2020/6/8 12:00:00'); // Monday
    spiedDate = jest.spyOn(global, 'Date').mockImplementation(
      // @ts-ignore
      () => now
    );
  });

  afterEach(() => {
    spiedDate.mockRestore();
  });

  const testTable = [
    [0, 'case1: mon', { must: 1, other: 1 }, reviewers, ['messi', 'cr7']],
    [1, 'case1: tue', { must: 1, other: 1 }, reviewers, ['messi', 'zlatan']],
    [2, 'case1: wed', { must: 1, other: 1 }, reviewers, ['messi', 'cr7']],
    [3, 'case1: thu', { must: 1, other: 1 }, reviewers, ['messi', 'zlatan']],
    [4, 'case1: fri', { must: 1, other: 1 }, reviewers, ['messi', 'cr7']],
    [5, 'case1: sat', { must: 1, other: 1 }, reviewers, ['aubameyang', 'cr7']],
    [6, 'case1: sun', { must: 1, other: 1 }, reviewers, ['aubameyang', 'cr7']],
    [
      0,
      'case2: mon',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      1,
      'case2: tue',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      2,
      'case2: wed',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      3,
      'case2: thu',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      4,
      'case2: fri',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      5,
      'case2: sat',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      6,
      'case2: sun',
      { must: 0, other: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      0,
      'case3: mon',
      { must: 0, other: 2 },
      reviewers3,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [1, 'case3: tue', { must: 0, other: 2 }, reviewers3, ['messi', 'zlatan']],
    [2, 'case3: wed', { must: 0, other: 2 }, reviewers3, ['messi', 'cr7']],
    [3, 'case3: thu', { must: 0, other: 2 }, reviewers3, ['messi', 'zlatan']],
    [
      4,
      'case3: fri',
      { must: 0, other: 2 },
      reviewers3,
      ['messi', 'cr7'],
      ['messi', 'iniesta'],
      ['iniesta', 'cr7'],
    ],
    [
      5,
      'case3: sat',
      { must: 0, other: 2 },
      reviewers3,
      ['aubameyang', 'iniesta'],
    ],
    [
      6,
      'case3: sun',
      { must: 0, other: 2 },
      reviewers3,
      ['aubameyang', 'messi'],
      ['aubameyang', 'zlatan'],
      ['aubameyang', 'cr7'],
    ],
  ] as Array<[number, string, NumOfReviewersType, ReviewerType[], string[]]>;

  test.each(testTable)(
    '%i: %s',
    (num, testName, numOfReviewers, reviewers, ...expected) => {
      now.setDate(now.getDate() + num);
      const selectedReviewers = selectReviewers(
        numOfReviewers,
        reviewers
      ).sort();
      expect(expected.some((e) => _.isEqual(e.sort(), selectedReviewers))).toBe(
        true
      );
    }
  );
});
