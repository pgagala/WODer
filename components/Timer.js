import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import {
  Button,
  Icon,
  ListItem,
} from 'react-native-elements';

import TouchableScale from 'react-native-touchable-scale';

export default class Timer extends React.Component {
  render() {
    const seconds = this.props.seconds;
    const minutes = this.props.minutes;
    const workoutRunning = this.props.workoutRunning;
    const workoutUnitIcon = this.props.workoutUnitIcon

    return (
      <View style={styles.workoutUnit}>
      <ListItem
          style={{ borderRadius: 25, overflow: 'hidden'}}
          Component={TouchableScale}
          friction={190}
          activeScale={1.55}
          linearGradientProps={{
            colors: ['#FF9800', '#F44336'],
            start: [1, 0],
            end: [0.5, 0],
          }}
          containerStyle = {{widht: 50, height: 150}}
          title={
            <View style={{flex: 1, flexDirection: 'row', position:"absolute"}}>
            <Text style={{fontSize: 90, left:8}}>{minutes < 10 ? "0" + minutes : minutes}</Text>
            <Text style={{fontSize: 90, left:29}}>:</Text>
            <Text style={{fontSize: 90, left:47}}>{seconds < 10 ? "0" + seconds : seconds}</Text>
            </View>
          }
          chevronColor="white"
        />
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  workoutUnit: {
    marginBottom: 10,
  }
});
