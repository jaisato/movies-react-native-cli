/**
 * @format
 */

// Must be the first import: react-native-gesture-handler and React Navigation
// require it at the very top of the entry file, before anything else is
// loaded, or the app can crash in release builds.
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
