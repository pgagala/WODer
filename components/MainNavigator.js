import { createStackNavigator, createAppContainer } from 'react-navigation';
import App from '../';
import Profiles from '../';

const MainNavigator = createStackNavigator({
  Home: { screen: App },
  Profile: { screen: Profiles },
});

const Apps = createAppContainer(MainNavigator);

export default Apps;
