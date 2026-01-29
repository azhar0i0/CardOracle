import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const bgImage = require('../../assets/images/magic_bg.png');

export default function AddCardScreen() {
    const {
        editMode,
        cardId,
        cardName: paramCardName,
        cardDescription: paramCardDescription,
        cardNumber: paramCardNumber,
        cardImage: paramCardImage,
    } = useLocalSearchParams();

    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardDescription, setCardDescription] = useState('');
    const [cardImage, setCardImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const isEditing = editMode === 'true';

    useEffect(() => {
        if (isEditing) {
            setCardName((paramCardName as string) || '');
            setCardNumber((paramCardNumber as string) || '');
            setCardDescription((paramCardDescription as string) || '');
            setCardImage((paramCardImage as string) || null);
        }
    }, [
        isEditing,
        paramCardName,
        paramCardNumber,
        paramCardDescription,
        paramCardImage,
    ]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access gallery is required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setCardImage(result.assets[0].uri);
        }
    };

    const getMimeType = async (uri: string) => {
        const info = await FileSystem.getInfoAsync(uri);
        const ext = uri.split('.').pop()?.toLowerCase() || '';

        if (ext) {
            if (ext === 'png') return 'image/png';
            if (ext === 'gif') return 'image/gif';
            if (ext === 'webp') return 'image/webp';
            if (ext === 'heic' || ext === 'heif') return 'image/heic';
        }

        // fallback
        if (info.exists) return 'image/jpeg';

        return 'image/jpeg';
    };


    const uploadImageToSupabase = async (uri: string) => {
        const mimeType = await getMimeType(uri);
        const ext = mimeType.split('/')[1] || 'jpg';
        const fileName = `${Date.now()}.${ext}`;

        let fileData: Uint8Array | Blob;

        if (uri.startsWith("file://")) {
            // MOBILE
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const arrayBuffer = decode(base64);
            fileData = new Uint8Array(arrayBuffer);
        } else {
            // WEB
            const response = await fetch(uri);
            fileData = await response.blob();
        }

        const { error } = await supabase.storage
            .from("card-images")
            .upload(fileName, fileData, {
                contentType: mimeType,
                upsert: false,
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from("card-images")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };


    const handleAddCard = async () => {
        setErrorMsg('');
        setLoading(true);

        try {
            let imageUrl = null;

            // If the card is being edited and there's an existing image
            if (isEditing && cardImage && cardImage !== paramCardImage) {
                // Step 1: Delete old image from Supabase if editing and image is different
                if (paramCardImage && typeof paramCardImage === 'string') {
                    const oldImageName = paramCardImage.split('/').pop();
                    if (oldImageName) {
                        const { error: deleteError } = await supabase.storage
                            .from('card-images')
                            .remove([oldImageName]);

                        if (deleteError) throw deleteError;
                    }
                }
            }

            // Step 2: Upload the new image if available
            if (cardImage && cardImage.startsWith('file://')) {
                imageUrl = await uploadImageToSupabase(cardImage);
            } else {
                imageUrl = cardImage;
            }

            // Step 3: Prepare payload
            const payload = {
                name: cardName,
                number: cardNumber,
                description: cardDescription,
                ...(imageUrl && { image_url: imageUrl }),
            };

            let result;

            if (isEditing && cardId) {
                // Step 4: Update the existing card
                result = await supabase
                    .from('cards')
                    .update(payload)
                    .eq('id', cardId)
                    .select();
            } else {
                // Step 5: Insert new card
                result = await supabase
                    .from('cards')
                    .insert(payload)
                    .select();
            }

            if (result.error) {
                console.log('SAVE ERROR:', result.error);
                setErrorMsg('Failed to save card.');
                return;
            }

            router.replace('/(app)/allCards');
        } catch (err) {
            console.log('CATCH ERROR:', err);
            setErrorMsg('Failed to save card.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-900">
            <ImageBackground
                source={bgImage}
                blurRadius={Platform.OS === 'web' ? 2 : 5}
                className="flex-1"
            >
                {/* Overlay */}
                <View className="absolute inset-0 bg-black/60" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <SafeAreaView className="flex-1">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
                            {/* Header */}
                            <View className="px-6 pt-4 pb-8 flex-row items-center justify-between">
                                <Link href="/(app)/allCards" asChild>
                                    <Pressable>
                                        <Ionicons name="chevron-back" size={24} color="#9CA3AF" />
                                    </Pressable>
                                </Link>

                                <Text className="text-gray-400 text-sm tracking-[2px] uppercase font-light">
                                    {isEditing ? 'Edit Card' : 'Add Card'}
                                </Text>

                                <View style={{ width: 24 }} />
                            </View>

                            {/* Card Preview */}
                            <View className="px-6 mb-8 items-center">
                                <View className="w-72 h-[420px] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
                                    {cardImage ? (
                                        // IMAGE PREVIEW BACKGROUND
                                        <ImageBackground
                                            source={{ uri: cardImage }}
                                            resizeMode="cover"
                                            style={{ flex: 1 }}
                                        >
                                            {/* Overlay for readability */}
                                            <View className="absolute inset-0 bg-black/55" />

                                            <View className="flex-1 justify-between p-8">
                                                <View className="items-center">
                                                    <Text className="text-amber-200/40 tracking-[4px] uppercase text-[10px] font-bold">
                                                        The Oracle
                                                    </Text>
                                                    <View className="h-[1px] w-16 bg-amber-200/20 mt-2" />
                                                </View>

                                                <View className="items-center">
                                                    <Text
                                                        className="text-white text-4xl font-light text-center"
                                                        numberOfLines={2}
                                                    >
                                                        {cardName || 'Card Name'}
                                                    </Text>
                                                    <Text
                                                        className="text-amber-200/60 italic mt-4 text-center text-sm"
                                                        numberOfLines={3}
                                                    >
                                                        {cardDescription || 'Card Description'}
                                                    </Text>
                                                </View>

                                                <Text className="text-gray-300 text-center text-xs italic">
                                                    Card #{cardNumber || '?'}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    ) : (
                                        // DEFAULT GRADIENT BACKGROUND
                                        <LinearGradient
                                            colors={['#1e1e1e', '#000']}
                                            className="flex-1 justify-between p-8"
                                        >
                                            <View className="items-center">
                                                <Text className="text-amber-200/40 tracking-[4px] uppercase text-[10px] font-bold">
                                                    The Oracle
                                                </Text>
                                                <View className="h-[1px] w-16 bg-amber-200/20 mt-2" />
                                            </View>

                                            <View className="items-center">
                                                <Text
                                                    className="text-white text-4xl font-light text-center"
                                                    numberOfLines={2}
                                                >
                                                    {cardName || 'Card Name'}
                                                </Text>
                                                <Text
                                                    className="text-amber-200/60 italic mt-4 text-center text-sm"
                                                    numberOfLines={3}
                                                >
                                                    {cardDescription || 'Card Description'}
                                                </Text>
                                            </View>

                                            <Text className="text-gray-500 text-center text-xs italic">
                                                Card #{cardNumber || '?'}
                                            </Text>
                                        </LinearGradient>
                                    )}
                                </View>
                            </View>

                            {/* Form Container */}
                            <View className="px-6">
                                <View className="rounded-3xl overflow-hidden border border-white/20">
                                    <LinearGradient
                                        colors={['rgba(30, 30, 30, 0.8)', 'rgba(0, 0, 0, 0.8)']}
                                        className="p-6"
                                    >
                                        {/* Error Message */}
                                        {errorMsg ? (
                                            <View className="mb-4 rounded-lg border border-red-500 bg-red-500/20 px-3 py-2">
                                                <Text className="text-center text-sm text-red-200">
                                                    {errorMsg}
                                                </Text>
                                            </View>
                                        ) : null}

                                        {/* Card Image Field */}
                                        <View className="mb-5">
                                            <Text className="text-gray-300 text-sm font-semibold mb-2 tracking-wide">
                                                Card Image
                                            </Text>
                                            <Pressable
                                                onPress={pickImage}
                                                disabled={loading}
                                                style={{ opacity: loading ? 0.6 : 1 }}
                                            >
                                                <View className="bg-slate-900/60 rounded-xl px-4 h-32 border-2 border-dashed border-amber-200/40 justify-center items-center">
                                                    {cardImage ? (
                                                        <View className="w-full h-full items-center justify-center rounded-lg overflow-hidden">
                                                            <Image
                                                                source={{ uri: cardImage }}
                                                                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                                                            />
                                                        </View>
                                                    ) : (
                                                        <View className="items-center gap-2">
                                                            <Ionicons name="image-outline" size={32} color="#E9B86F" />
                                                            <Text className="text-amber-200/60 text-sm font-medium">Tap to select image</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </Pressable>
                                        </View>

                                        {/* Card Name Field */}
                                        <View className="mb-5">
                                            <Text className="text-gray-300 text-sm font-semibold mb-2 tracking-wide">
                                                Card Name
                                            </Text>
                                            <View className="flex-row items-center bg-slate-900/60 rounded-xl px-4 h-14 border border-white/10">
                                                <Ionicons name="bookmark-outline" size={18} color="#D1D5DB" />
                                                <TextInput
                                                    className="flex-1 text-white text-base ml-3"
                                                    placeholder="Enter card name"
                                                    placeholderTextColor="#6B7280"
                                                    value={cardName}
                                                    onChangeText={setCardName}
                                                    editable={!loading}
                                                />
                                            </View>
                                        </View>

                                        {/* Card Number Field */}
                                        <View className="mb-5">
                                            <Text className="text-gray-300 text-sm font-semibold mb-2 tracking-wide">
                                                Card Number
                                            </Text>
                                            <View className="flex-row items-center bg-slate-900/60 rounded-xl px-4 h-14 border border-white/10">
                                                <Ionicons name="code-outline" size={18} color="#D1D5DB" />
                                                <TextInput
                                                    className="flex-1 text-white text-base ml-3"
                                                    placeholder="Enter card number"
                                                    placeholderTextColor="#6B7280"
                                                    value={cardNumber}
                                                    onChangeText={setCardNumber}
                                                    keyboardType="numeric"
                                                    editable={!loading}
                                                />
                                            </View>
                                        </View>

                                        {/* Description Field */}
                                        <View className="mb-6">
                                            <Text className="text-gray-300 text-sm font-semibold mb-2 tracking-wide">
                                                Description
                                            </Text>
                                            <View className="bg-slate-900/60 rounded-xl px-4 py-3 border border-white/10 min-h-24">
                                                <TextInput
                                                    className="text-white text-base flex-1"
                                                    placeholder="Enter card description"
                                                    placeholderTextColor="#6B7280"
                                                    value={cardDescription}
                                                    onChangeText={setCardDescription}
                                                    multiline
                                                    numberOfLines={4}
                                                    textAlignVertical="top"
                                                    editable={!loading}
                                                />
                                            </View>
                                        </View>

                                        {/* Add/Update Button */}
                                        <Pressable
                                            onPress={handleAddCard}
                                            disabled={loading}
                                            style={{ opacity: loading ? 0.6 : 1 }}
                                        >
                                            <LinearGradient
                                                colors={[
                                                    'rgb(26, 15, 46)',
                                                    'rgb(45, 27, 78)',
                                                    'rgb(74, 44, 109)',
                                                    'rgb(45, 27, 78)',
                                                    'rgb(26, 15, 46)',
                                                ]}
                                                locations={[0, 0.25, 0.5, 0.75, 1]}
                                                style={{
                                                    height: 56,
                                                    borderRadius: 16,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }}>
                                                    {loading ? (isEditing ? 'UPDATING...' : 'ADDING...') : (isEditing ? 'UPDATE CARD' : 'ADD CARD')}
                                                </Text>
                                            </LinearGradient>
                                        </Pressable>
                                    </LinearGradient>
                                </View>

                                {/* Info Text */}
                                <View className="mt-8 items-center">
                                    <Text className="text-gray-500 text-xs text-center leading-5">
                                        {isEditing ? 'Update the oracle card information below.' : 'Add a new oracle card to your collection. Fill in all fields to continue.'}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}
