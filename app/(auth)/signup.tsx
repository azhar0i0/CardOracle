import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, Text, View } from 'react-native';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

const bgImage = require('../../assets/images/magic_bg.png');

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function signUpWithEmail() {
  if (!email || !password) {
    setErrorMsg('Email and password are required');
    return;
  }

  if (password.length < 6) {
    setErrorMsg('Password must be at least 6 characters');
    return;
  }

  setLoading(true);
  setErrorMsg('');

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setErrorMsg(error.message);
  } else {
    Alert.alert(
      'Account created',
      'Please check your email to verify your account.'
    );
  }

  setLoading(false);
}

  return (
    <View className="flex-1 bg-slate-950">
      <ImageBackground source={bgImage} className="flex-1 justify-center p-6" blurRadius={3}>
        <View className="absolute inset-0 bg-black/60" />

        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-white mb-2">
            Join the Realm
          </Text>
          <Text className="text-gray-300">Create your legend</Text>
        </View>

        <MagicalCard>
           {errorMsg ? (
            <View className="bg-red-500/20 p-3 rounded-lg border border-red-500 mb-4">
              <Text className="text-red-200 text-center">{errorMsg}</Text>
            </View>
          ) : null}

          <MagicalInput
            iconName="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <MagicalInput
            iconName="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="mt-4">
            <MagicalButton title="CREATE ACCOUNT" onPress={signUpWithEmail} isLoading={loading} />
          </View>
        </MagicalCard>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">Already initiated? </Text>
          <Link href="/signin">
            <Text className="text-[#D946EF] font-bold">Sign In</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}