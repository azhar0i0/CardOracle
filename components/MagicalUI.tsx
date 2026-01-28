import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Glass Card ---
export const MagicalCard = ({ children, delay = 100 }: { children: React.ReactNode, delay?: number }) => (
  <View className="w-full overflow-hidden rounded-3xl border border-white/20">
    <BlurView intensity={40} tint="dark" className="p-6">
      {children}
    </BlurView>
  </View>
);

// --- Glowing Input ---
export const MagicalInput = ({ 
  iconName, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  error 
}: any) => {
  return (
    <View className="mb-4">
      <View className={`flex-row items-center bg-slate-900/60 rounded-xl px-4 h-14 border ${error ? 'border-red-500' : 'border-white/10 focus:border-[#D946EF]'}`}>
        <Ionicons name={iconName} size={20} color="#D1D5DB" style={{ marginRight: 10 }} />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
      {error && <Text className="text-red-400 text-xs ml-2 mt-1">{error}</Text>}
    </View>
  );
};

// --- Gradient Button ---
export const MagicalButton = ({ onPress, title, isLoading }: any) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isLoading} 
      activeOpacity={0.8}
      style={{ borderRadius: 16, overflow: 'hidden' }}
    >
      <LinearGradient
        colors={['#D946EF', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 56,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};