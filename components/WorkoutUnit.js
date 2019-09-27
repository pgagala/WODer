import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

import { Button, Icon, ListItem } from 'react-native-elements';

import TouchableScale from 'react-native-touchable-scale';

export default class WorkoutUnit extends React.Component {
  render() {
    const id = this.props.id;
    const type = this.props.type;
    const seconds = this.props.seconds;
    const minutes = this.props.minutes;
    const removeFct = this.props.removeFct;
    const editFct = this.props.editFct;
    const workoutRunning = this.props.workoutRunning;
    const workoutUnitIcon = this.props.workoutUnitIcon;

    return (
      <View style={styles.workoutUnit}>
        <ListItem
          style={{ borderRadius: 25, overflow: 'hidden' }}
          Component={TouchableScale}
          friction={190} //
          activeScale={1.55} //
          linearGradientProps={{
            colors: ['#FF9800', '#F44336'],
            start: [1, 0],
            end: [0.5, 0],
          }}
          leftAvatar={
            !workoutRunning
              ? {
                  rounded: true,
                  size: 'medium',
                  icon: workoutUnitIcon,
                  showEditButton: true,
                }
              : null
          }
          title={
            workoutRunning ? (
              <Icon
                name={workoutUnitIcon.name}
                type={workoutUnitIcon.type}
                containerStyle={{ top: -60, left: 5 }}
                size="60"
              />
            ) : null
          }
          containerStyle={workoutRunning ? { widht: 50, height: 190 } : null}
          subtitle={
            !workoutRunning ? (
              <Text style={{ fontSize: 22 }}>
                {id} : {minutes} m : {seconds} s
              </Text>
            ) : (
              <View
                style={{ flex: 1, flexDirection: 'row', position: 'absolute' }}>
                <Text style={{ fontSize: 90, left: 8 }}>
                  {minutes < 10 ? '0' + minutes : minutes}
                </Text>
                <Text style={{ fontSize: 90, left: 29 }}>:</Text>
                <Text style={{ fontSize: 90, left: 47 }}>
                  {seconds < 10 ? '0' + seconds : seconds}
                </Text>
              </View>
            )
          }
          rightTitle={
            !workoutRunning ? (
              <Icon
                name="close"
                onPress={this.props.removeFct}
                underlayColor="transparent"
                size="39"
                iconStyle={workoutRunning ? styles.hidden : null}
              />
            ) : null
          }
          onPress={!workoutRunning ? this.props.editFct : null}
          chevronColor="white"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  workoutUnit: {
    marginBottom: 10,
  },
  hidden: {
    display: 'none',
  },
});
