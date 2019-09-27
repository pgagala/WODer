import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

import { Button, Overlay } from 'react-native-elements';

import { Picker } from 'react-native-wheel-pick';

import TouchableScale from 'react-native-touchable-scale';
import { BUTTON_GRADIENT_PROPS } from '../App';

export default class WorkoutUnitOverly extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    workoutUnitTimeInSeconds: this.props.workoutUnitSecondsInitialValue,
    workoutUnitTimeInMinutes: this.props.workoutUnitMinutesInitialValue,
    multiplier: 1,
  };

  componentWillReceiveProps() {
    this.setState({
      workoutUnitTimeInSeconds: this.props.workoutUnitSecondsInitialValue,
      workoutUnitTimeInMinutes: this.props.workoutUnitMinutesInitialValue,
    });
  }

  render() {
    const acceptButtonFct = this.props.acceptButtonFct;
    const acceptButtonTitle = this.props.acceptButtonTitle;
    const cancelButtonFct = this.props.cancelButtonFct;
    const visible = this.props.visible;
    const mode = this.props.mode;
    const FROM_0_TO_59 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,       33,34,35,36,37,38,39,40,41,42,43,44,45,46,47, 48,49,50,51,52,53,54,55,56,57,58,59];
    const workoutUnitMinutesInitialValue = this.props
      .workoutUnitMinutesInitialValue;
    const workoutUnitSecondsInitialValue = this.props
      .workoutUnitSecondsInitialValue;

    return (
      <Overlay
        isVisible={this.props.visible}
        width="auto"
        height="auto"
        overlayBackgroundColor="transparent">
        <ImageBackground
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 350,
            borderRadius: 25,
            overflow: 'hidden',
          }}
          source={require('../assets/woder_background.png')}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <Picker
              style={{ backgroundColor: 'transparent', width: 60, height: 215 }}
              selectedValue={workoutUnitMinutesInitialValue}
              pickerData={FROM_0_TO_59}
              itemStyle={{ color: 'white' }}
              onValueChange={value => {
                this.setState({ workoutUnitTimeInMinutes: value });
              }}
            />
            <Text style={{ color: 'white' }}> minutes</Text>

            <Picker
              style={{ backgroundColor: 'transparent', width: 60, height: 215 }}
              selectedValue={workoutUnitSecondsInitialValue}
              pickerData={FROM_0_TO_59}
              itemStyle={{ color: 'white' }}
              onValueChange={value => {
                this.setState({ workoutUnitTimeInSeconds: value });
              }}
            />

            <Text style={{ justifyContent: 'center', color: 'white' }}>
              {' '}
              seconds
            </Text>
          </View>
          <View
            style={
              this.props.mode == 'Add'
                ? {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginTop: 10,
                  }
                : { display: 'none' }
            }>
            <Text
              style={{
                justifyContent: 'center',
                color: 'white',
                marginRight: 20,
              }}>
              multiplier: {this.state.multiplier}
            </Text>

            <Button
              title="+"
              buttonStyle={{ width: 40, height: 40, marginRight: 10 }}
              onPress={() =>
                this.setState({ multiplier: this.state.multiplier + 1 })
              }
            />

            <Button
              title="-"
              buttonStyle={{ width: 40, height: 40 }}
              onPress={() =>
                this.state.multiplier > 1
                  ? this.setState({ multiplier: this.state.multiplier - 1 })
                  : null
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 15,
            }}>
            <Button
              title={acceptButtonTitle}
              onPress={() => {
                this.props.acceptButtonFct(
                  this.state.workoutUnitTimeInMinutes,
                  this.state.workoutUnitTimeInSeconds,
                  this.state.multiplier
                );
                this.setState({
                  visible: false,
                  multiplier: 1,
                });
              }}
              style={{ width: 80, marginRight: 20 }}
              linearGradientProps={BUTTON_GRADIENT_PROPS}
            />
            <Button
              title="Cancel"
              onPress={() =>
                this.setState({ multiplier: 1 }) || this.props.cancelButtonFct()
              }
              style={{ width: 80 }}
              linearGradientProps={BUTTON_GRADIENT_PROPS}
            />
          </View>
        </ImageBackground>
      </Overlay>
    );
  }
}
