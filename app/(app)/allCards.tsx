import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardAction from '../../components/CardAction';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const ORACLE_CARDS = [
  { id: 1, title: 'Take a Step Forward', message: 'Do a step forward. Everything else will come along the way.' },
  { id: 2, title: 'Trust the Pause', message: 'Stillness is not stagnation. Something is aligning.' },
  { id: 3, title: 'Release Control', message: 'What you let go of makes space for what is meant.' },
  { id: 4, title: 'Embrace Change', message: 'Transformation is the path to your true self.' },
  { id: 5, title: 'Find Your Light', message: 'Even in darkness, your inner light guides you.' },
  { id: 6, title: 'Trust Yourself', message: 'Your intuition knows the way forward.' },
];

export default function AllCardsScreen() {
  const [cards, setCards] = useState(ORACLE_CARDS);
  const [selectedCard, setSelectedCard] = useState<(typeof ORACLE_CARDS[0]) | null>(null);
  const [isCardActionVisible, setIsCardActionVisible] = useState(false);

  const handleCardPress = (card: typeof ORACLE_CARDS[0]) => {
    setSelectedCard(card);
    setIsCardActionVisible(true);
  };

  const handleDeleteCard = (cardId: number) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const renderCard = ({ item }: { item: typeof ORACLE_CARDS[0] }) => (
    <Pressable
      style={{ width: CARD_WIDTH, marginBottom: 16 }}
      onPress={() => handleCardPress(item)}
    >
      <View className="rounded-[24px] overflow-hidden shadow-lg">
        <LinearGradient
          colors={['#1e1e1e', '#000']}
          className="p-6 justify-between"
          style={{ minHeight: 220 }}
        >
          <View className="items-center">
            <Text className="text-amber-200/40 tracking-[3px] uppercase text-[8px] font-bold">Oracle</Text>
            <View className="h-[1px] w-12 bg-amber-200/20 mt-1.5" />
          </View>

          <View className="items-center">
            <Text className="text-white text-lg font-light text-center leading-6">
              {item.title}
            </Text>
          </View>

          <Text className="text-gray-500 text-center text-xs italic">Card {item.id}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between">
            {/* Right: Back Button */}
            <Link href="/(app)/home" asChild>
              <Pressable>
                <Ionicons name="chevron-back" size={24} color="#9CA3AF" />
              </Pressable>
            </Link>

            {/* Center: All Cards Title */}
            <Text className="text-gray-400 text-sm tracking-[2px] uppercase font-light">
              All Cards
            </Text>

            {/* Left: Card Count with Border */}
            <View className="border border-amber-200/40 rounded-lg px-4 py-2">
              <Text className="text-amber-200/60 text-xs tracking-[1px] uppercase font-light">
                {cards.length} Cards
              </Text>
            </View>
          </View>
        </View>

        {/* Cards Grid */}
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          scrollIndicatorInsets={{ right: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Floating Action Button */}
      <Link href="/(app)/addCard" asChild>
        <Pressable
          style={{
            position: 'absolute',
            bottom: 32,
            right: 24,
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={['#D946EF', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="add" size={32} color="white" />
          </LinearGradient>
        </Pressable>
      </Link>

      {/* Card Action Modal */}
      {selectedCard && (
        <CardAction
          visible={isCardActionVisible}
          onClose={() => setIsCardActionVisible(false)}
          card={selectedCard}
          onDelete={handleDeleteCard}
        />
      )}
    </View>
  );
}
