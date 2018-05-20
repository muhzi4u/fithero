/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import Screen from '../components/Screen';
import type { NavigationType } from '../types';
import DayRow from './Home/DayRow';
import { dateToString, getCurrentWeek, getToday } from '../utils/date';
import { getWorkoutsByRange } from '../database/WorkoutService';
import WorkoutList from './Home/WorkoutList';
import type { WorkoutSchemaType } from '../database/types';

type Props = {
  dispatch: () => void,
  navigation: NavigationType,
  workouts: { [date: string]: WorkoutSchemaType },
};

type State = {
  currentWeek: Array<Date>,
  selectedDay: string,
};

class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const today = getToday();
    this.state = {
      selectedDay: dateToString(today),
      currentWeek: getCurrentWeek(today),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { currentWeek } = this.state;

    getWorkoutsByRange(dispatch, currentWeek[0], currentWeek[6]);
  }

  _onAddExercises = () => {
    this.props.navigation.push('Exercises');
  };

  _onDaySelected = dateString => {
    this.setState({ selectedDay: dateString });
  };

  render() {
    const { workouts } = this.props;
    const { selectedDay } = this.state;
    const workout = workouts[selectedDay];

    return (
      <Screen>
        <DayRow
          selected={this.state.selectedDay}
          currentWeek={this.state.currentWeek}
          onDaySelected={this._onDaySelected}
        />
        {workout && <WorkoutList workout={workout} />}
        <FAB icon="add" onPress={this._onAddExercises} style={styles.fab} />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});

export default withNavigation(
  connect(state => ({ workouts: state.workouts }), null)(HomeScreen)
);