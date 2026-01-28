import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import RandomCard from './RandomCard';

const { width } = Dimensions.get('window');
const CARD_COUNT = 5;

const ORACLE_CARDS = [
  { title: 'Take a Step Forward', message: 'Do a step forward. Everything else will come along the way.' },
  { title: 'Trust the Pause', message: 'Stillness is not stagnation. Something is aligning.' },
  { title: 'Release Control', message: 'What you let go of makes space for what is meant.' },
];

export default function OracleCard() {
  const [shuffling, setShuffling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedCard, setSelectedCard] = useState(ORACLE_CARDS[0]);

  const deckScale = useRef(new Animated.Value(1)).current;
  const deckOpacity = useRef(new Animated.Value(1)).current;
  const cardAnimations = useRef<Array<{x: Animated.Value; y: Animated.Value; rotate: Animated.Value; opacity: Animated.Value; scale: Animated.Value}>>([]);

  // Initialize card animations
  if (cardAnimations.current.length === 0) {
    for (let i = 0; i < CARD_COUNT; i++) {
      cardAnimations.current.push({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        rotate: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(1),
      });
    }
  }

  const onShuffleFinished = useCallback(() => {
    const random = ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
    setSelectedCard(random);
    
    setTimeout(() => {
      setShowResult(true);
    }, 200);
  }, []);

  const startShuffle = () => {
    if (shuffling) return;
    
    setShowResult(false);
    setShuffling(true);
    Animated.timing(deckOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Animate all cards
    const animations = cardAnimations.current.map((anim, index) => {
      const isEven = index % 2 === 0;
      const direction = isEven ? -1 : 1;
      const delay = index * 35;

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.sequence([
            Animated.timing(anim.x, {
              toValue: direction * (width * 0.4),
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.timing(anim.x, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.rotate, {
              toValue: direction * 15,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(anim.scale, {
              toValue: 1.1,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }),
          ]),
        ]).start();
      }, delay);

      return anim;
    });

    // Trigger result after shuffle completes
    setTimeout(() => {
      setShuffling(false);
      onShuffleFinished();
      Animated.timing(deckOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 1500);
  };

  const closeResult = () => {
    setShowResult(false);
    setShuffling(false);
  };

  return (
    <View className="flex-1 items-center justify-center">
      {/* Shuffle cards layer */}
      {cardAnimations.current.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            {
              position: 'absolute',
              width: 260,
              height: 400,
              borderRadius: 24,
              backgroundColor: '#1a1a1a',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 15,
              elevation: 10,
              opacity: anim.opacity,
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [-360, 0, 360],
                    outputRange: ['-360deg', '0deg', '360deg'],
                  }),
                },
                { scale: anim.scale },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#2c3e50', '#000000']}
            className="flex-1 rounded-[24px] items-center justify-center"
          >
            <View className="w-40 h-60 border border-white/5 rounded-full opacity-20" />
          </LinearGradient>
        </Animated.View>
      ))}

      {/* Main deck */}
      {!shuffling && (
        <Pressable
          onPressIn={() => {
            Animated.timing(deckScale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }}
          onPressOut={() => {
            Animated.timing(deckScale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }}
          onPress={startShuffle}
        >
          <Animated.View
            style={{
              opacity: deckOpacity,
              transform: [{ scale: deckScale }],
            }}
          >
            <View className="w-72 h-[420px] rounded-[32px] bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl">
              <LinearGradient
                colors={['#1e1e1e', '#000']}
                className="flex-1 justify-between p-8"
              >
                <View className="items-center">
                  <Text className="text-amber-200/40 tracking-[4px] uppercase text-[10px] font-bold">The Oracle</Text>
                  <View className="h-[1px] w-12 bg-amber-200/20 mt-2" />
                </View>

                <View className="items-center">
                  <Text className="text-white text-4xl font-light text-center">Conscious Lead</Text>
                  <Text className="text-amber-200/60 italic mt-4">Tap to Shuffle</Text>
                </View>

                <Text className="text-white/10 text-center text-xs italic">By Karina Conscious</Text>
              </LinearGradient>
            </View>
          </Animated.View>
        </Pressable>
      )}

      {/* Result popup */}
      <RandomCard
        visible={showResult}
        card={selectedCard}
        onClose={closeResult}
      />
    </View>
  );
}