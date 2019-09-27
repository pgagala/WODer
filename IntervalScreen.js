import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Text,
} from 'react-native';

import { Asset, Audio, Font } from 'expo';

import { Button, Icon } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants } from 'expo';

import { Card } from 'react-native-paper';
import { Picker, DatePicker } from 'react-native-wheel-pick';
import WorkoutUnit from './components/WorkoutUnit';
import WorkoutUnitOverly from './components/WorkoutUnitOverly';
import GradientHeader from './components/GradientHeader';

const roundSound = new Audio.Sound();
const restSound = new Audio.Sound();
const finishSound = new Audio.Sound();
const countdownSound = new Audio.Sound();

export const BUTTON_GRADIENT_PROPS = {
  colors: ['#4c669f', '#3b5998', '#192f6a', '#123'],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

export default class IntervalScreen extends React.Component {
  static navigationOptions = {
    header: props => <GradientHeader navigation={props.navigation} />,
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await roundSound.loadAsync(require('./assets/sounds/round.mp3'));
    await restSound.loadAsync(require('./assets/sounds/rest.mp3'));
    await finishSound.loadAsync(require('./assets/sounds/finish.mp3'));
    await countdownSound.loadAsync(require('./assets/sounds/beep.wav'));
  }
  state = {
    initialSecondsCountdownAmount: 3,
    initialSecondsCounterVisible: false,
    workoutUnitTimeInSeconds: 30,
    workoutUnitTimeInMinutes: 0,
    workoutUnits: [],
    workoutUnitsCopyBeforeStart: [],
    addWorkoutUnitVisible: false,
    editWorkoutUnitVisible: false,
    editedWorkoutUnitTimeInSeconds: -1,
    editedworkoutUnitTimeInMinutes: -1,
    editedworkoutUnitId: -1,
    workoutRunning: false,
    addWorkoutUnitTypeFunction: null,
    menuVisible: false,
  };

  async _play(_sound) {
    try {
      await _sound.playFromPositionAsync(0);
    } catch (error) {
      console.log('Error: ' + error);
    }
  }

  _handleAddWorkoutUnit = (timeInMinutes, timeInSeconds, type, multiplier) => {
    for (var i = 0; i < multiplier; i++) {
      var newId =
        this.state.workoutUnits.length == 0
          ? 0
          : this.state.workoutUnits[this.state.workoutUnits.length - 1].id + 1;
      this.state.workoutUnits.push({
        id: newId,
        type: type,
        minutes: timeInMinutes,
        seconds: timeInSeconds,
      });
    }

    this.setState({ workoutUnits: this.state.workoutUnits });
  };

  _handleEditRound = (timeInMinutes, timeInSeconds) => {
    this.setState(prevState => ({
      workoutUnits: this._updateWorkoutUnit(
        this.state.editedworkoutUnitId,
        prevState,
        timeInMinutes,
        timeInSeconds
      ),
    }));
  };

  _updateWorkoutUnit = (
    idToReplace,
    prevState,
    timeInMinutes,
    timeInSeconds
  ) => {
    //console.log(timeInMinutes +' : ' + timeInSeconds);
    var workoutUnitToEdit = prevState.workoutUnits.filter(
      el => el.id == idToReplace
    )[0];
    // console.log('x workout unit to edit: ' + JSON.stringify(workoutUnitToEdit));
    //this._removeWorkoutUnit(idToReplace);
    this.state.workoutUnits.splice(idToReplace, 1, {
      id: workoutUnitToEdit.id,
      type: workoutUnitToEdit.type,
      minutes: timeInMinutes,
      seconds: timeInSeconds,
    });

    return this.state.workoutUnits;
  };

  _removeWorkoutUnit = id => {
    this.setState(
      prevState => ({
        workoutUnits: this._workoutUnitsWithoutWorkoutUnitId(id, prevState),
      }),

      () => {
        return this.state.workoutUnits;
      }
    );
  };

  _editWorkoutUnit = (id, minutes, seconds) => {
    // console.log('edit workout: ' + id + '.  Time:  ' + minutes + ':' + seconds);
    this.setState(
      {
        editedWorkoutUnitTimeInSeconds: seconds,
        editedworkoutUnitTimeInMinutes: minutes,
        editedworkoutUnitId: id,
      },
      () => {
        this.setState({
          editWorkoutUnitVisible: true,
        });
      }
    );
  };

  _workoutUnitsWithoutWorkoutUnitId = (workoutUnitId, prevState) => {
    var filteredWorkoutUnits = prevState.workoutUnits.filter(
      el => el.id != workoutUnitId
    );
    for (var i = 0; i < filteredWorkoutUnits.length; i++) {
      filteredWorkoutUnits[i].id = i;
    }

    return filteredWorkoutUnits;
  };

  _startCountDownForWorkoutUnits = () => {
    this.interval = setInterval(
      () =>
        this.state.initialSecondsCounterVisible
          ? this._decreseInitialCountdownAmount()
          : this.setState(
              prevState => ({
                workoutUnits: this._workoutUnitsWithTimeDecresedBySecond(
                  prevState.workoutUnits
                ),
              }),
              () => {
                if (this.state.workoutUnits.length > 0) {
                  var seconds = this.state.workoutUnits[0].seconds;
                  var minutes = this.state.workoutUnits[0].minutes;
                  if (seconds == 0 && minutes == 0) {
                    this._removeWorkoutUnitAndPlaySound();
                  }
                }
              }
            ),
      1000
    );
  };

  _decreseInitialCountdownAmount = () => {
    if (this.state.initialSecondsCountdownAmount == 1) {
      this._play(roundSound);
      this.setState(prevState => ({
        initialSecondsCounterVisible: false,
        initialSecondsCountdownAmount: 3
      }));
    } else {
      this._play(countdownSound);
      this.setState(prevState => ({
        initialSecondsCountdownAmount:
          prevState.initialSecondsCountdownAmount - 1,
      }));
    }
  };

  _workoutUnitsWithTimeDecresedBySecond = workoutUnits => {
    var seconds = workoutUnits[0].seconds;
    var minutes = workoutUnits[0].minutes;
    if (seconds == 0 && minutes > 0) {
      this.state.workoutUnits.splice(0, 1, {
        id: 0,
        type: this.state.workoutUnits[0].type,
        minutes: this.state.workoutUnits[0].minutes - 1,
        seconds: 59,
      });

      return this.state.workoutUnits;
    } else {
      this.state.workoutUnits.splice(0, 1, {
        id: 0,
        type: this.state.workoutUnits[0].type,
        minutes: this.state.workoutUnits[0].minutes,
        seconds: this.state.workoutUnits[0].seconds - 1,
      });
      //console.log('unit: ' + JSON.stringify(this.state.workoutUnits[0]));

      return this.state.workoutUnits;
    }
  };

  _removeWorkoutUnitAndPlaySound() {
    var lastElement = this.state.workoutUnits.length == 1;
    this._removeWorkoutUnit(0);
    if (lastElement) {
      clearInterval(this.interval);
      this._play(finishSound);
      this.setState(prevState => ({
        workoutRunning: false,
        workoutUnits: prevState.workoutUnitsCopyBeforeStart,
      }));
    } else {
      if (this.state.workoutUnits[1].type == 'Round') {
        this._play(roundSound);
      } else {
        this._play(restSound);
      }
    }
  }

  _startWorkout = () => {
    if (this.state.workoutUnits.length == 0) {
      return;
    }
    this.setState(
      prevState => ({
        workoutUnitsCopyBeforeStart: JSON.parse(
          JSON.stringify(prevState.workoutUnits)
        ),
        workoutRunning: true,
        initialSecondsCounterVisible: true,
      }),
      () => {
        this._play(countdownSound);
        this._startCountDownForWorkoutUnits();
      }
    );
  };

  _stopWorkout = () => {
    clearInterval(this.interval);
    this.setState(prevState => ({
      workoutUnits: JSON.parse(
        JSON.stringify(prevState.workoutUnitsCopyBeforeStart)
      ),
      workoutRunning: false,
      initialSecondsCounterVisible: false,
      initialSecondsCountdownAmount: 3,
    }));
  };

  render() {
    const WORKOUT_UNIT_TIME_IN_SECONDS_DEFAULT = 30;
    const WORKOUT_UNIT_TIME_IN_MINUTES_DEFAULT = 0;

    return (
      <ImageBackground
        style={{
          flex: 1,
        }}
        source={require('./assets/woder_background.png')}>
        <View style={styles.container}>
          <Button
            title="Start workout"
            onPress={() => {
              this._startWorkout();
            }}
            style={this.state.workoutRunning ? styles.hidden : { padding: 5 }}
            linearGradientProps={BUTTON_GRADIENT_PROPS}
          />
          <Button
            title="Stop workout"
            onPress={() => {
              this._stopWorkout();
            }}
            style={this.state.workoutRunning ? { padding: 5 } : styles.hidden}
            linearGradientProps={BUTTON_GRADIENT_PROPS}
          />
          <Card style={{ backgroundColor: 'transparent' }}>
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentInset={(10, 10, 10, 10)}
              automaticallyAdjustContentInsets="false"
              style={
                this.state.workoutRunning
                  ? { height: Dimensions.get('window').height }
                  : { height: 350 }
              }>
              {this.state.workoutUnits.map((l, i) => (
                <WorkoutUnit
                  key={i}
                  id={i}
                  type={l.type}
                  workoutUnitIcon={
                    l.type == 'Round'
                      ? {
                          name: 'ios-fitness',
                          type: 'ionicon',
                          underlayColor: 'transparent',
                          color: 'blue',
                        }
                      : { name: 'pause', underlayColor: 'transparent' }
                  }
                  minutes={l.minutes}
                  seconds={l.seconds}
                  removeFct={() => this._removeWorkoutUnit(i)}
                  editFct={() => this._editWorkoutUnit(i, l.minutes, l.seconds)}
                  workoutRunning={this.state.workoutRunning}
                />
              ))}
            </ScrollView>
          </Card>

          <View
            style={{
              position: 'absolute',
              top: 45,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              display: this.state.initialSecondsCounterVisible ? null : 'none',
            }}>
            <Text style={{ top: -30, fontSize: 150, color: 'white' }}>
              {this.state.initialSecondsCountdownAmount}
            </Text>
          </View>

          <Button
            title="Add round"
            onPress={() => {
              this.setState({
                addWorkoutUnitVisible: true,
                addWorkoutUnitTypeFunction: (
                  timeInMinutes,
                  timeInSeconds,
                  multiplier
                ) =>
                  this._handleAddWorkoutUnit(
                    timeInMinutes,
                    timeInSeconds,
                    'Round',
                    multiplier
                  ),
              });
            }}
            style={
              this.state.workoutRunning ? styles.hidden : styles.controlButtons
            }
            linearGradientProps={BUTTON_GRADIENT_PROPS}
          />
          <Button
            title="Add rest"
            onPress={() => {
              this.setState({
                addWorkoutUnitVisible: true,
                addWorkoutUnitTypeFunction: (
                  timeInMinutes,
                  timeInSeconds,
                  multiplier
                ) =>
                  this._handleAddWorkoutUnit(
                    timeInMinutes,
                    timeInSeconds,
                    'Rest',
                    multiplier
                  ),
              });
            }}
            style={
              this.state.workoutRunning || this.state.workoutUnits.length == 0
                ? styles.hidden
                : styles.controlButtons
            }
            linearGradientProps={BUTTON_GRADIENT_PROPS}
          />

          <WorkoutUnitOverly
            acceptButtonFct={(timeInMinutes, timeInSeconds, multiplier) => {
              this.state.addWorkoutUnitTypeFunction(
                timeInMinutes,
                timeInSeconds,
                multiplier
              );

              this.setState({
                addWorkoutUnitVisible: false,
              });
            }}
            acceptButtonTitle="Add"
            workoutUnitMinutesInitialValue={
              WORKOUT_UNIT_TIME_IN_MINUTES_DEFAULT
            }
            workoutUnitSecondsInitialValue={
              WORKOUT_UNIT_TIME_IN_SECONDS_DEFAULT
            }
            cancelButtonFct={() =>
              this.setState({ addWorkoutUnitVisible: false })
            }
            visible={this.state.addWorkoutUnitVisible}
            mode = "Add"
          />

          <WorkoutUnitOverly
            acceptButtonFct={(timeInMinutes, timeInSeconds) => {
              this._handleEditRound(timeInMinutes, timeInSeconds);

              this.setState({
                editWorkoutUnitVisible: false,
              });
            }}
            acceptButtonTitle="Edit"
            workoutUnitMinutesInitialValue={
              this.state.editedworkoutUnitTimeInMinutes
            }
            workoutUnitSecondsInitialValue={
              this.state.editedWorkoutUnitTimeInSeconds
            }
            cancelButtonFct={() =>
              this.setState({ editWorkoutUnitVisible: false })
            }
            visible={this.state.editWorkoutUnitVisible}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  controlButtons: {
    flexDirection: 'column',
    fontSize: 60,
    backgroundColor: 'transparent',
    padding: 5,
  },
  hidden: {
    display: 'none',
  },
});
