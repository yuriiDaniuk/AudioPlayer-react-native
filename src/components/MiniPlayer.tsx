import PlayIcon from '../assets/icons/play.svg';
import PauseIcon from '../assets/icons/pause.svg';
import React, {useState} from 'react';
import { View, Text, Image, Pressable, GestureResponderEvent } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setIsPlaying, setFullPlayerOpen} from '../store/playerSlice';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { useColorScheme } from 'nativewind';

export default function MiniPlayer() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <Pressable 
      onPress={() => dispatch(setFullPlayerOpen(true))}
      className="flex-row items-center bg-[#EAEAEA] dark:bg-[#282828] p-2 mx-2 mb-2 rounded-md overflow-hidden relative active:opacity-95 border border-[#D4D4D4] dark:border-transparent"
    >
      {/* Обкладинка */}
      {cleanUri ? (
        <Image
          source={{ uri: cleanUri }}
          className="w-10 h-10 rounded-sm bg-gray-300 dark:bg-[#181818]"
        />
      ) : (
        <View className="w-10 h-10 rounded-sm bg-gray-300 dark:bg-[#181818]" />
      )}

      {/* Інформація про трек */}
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-black dark:text-white" numberOfLines={1}>
          {activeTrack.title}
        </Text>
        <Text className="text-gray-600 dark:text-[#AAAAAA] text-xs" numberOfLines={1}>
          {activeTrack.artist.name}
        </Text>
      </View>

      {/* Кнопка Play/Pause */}
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          togglePlayPause().catch(console.error);
        }}
        className="flex items-center justify-center px-4 py-2 active:opacity-70"
      >
        {isPlaying ? (
          <PauseIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
        ) : (
          <PlayIcon width={24} height={24} color={isDark ? 'white' : 'black'} />
        )}
      </Pressable>

      {/* КЛІКАБЕЛЬНА ЛІНІЯ ПРОГРЕСУ */}
      <Pressable 
        // onLayout спрацьовує при рендері і передає нам реальну ширину елемента
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        onPress={(event) => {
          event.stopPropagation();
          handleSeek(event).catch(console.error);
        }}
        // Робимо зону натискання вищою (h-4 = 16px), але притискаємо контент до низу (justify-end)
        className="absolute bottom-0 left-0 right-0 justify-end h-4"
      >
        <View className="h-[2px] bg-gray-300 dark:bg-[#404040] w-full relative">
          <View 
            className="absolute top-0 left-0 h-full bg-black dark:bg-white" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </View>
      </Pressable>
    </Pressable>
  );
}
