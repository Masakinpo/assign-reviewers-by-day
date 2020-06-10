import { generateDictFromConfig, selectReviewers } from '../src/handler';
import { ReviewerType } from '../src/config';
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

describe('selectReviewers test1', () => {
  const numOfReviewers = { must: 1, other: 1 };

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
    [0, 'mon', ['messi', 'cr7']],
    [1, 'tue', ['messi', 'zlatan']],
    [2, 'wed', ['messi', 'cr7']],
    [3, 'thu', ['messi', 'zlatan']],
    [4, 'fri', ['messi', 'cr7']],
    [5, 'sat', ['aubameyang', 'cr7']],
    [6, 'sun', ['aubameyang', 'cr7']],
  ];

  test.each(testTable)('%i: %s', (num, dayOfWeek, ...expected) => {
    now.setDate(now.getDate() + (num as number));
    const selectedReviewers = selectReviewers(numOfReviewers, reviewers).sort();
    console.info(selectedReviewers);
    expect(
      expected.some((e) => _.isEqual((e as string[]).sort(), selectedReviewers))
    ).toBe(true);
  });
});

describe('selectReviewers test2', () => {
  const numOfReviewers = { must: 0, other: 2 };
  const reviewers: ReviewerType[] = [
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
    [0, 'mon', ['messi', 'cr7'], ['messi', 'zlatan'], ['zlatan', 'cr7']],
    [1, 'tue', ['messi', 'zlatan']],
    [2, 'wed', ['messi', 'cr7']],
    [3, 'thu', ['messi', 'zlatan']],
    [4, 'fri', ['messi', 'cr7'], ['messi', 'iniesta'], ['iniesta', 'cr7']],
    [5, 'sat', ['aubameyang', 'iniesta']],
    [
      6,
      'sun',
      ['aubameyang', 'messi'],
      ['aubameyang', 'zlatan'],
      ['aubameyang', 'cr7'],
    ],
  ];

  test.each(testTable)('%i: %s', (num, dayOfWeek, ...expected) => {
    now.setDate(now.getDate() + (num as number));
    const selectedReviewers = selectReviewers(numOfReviewers, reviewers).sort();
    console.info(selectedReviewers);
    expect(
      expected.some((e) => _.isEqual((e as string[]).sort(), selectedReviewers))
    ).toBe(true);
  });
});
