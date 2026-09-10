import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';

import MiniPlayer from '../components/MiniPlayer';

import HomeIcon from '../assets/icons/home.svg';
import SearchIcon from '../assets/icons/search.svg';
import LibraryIcon from '../assets/icons/library.svg';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

function CustomTabBar(props: BottomTabBarProps) {
  return (
    <View>
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

  return (
    <Tab.Navigator
      tabBar={CustomTabBar}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#FFFFFF',    
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
        options={{ tabBarLabel: t('tabs.search'), tabBarIcon: renderSearchIcon }} 
      />
      <Tab.Screen 
        name="Бібліотека" 
        component={LibraryScreen} 
        options={{ tabBarLabel: t('tabs.library'), tabBarIcon: renderLibraryIcon }} 
      />
    </Tab.Navigator>
  );
}