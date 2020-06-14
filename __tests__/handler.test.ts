import {
  generateDictFromConfig,
  PR,
  selectReviewers,
  skipCondition,
} from '../src/handler';
import { Config, NumOfReviewersType, ReviewerType } from '../src/config';
import _ from 'lodash';

const barcelona: ReviewerType[] = [
  {
    name: 'messi',
    group: 'barcelona',
    day: ['weekday'],
  },
  {
    name: 'iniesta',
    group: 'barcelona',
    day: ['tue', 'thu'],
  },
];

const reviewers: ReviewerType[] = [
  ...barcelona,
  {
    name: 'cr7',
    group: 'juventus',
    day: ['mon', 'wed', 'fri'],
  },
  {
    name: 'aubameyang',
    group: 'arsenal',
    day: ['weekend'],
  },
];

describe('generateDictFromConfig test', () => {
  test('valid config', () => {
    expect(generateDictFromConfig(reviewers)).toEqual({
      barcelona: {
        mon: [{ day: ['weekday'], group: 'barcelona', name: 'messi' }],
        tue: [
          { day: ['weekday'], group: 'barcelona', name: 'messi' },
          { day: ['tue', 'thu'], group: 'barcelona', name: 'iniesta' },
        ],
        wed: [{ day: ['weekday'], group: 'barcelona', name: 'messi' }],
        thu: [
          { day: ['weekday'], group: 'barcelona', name: 'messi' },
          { day: ['tue', 'thu'], group: 'barcelona', name: 'iniesta' },
        ],
        fri: [{ day: ['weekday'], group: 'barcelona', name: 'messi' }],
        sat: [],
        sun: [],
      },
      juventus: {
        mon: [{ day: ['mon', 'wed', 'fri'], group: 'juventus', name: 'cr7' }],
        tue: [],
        wed: [{ day: ['mon', 'wed', 'fri'], group: 'juventus', name: 'cr7' }],
        thu: [],
        fri: [{ day: ['mon', 'wed', 'fri'], group: 'juventus', name: 'cr7' }],
        sat: [],
        sun: [],
      },
      arsenal: {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [{ name: 'aubameyang', group: 'arsenal', day: ['weekend'] }],
        sun: [{ name: 'aubameyang', group: 'arsenal', day: ['weekend'] }],
      },
    });
  });
});

const reviewers2: ReviewerType[] = [
  {
    name: 'messi',
    group: 'gods',
  },
  {
    name: 'zlatan',
    group: 'gods',
  },
  {
    name: 'cr7',
    group: 'gods',
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
    [
      0,
      'case2: mon',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      1,
      'case2: tue',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      2,
      'case2: wed',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      3,
      'case2: thu',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      4,
      'case2: fri',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      5,
      'case2: sat',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
    [
      6,
      'case2: sun',
      { gods: 2 },
      reviewers2,
      ['messi', 'cr7'],
      ['messi', 'zlatan'],
      ['zlatan', 'cr7'],
    ],
  ] as Array<
    [
      number,
      string,
      NumOfReviewersType,
      ReviewerType[],
      string[],
      string[],
      string[]
    ]
  >;

  test.each(testTable)(
    '%i: %s',
    (num, testName, numOfReviewers, reviewers, ...expected) => {
      now.setDate(now.getDate() + num);
      const selectedReviewers = selectReviewers(numOfReviewers, reviewers, {
        draft: false,
        requested_reviewers: [],
        title: '',
        user: { login: '' },
      }).sort();
      expect(expected.some((e) => _.isEqual(e.sort(), selectedReviewers))).toBe(
        true
      );
    }
  );
});

describe('selectReviewers: some reviewer is already requested', () => {
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
    [0, 'case2: mon', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [1, 'case2: tue', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [2, 'case2: wed', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [3, 'case2: thu', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [4, 'case2: fri', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [5, 'case2: sat', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
    [6, 'case2: sun', { gods: 2 }, reviewers2, ['cr7'], ['zlatan']],
  ] as Array<
    [number, string, NumOfReviewersType, ReviewerType[], string[], string[]]
  >;

  test.each(testTable)(
    '%i: %s',
    (num, testName, numOfReviewers, reviewers, ...expected) => {
      now.setDate(now.getDate() + num);
      const selectedReviewers = selectReviewers(numOfReviewers, reviewers, {
        draft: false,
        requested_reviewers: [{ login: 'messi' }],
        title: '',
        user: { login: '' },
      }).sort();
      expect(expected.some((e) => _.isEqual(e.sort(), selectedReviewers))).toBe(
        true
      );
    }
  );
});

describe('selectReviewers: exclude author', () => {
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
    [0, 'mon', { barcelona: 1 }, barcelona, []],
    [1, 'tue', { barcelona: 1 }, barcelona, ['iniesta']],
    [2, 'wed', { barcelona: 1 }, barcelona, []],
    [3, 'thu', { barcelona: 1 }, barcelona, ['iniesta']],
    [4, 'fri', { barcelona: 1 }, barcelona, []],
    [5, 'sat', { barcelona: 1 }, barcelona, []],
    [6, 'sun', { barcelona: 1 }, barcelona, []],
  ] as Array<[number, string, NumOfReviewersType, ReviewerType[], string[]]>;

  test.each(testTable)(
    '%i: %s',
    (num, testName, numOfReviewers, reviewers, ...expected) => {
      now.setDate(now.getDate() + num);
      const selectedReviewers = selectReviewers(numOfReviewers, reviewers, {
        draft: false,
        requested_reviewers: [],
        title: '',
        user: { login: 'messi' },
      }).sort();
      expect(expected.some((e) => _.isEqual(e.sort(), selectedReviewers))).toBe(
        true
      );
    }
  );
});

describe('skipCondition', () => {
  const testTable = [
    [
      'PR is draft',
      {
        draft: true,
        requested_reviewers: [],
        title: '',
        user: { login: '' },
      },
      {
        reviewers: [],
        numOfReviewers: {},
      },
      true,
    ],
    [
      'PR title includes WIP',
      {
        draft: false,
        requested_reviewers: [],
        title: 'WIP amazing changes',
        user: { login: '' },
      },
      {
        reviewers: [],
        numOfReviewers: {},
      },
      true,
    ],
    [
      'PR title includes wip',
      {
        draft: false,
        requested_reviewers: [],
        title: 'wip amazing changes',
        user: { login: '' },
      },
      {
        reviewers: [],
        numOfReviewers: {},
      },
      true,
    ],
  ] as Array<[string, PR, Config, boolean]>;

  test.each(testTable)('%s', (name, pr, config, expected) => {
    expect(skipCondition(pr, config)).toBe(expected);
  });
});
