import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsPage() {
  return (
    <View className="flex-1 bg-slate-950 p-6">
      <Stack.Screen options={{ headerShown: true, title: 'Settings', headerTintColor: '#fff', headerStyle: { backgroundColor: '#020617' } }} />
      
      <View className="mt-10 gap-y-6">
        <TouchableOpacity className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
          <Ionicons name="person-outline" size={24} color="#D946EF" />
          <Text className="text-white ml-4 text-lg">Account Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
          <Ionicons name="notifications-outline" size={24} color="#D946EF" />
          <Text className="text-white ml-4 text-lg">Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.replace('/signin')}
          className="flex-row items-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20 mt-10"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text className="text-red-500 ml-4 text-lg font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}