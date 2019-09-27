import * as React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Asset,
} from 'react-native';

import { Button, Icon, Avatar } from 'react-native-elements';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants } from 'expo';

import IntervalScreen from './IntervalScreen';
import TimerScreen from './TimerScreen';

import { Card } from 'react-native-paper';
import { Picker, DatePicker } from 'react-native-wheel-pick';
import WorkoutUnit from './components/WorkoutUnit';
import WorkoutUnitOverly from './components/WorkoutUnitOverly';
import GradientHeader from './components/GradientHeader';

class App extends React.Component {
  async componentDidMount() {
    Asset.loadAsync([require('./assets/shoes_own.png')]);
  }

  static navigationOptions = {
    header: props => <GradientHeader navigation={props.navigation} />,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ImageBackground
        style={{
          flex: 1,
        }}
        source={require('./assets/woder_background.png')}>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: 'ligth-blue',
              marginBottom: 20,
            }}
            onPress={() => this.props.navigation.navigate('TimerScreen')}>
            <Icon name={'timer'} size={95} color="white" />
            <Text style={{ fontSize: 30, color: 'white' }}>Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: 'ligth-blue',
            }}
            onPress={() => this.props.navigation.navigate('IntervalScreen')}>
            <Icon name={'ios-pulse'} type="ionicon" size={95} color="white" />
            <Text style={{ fontSize: 30, color: 'white' }}>Interval</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
  },
  IntervalScreen: { screen: IntervalScreen },
  TimerScreen: { screen: TimerScreen },
});

export default createAppContainer(AppNavigator);
