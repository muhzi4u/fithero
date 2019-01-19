/* @flow */

import type { SetSchemaType } from '../types';
import {
  ADD_SET,
  getSet,
  removeSet,
  UPDATE_SET,
} from '../../redux/modules/workouts';
import realm from '../index';
import { getExerciseSchemaIdFromSet } from '../utils';
import type { DispatchType } from '../../types';
import { deleteExercise } from './ExerciseService';

export const getMaxSetByType = (type: string) =>
  realm
    .objects('Set')
    .filtered('type = $0', type)
    .sorted([['weight', true], 'date', 'id']);

export const addSet = (
  dispatch: (DispatchType<SetSchemaType>) => void,
  set: SetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(ADD_SET, set));

  realm.write(() => {
    const exerciseId = getExerciseSchemaIdFromSet(set.id);
    const exercise = realm.objectForPrimaryKey('Exercise', exerciseId);
    exercise.sets.push(set);
  });
};

export const updateSet = (
  dispatch: (DispatchType<SetSchemaType>) => void,
  updatedSet: SetSchemaType
) => {
  // Optimistic update to Redux
  dispatch(getSet(UPDATE_SET, updatedSet));

  realm.write(() => {
    const set = realm.objectForPrimaryKey('Set', updatedSet.id);
    set.weight = updatedSet.weight;
    set.reps = updatedSet.reps;
  });
};

export const deleteSet = (
  dispatch: (DispatchType<string>) => void,
  setId: string
) => {
  // Optimistic update to Redux
  dispatch(removeSet(setId));

  // Database, if last set, delete exercise, if last exercise, delete workout
  realm.write(() => {
    const setToDelete = realm.objectForPrimaryKey('Set', setId);
    realm.delete(setToDelete);
    // After deleting set, check if we need to delete the whole exercise
    const exerciseId = getExerciseSchemaIdFromSet(setId);
    const exercise = realm.objectForPrimaryKey('Exercise', exerciseId);
    if (exercise.sets.length === 0) {
      deleteExercise(exercise);
    }
  });
};

export const getLastSetByType = (type: ?string) =>
  realm
    .objects('Set')
    .filtered('type = $0', type)
    .sorted([['date', true], ['id', true]]);
