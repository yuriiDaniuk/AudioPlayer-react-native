import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import React, {useState} from 'react';
import { View, Text, Image, Pressable, GestureResponderEvent } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setIsPlaying } from '../store/playerSlice';
import TrackPlayer, { useProgress } from 'react-native-track-player';

export default function MiniPlayer() {
  const dispatch = useDispatch();

  // 1. Читаємо поточний трек і статус відтворення з глобального сховища
  const { activeTrack, isPlaying } = useSelector(
    (state: RootState) => state.player,
  );

  // Отримуємо дані про прогрес
  const { position, duration } = useProgress();
  // Стан для збереження фізичної ширини смужки на екрані
  const [barWidth, setBarWidth] = useState(0);

  // 2. Якщо трек ще не вибрано (додаток щойно запущено) — плеєр взагалі не відображається
  if (!activeTrack) {
    return null;
  }

  // 3. Обробник для кнопки Play/Pause
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    // Оновлюємо іконку в UI
    dispatch(setIsPlaying(!isPlaying));
  };

  // Функція перемотування
  const handleSeek = async (event: GestureResponderEvent) => {
    if (duration === 0 || barWidth === 0) return;
    
    // 1. Отримуємо координату X, куди саме натиснув користувач (від 0 до ширини екрана)
    const clickX = event.nativeEvent.locationX;
    
    // 2. Вираховуємо відсоток (наприклад, натиснули на середину = 0.5)
    const percentage = clickX / barWidth;
    
    // 3. Множимо загальну тривалість треку на відсоток і отримуємо цільову секунду
    const targetTime = duration * percentage;
    
    // 4. Наказуємо плеєру перемотати
    await TrackPlayer.seekTo(targetTime);
  };

  // 4. Очищення URL для обкладинки (як ми робили в сітці)
  const cleanUri = activeTrack.coverUrl
    ? encodeURI(activeTrack.coverUrl.trim())
    : null;

    // Вираховуємо відсоток прогресу (захист від ділення на нуль)
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View className="flex-row items-center bg-[#282828] p-2 mx-4 mb-4 rounded-md overflow-hidden relative">
      {/* Обкладинка */}
      {cleanUri ? (
        <Image
          source={{ uri: cleanUri }}
          className="w-10 h-10 rounded-sm bg-[#181818]"
        />
      ) : (
        <View className="w-10 h-10 rounded-sm bg-[#181818]" />
      )}

      {/* Інформація про трек */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-white" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text className="text-[#AAAAAA] text-xs" numberOfLines={1}>
          {activeTrack.artist.name}
        </Text>
      </View>

      {/* Кнопка Play/Pause */}
      <Pressable
        onPress={togglePlayPause}
        className="flex items-center justify-center px-4 py-2 active:opacity-70"
      >
        {isPlaying ? (
          <PauseIcon width={24} height={24} color="white" />
        ) : (
          <PlayIcon width={24} height={24} color="white" />
        )}
      </Pressable>

      {/* КЛІКАБЕЛЬНА ЛІНІЯ ПРОГРЕСУ */}
      <Pressable 
        // onLayout спрацьовує при рендері і передає нам реальну ширину елемента
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={handleSeek}
        // Робимо зону натискання вищою (h-4 = 16px), але притискаємо контент до низу (justify-end)
        className="absolute bottom-0 left-0 right-0 justify-end h-4"
      >
        <View className="h-[2px] bg-[#404040] w-full relative">
          <View 
            className="absolute top-0 left-0 h-full bg-white" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </View>
      </Pressable>
    </View>
  );
}
