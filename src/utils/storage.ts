import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключ, за яким ми будемо ховати наш трек
const TRACK_KEY = '@last_active_track';

export const saveLastTrack = async (track: any) => {
  try {
    const jsonValue = JSON.stringify(track); // Перетворюємо об'єкт на рядок
    await AsyncStorage.setItem(TRACK_KEY, jsonValue);
  } catch (e) {
    console.error('Помилка збереження треку:', e);
  }
};

export const getLastTrack = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRACK_KEY);
    // Якщо збережений трек є, розпаковуємо його, якщо ні - повертаємо null
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Помилка читання треку:', e);
    return null;
  }
};