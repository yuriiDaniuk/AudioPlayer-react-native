import TrackPlayer, { Event } from 'react-native-track-player';

/**
 * Registers handlers for remote playback controls exposed by TrackPlayer.
 *
 * The listeners handle commands originating from connected headphones,
 * notification controls, and the device lock screen.
 */
export const PlaybackService = async function () {
  // Map remote transport commands to the corresponding TrackPlayer actions.
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );
};