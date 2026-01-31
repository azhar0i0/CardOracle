import OracleCard from '@/components/cards';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

/* ------------------ PARTICLE ------------------ */
function Particle({ size, x, y }: any) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateY, {
        toValue: -20,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255,255,255,0.35)',
          left: x,
          top: y,
        },
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

/* ------------------ MAIN SCREEN ------------------ */
export default function HomePage() {
  const [cards, setCards] = useState<any[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Animation Refs
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
    }).start();

    setTimeout(() => {
      setShowLogoutModal(false);
      scaleAnim.setValue(0.9);
    }, 150);
  };

  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut();
      closeModal(); // Use closeModal to trigger animation
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*');

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  /* --- AUTH & DATA LOGIC --- */
  const { session, isAdmin } = useAuth();

  useEffect(() => {
    if (session) {
      fetchCards();
    } else {
      setCards([]);
    }
  }, [session]);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[
          'rgb(26, 15, 46)',
          'rgb(45, 27, 78)',
          'rgb(74, 44, 109)',
          'rgb(45, 27, 78)',
          'rgb(26, 15, 46)',
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        className="flex-1"
      >
        {/* PARTICLES */}
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle
            key={i}
            size={Math.random() * 4 + 2}
            x={Math.random() * width}
            y={Math.random() * height}
          />
        ))}

        <SafeAreaView className="flex-1">
          {/* AllCards & LOGOUT */}
          <View className="flex-row justify-end px-6 pt-4 gap-4">
            {isAdmin && (
              <Link href="/(app)/allCards" asChild>
                <Pressable>
                  <Ionicons name="grid-outline" size={18} color="gray" />
                </Pressable>
              </Link>
            )}

            <Pressable onPress={openModal}>
              <Ionicons name="log-out-outline" size={18} color="gray" />
            </Pressable>
          </View>

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
                <Text className="text-white text-lg font-semibold text-center">Sign out?</Text>
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

          {/* INTRO TEXT */}
          <View className="px-10 mt-6 items-center">
            <Text className="text-gray-400 text-center font-semibold text-[10px] leading-5">
              Take a moment to center yourself. Focus on your question or intention.
              When you're ready, tap the deck to shuffle and reveal your guidance.
            </Text>
          </View>

          <View className="items-center mt-10">
            <Text className="text-white text-4xl tracking-[6px] font-light uppercase">
              Card Oracle
            </Text>
            <Text className="text-[#E9B86F] tracking-[3px] text-xs mt-2 uppercase">
              Discover your message
            </Text>
          </View>

          <View className="flex-1 justify-center items-center">
            <OracleCard cards={cards} />
          </View>

          <View className="pb-10 items-center">
            <Text className="text-gray-400 tracking-[2px] uppercase text-xs">
              Tap the deck to shuffle & draw
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}