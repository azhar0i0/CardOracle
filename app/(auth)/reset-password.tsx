import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in both fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      Alert.alert(
        "Success", 
        "Your password has been updated successfully.",
        [{ text: "OK", onPress: () => router.replace('/(app)/home') }]
      );
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['rgb(26, 15, 46)', 'rgb(45, 27, 78)', 'rgb(74, 44, 109)']}
        className="flex-1 justify-center px-6"
      >
        <View className="absolute inset-0 bg-black/60" />

        <View className="items-center mb-8">
            <View className="w-16 h-16 bg-green-500/20 rounded-full items-center justify-center mb-4 border border-green-500/50">
                <Ionicons name="shield-checkmark-outline" size={32} color="#D946EF" />
            </View>
          <Text className="text-3xl font-bold text-white mb-2 text-center">Reset Password</Text>
          <Text className="text-gray-300 text-center">Create a new strong password.</Text>
        </View>

        <MagicalCard>
          {errorMsg ? (
            <View className="mb-4 rounded-lg border border-red-500 bg-red-500/20 px-3 py-2 flex-row items-center">
               <Ionicons name="alert-circle" size={18} color="#fca5a5" style={{marginRight: 6}}/>
              <Text className="text-sm text-red-200 flex-1">{errorMsg}</Text>
            </View>
          ) : null}

          <MagicalInput
            iconName="lock-closed-outline"
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <MagicalInput
            iconName="lock-closed"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View className="mt-6">
            <MagicalButton 
              title="UPDATE PASSWORD" 
              onPress={handleUpdatePassword} 
              isLoading={loading} 
            />
          </View>
        </MagicalCard>
      </LinearGradient>
    </View>
  );
}