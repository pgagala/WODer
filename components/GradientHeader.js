import * as React from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';

import { Button, Icon, Overlay, Header } from 'react-native-elements';

import { BUTTON_GRADIENT_PROPS } from '../App';

export default class GradientHeader extends React.Component {
  state = {
    aboutVisible: false,
  };

  render() {

    return (
      <View>
        <Header
          backgroundImage={require('../assets/woder_background.png')}
          centerComponent={{ text: 'WODer', style: { color: '#fff' } }}
          rightComponent={{
            icon: 'info',
            underlayColor: 'transparent',
            size: 30,
            color: '#fff',
            onPress: () => this.setState({ aboutVisible: true }),
          }}
          leftComponent={{
            icon: 'home',
            underlayColor: 'transparent',
            size: 30,
            color: '#fff',
            onPress: () => {
              this.props.navigation.navigate("Home")
              }
          }}
        />
        <Overlay
          isVisible={this.state.aboutVisible}
          width="auto"
          height="auto"
          overlayBackgroundColor="transparent"
          onBackdropPress={() => this.setState({ aboutVisible: false })}>
          <TouchableOpacity
            onPress={() => this.setState({ aboutVisible: false })}>
            <ImageBackground
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 250,
                height: 150,
                borderRadius: 25,
                overflow: 'hidden',
              }}
              source={require('../assets/woder_background.png')}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', position: 'absolute' }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      left: 10,
                      top: -20,
                    }}>
                    {' '}
                    About
                  </Text>
                  <Icon
                    name="close"
                    color="white"
                    underlayColor="transparent"
                    size="28"
                    iconStyle={{ left: 70, top: -20 }}
                  />
                </View>
                <Text style={{ color: 'white' }}>
                  {'\n'}Developed by Paweł Gągała.{'\n'}
                  {'\n'}Check https://github.com/porterjr/WODer{'\n'}for the source
                  code.
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Overlay>
      </View>
    );
  }
}
