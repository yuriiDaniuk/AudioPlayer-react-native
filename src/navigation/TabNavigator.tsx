import React from 'react';
import { View } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';

import MiniPlayer from '../components/MiniPlayer';

import HomeIcon from '../assets/icons/home.svg';
import SearchIcon from '../assets/icons/search.svg';
import LibraryIcon from '../assets/icons/library.svg';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

const Tab = createBottomTabNavigator();

function CustomTabBar(props: BottomTabBarProps) {

  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <MiniPlayer />
      <BottomTabBar {...props} />
    </View>
  );
}

const renderHomeIcon = ({ color }: { color: string }) => (
  <HomeIcon width={24} height={24} color={color} />
);

const renderSearchIcon = ({ color }: { color: string }) => (
  <SearchIcon width={24} height={24} color={color} />
);

const renderLibraryIcon = ({ color }: { color: string }) => (
  <LibraryIcon width={24} height={24} color={color} />
);

export default function TabNavigator() {
  const { t } = useTranslation();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#E6E6E6',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#222222' : '#D4D4D4',
          elevation: 0,
          paddingTop: 5,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#000000',
        tabBarInactiveTintColor: '#AAAAAA',
      }}
    >
      <Tab.Screen
        name="Головна"
        component={HomeScreen}
        options={{ tabBarLabel: t('tabs.home'), tabBarIcon: renderHomeIcon }}
      />
      <Tab.Screen
        name="Пошук"
        component={SearchScreen}
        options={{
          tabBarLabel: t('tabs.search'),
          tabBarIcon: renderSearchIcon,
        }}
      />
      <Tab.Screen
        name="Бібліотека"
        component={LibraryScreen}
        options={{
          tabBarLabel: t('tabs.library'),
          tabBarIcon: renderLibraryIcon,
        }}
      />
    </Tab.Navigator>
  );
}
