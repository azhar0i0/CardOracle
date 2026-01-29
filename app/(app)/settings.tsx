import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const appIcon = require('@/assets/images/icon.png');

export default function SettingsPage() {
  const { session } = useAuth();
  const email = session?.user?.email ?? null;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const openModal = () => {
    setShowLogoutModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowLogoutModal(false);
      scaleAnim.setValue(0.9);
    });
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    closeModal();
  };

  return (
    <View className="flex-1 bg-slate-950 px-6">
      <Stack.Screen
        options={{
          title: 'Settings',
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#020617' },
        }}
      />

      {/* Profile */}
      <View className="items-center mt-12">
        <View className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 items-center justify-center">
          <Image source={appIcon} className="w-20 h-20" resizeMode="contain" />
        </View>

        <Text className="text-white text-lg font-semibold mt-4">
          Oracle App
        </Text>
        <Text className="text-gray-400 text-sm mt-1">{email}</Text>
      </View>

      <View className="h-px bg-white/10 mt-8" />
      <View className="flex-1" />

      <Pressable
        onPress={openModal}
        className="mb-10 flex-row items-center justify-center bg-red-500/10 border border-red-500/20 rounded-2xl py-4"
      >
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text className="text-red-500 font-semibold ml-3 text-base">
          Sign Out
        </Text>
      </Pressable>

      {/* Logout Modal */}
      <Modal transparent visible={showLogoutModal} animationType="none">
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className="w-full bg-slate-900 rounded-3xl border border-white/10 p-6"
          >
            <Ionicons
              name="log-out-outline"
              size={28}
              color="#ef4444"
              style={{ alignSelf: 'center', marginBottom: 12 }}
            />

            <Text className="text-white text-lg font-semibold text-center">
              Sign out?
            </Text>

            <Text className="text-gray-400 text-sm text-center mt-2">
              You’ll need to sign in again to access your cards.
            </Text>

            <View className="flex-row gap-x-4 mt-6">
              <Pressable
                onPress={closeModal}
                className="flex-1 py-3 rounded-xl border border-white/10 items-center"
              >
                <Text className="text-gray-300 font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={confirmLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 items-center"
              >
                <Text className="text-white font-semibold">Sign Out</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}
