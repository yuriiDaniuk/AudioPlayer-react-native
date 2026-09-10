import React from 'react';
import { View } from 'react-native';

import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

import HomeIcon from '../assets/icons/home.svg';
import LibraryIcon from '../assets/icons/library.svg';
import SearchIcon from '../assets/icons/search.svg';

import MiniPlayer from '../components/MiniPlayer';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SearchScreen from '../screens/SearchScreen';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

/** Navigator instance for the application's primary tab routes. */
const Tab = createBottomTabNavigator();

/** Renders the mini-player above React Navigation's default tab bar. */
function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <MiniPlayer />
      <BottomTabBar {...props} />
    </View>
  );
}

/** Renders the home icon using the navigator-provided tint color. */
const renderHomeIcon = ({ color }: { color: string }) => (
  <HomeIcon width={24} height={24} color={color} />
);

/** Renders the search icon using the navigator-provided tint color. */
const renderSearchIcon = ({ color }: { color: string }) => (
  <SearchIcon width={24} height={24} color={color} />
);

/** Renders the library icon using the navigator-provided tint color. */
const renderLibraryIcon = ({ color }: { color: string }) => (
  <LibraryIcon width={24} height={24} color={color} />
);

/** Configures the primary tab routes, labels, icons, and theme-aware styling. */
export default function TabNavigator() {
  /** Resolves localized tab labels. */
  const { t } = useTranslation();

  /** Provides the active theme used to style the tab bar. */
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Keep the mini-player visible above the navigation tabs through the custom tab bar.
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
