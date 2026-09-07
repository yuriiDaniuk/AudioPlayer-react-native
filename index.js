/**
 * @format
 */

import './global.css';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player'; // Додали імпорт
import { PlaybackService } from './src/services/playbackService'; // Додали імпорт

AppRegistry.registerComponent(appName, () => App);
// Реєструємо сервіс відразу після реєстрації головного компонента
TrackPlayer.registerPlaybackService(() => PlaybackService);
