import TrackPlayer, { Event } from 'react-native-track-player';

export const PlaybackService = async function() {
  // Тут ми кажемо, що робити, коли користувач тисне кнопки на навушниках або екрані блокування
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
};