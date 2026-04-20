/**
 * @format
 */

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

// Avoid native screen host splitting the React tree in ways that break context for
// @react-navigation/elements (FrameSizeProvider / useFrameSize) on some setups.
enableScreens(false);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
