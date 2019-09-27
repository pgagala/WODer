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
import Timer from './components/Timer';
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

export default class TimerScreen extends React.Component {
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
    workoutUnitTimeInSeconds: 0,
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

  _startTimer = () => {
    this.setState(() => ({initialSecondsCounterVisible: true}) ),
    this.interval = setInterval(
      () =>
        this.state.initialSecondsCountdownAmount > 0
          ? this.setState(
              prevState => ({
                initialSecondsCountdownAmount:
                  prevState.initialSecondsCountdownAmount - 1,
              }),
              () => {
                this._play(countdownSound)
                if(this.state.initialSecondsCountdownAmount==0) {
                  this.setState(() => ({ initialSecondsCounterVisible: false }));
                  this._play(roundSound)
                }
              }
            )
          : this.state.workoutUnitTimeInSeconds < 59
          ? this.setState(prevState => ({
              workoutUnitTimeInSeconds: prevState.workoutUnitTimeInSeconds + 1,
            }))
          : this.setState(prevState => ({
              workoutUnitTimeInSeconds: 0,
              workoutUnitTimeInMinutes: prevState.workoutUnitTimeInMinutes + 1,
            })),
      1000
    );
  };

  _startWorkout = () => {
    this.setState(
      prevState => ({
        workoutRunning: true,
      }),
      () => {
        this._play(countdownSound)
        this._startTimer();
      }
    );
  };

  _stopWorkout = () => {
    clearInterval(this.interval);
    this.setState(prevState => ({
      workoutUnitTimeInMinutes: 0,
      workoutUnitTimeInSeconds: 0,
      workoutRunning: false,
      initialSecondsCounterVisible: false,
      initialSecondsCountdownAmount: 3
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
              <Timer
                type="Round"
                workoutUnitIcon={{
                  name: 'ios-fitness',
                  type: 'ionicon',
                  underlayColor: 'transparent',
                  color: 'blue',
                }}
                minutes={this.state.workoutUnitTimeInMinutes}
                seconds={this.state.workoutUnitTimeInSeconds}
                workoutRunning={this.state.workoutRunning}
              />
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
            <Text style={{ top:-30, fontSize: 150, color: 'white' }}>
              {this.state.initialSecondsCountdownAmount}
            </Text>
          </View>
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
  hidden: {
    display: 'none',
  },
});
