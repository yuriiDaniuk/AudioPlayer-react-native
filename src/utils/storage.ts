import AsyncStorage from '@react-native-async-storage/async-storage';

/** Storage key used for the most recently active track. */
const TRACK_KEY = '@last_active_track';

/**
 * Persists the most recently selected track in local storage.
 *
 * @param track Track-like value to serialize and store.
 */
export const saveLastTrack = async (track: any) => {
  try {
    const jsonValue = JSON.stringify(track);
    await AsyncStorage.setItem(TRACK_KEY, jsonValue);
  } catch (e) {
    console.error('Помилка збереження треку:', e);
  }
};

/**
 * Retrieves and parses the most recently stored track.
 *
 * @returns The stored track, or null when no valid stored value is available.
 */
export const getLastTrack = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRACK_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Помилка читання треку:', e);
    return null;
  }
};