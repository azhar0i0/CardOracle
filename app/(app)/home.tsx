import OracleCard from '@/components/cards';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

/* ------------------ PARTICLE ------------------ */
function Particle({ size, x, y, delay }: any) {
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
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <View className="flex-1">
      {/* 🌌 GRADIENT BACKGROUND */}
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
            delay={i * 200}
          />
        ))}

        <SafeAreaView className="flex-1">
          {/* SETTINGS */}
          <View className="flex-row justify-end px-6 pt-4">
            <Link href="/settings" asChild>
              <Pressable>
                <Ionicons name="settings-outline" size={16} color="gray" opacity={0.6} />
              </Pressable>
            </Link>
          </View>

          {/* INTRO TEXT */}
          <View className="px-10 mt-6 items-center">
            <Text className="text-gray-400 text-center font-semibold text-sm leading-5">
              Take a moment to center yourself. Focus on your question or intention.
              When you're ready, tap the deck to shuffle and reveal your guidance.
            </Text>
          </View>

          {/* 🔮 TITLE */}
          <View className="items-center mt-10">
            <Text className="text-white text-4xl tracking-[6px] font-light uppercase">
              Card Oracle
            </Text>
            <Text className="text-[#E9B86F] tracking-[3px] text-xs mt-2 uppercase">
              Discover your message
            </Text>
          </View>

          {/* 🃏 CARD */}
          <View className="flex-1 justify-center items-center">
            <OracleCard />
          </View>

          {/* FOOTER */}
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
