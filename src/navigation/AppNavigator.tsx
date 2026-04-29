import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { colors } from '../utils/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { EncyclopediaScreen } from '../screens/EncyclopediaScreen';
import { PeptideDetailScreen } from '../screens/PeptideDetailScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { TrackerScreen } from '../screens/TrackerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, label, focused, color }: { icon: string; label: string; focused: boolean; color: string }) {
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabIconText, { opacity: focused ? 1 : 0.5 }]}>{icon}</Text>
    </View>
  );
}

function MainTabs() {
  const { darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 2,
          height: 80,
          paddingTop: 8,
        },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🏠" label="HOME" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Encyclopedia"
        component={EncyclopediaScreen}
        options={{
          tabBarLabel: 'PEPTIDES',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🧬" label="PEPTIDES" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tracker"
        component={TrackerScreen}
        options={{
          tabBarLabel: 'LOG',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="📊" label="LOG" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'SETTINGS',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="⚙️" label="SETTINGS" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { darkMode } = useUserStore();
  const c = colors[darkMode ? 'dark' : 'light'];

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: c.background,
          },
          headerTintColor: c.text,
          headerTitleStyle: {
            fontWeight: '700',
            letterSpacing: -0.5,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: c.background,
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PeptideDetail"
          component={PeptideDetailScreen}
          options={{
            title: 'Peptide',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{
            title: 'Calculator',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 20,
  },
});