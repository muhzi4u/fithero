/* @flow */

import { toDate } from '../../../../utils/date';

// eslint-disable-next-line flowtype/no-weak-types
export class RealmArray extends Array<any> {
  // eslint-disable-next-line flowtype/no-weak-types
  filtered: (arg: string) => Array<any>;
  // eslint-disable-next-line flowtype/no-weak-types
  constructor(...values: any) {
    super(...values);
    this.filtered = (arg: string) => {
      const id = arg.split('"')[1];
      return values.filter(v => v.id === id);
    };
  }
  // eslint-disable-next-line flowtype/no-weak-types
  push: (val: any) => number = jest.fn();
}

export const dates = [
  {
    dateString: '2018-05-04T00:00:00.000Z',
    date: toDate('2018-05-04T00:00:00.000Z'),
  },
];

export const mockSets = new RealmArray({
  id: `${dates[0].dateString}_bench-press_001`,
  reps: 18,
  weight: 100,
  date: dates[0].date,
  type: 'bench-press',
});

export const mockMultipleSets = new RealmArray(
  {
    id: `${dates[0].dateString}_bench-press_001`,
    reps: 18,
    weight: 100,
    date: dates[0].date,
    type: 'bench-press',
  },
  {
    id: `${dates[0].dateString}_bench-press_002`,
    reps: 15,
    weight: 100,
    date: dates[0].date,
    type: 'bench-press',
  }
);

export const getMockExercises = (sets: RealmArray) =>
  new RealmArray({
    id: `${dates[0].dateString}_bench-press`,
    sets,
    date: dates[0].date,
    type: 'bench-press',
    sort: 1,
  });

export const mockWorkouts = [
  {
    id: dates[0].dateString,
    date: dates[0].date,
    exercises: getMockExercises(mockSets),
  },
  {
    // Won't happen in DB but we use it for testing deletions
    id: dates[0].dateString,
    date: dates[0].date,
    exercises: new RealmArray(),
  },
];

export const mockRealmWorkout = {
  id: dates[0].dateString,
  date: dates[0].date,
  exercises: new RealmArray(),
};
