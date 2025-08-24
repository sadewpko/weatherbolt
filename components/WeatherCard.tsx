import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon } from '@/lib/weather';

interface WeatherCardProps {
  weather: WeatherData;
  onPress?: () => void;
  index?: number;
}

export default function WeatherCard({ weather, onPress, index = 0 }: WeatherCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const CardContent = (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={animatedStyle}
      className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mx-4 mb-4 border border-white/30"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-1">
            {weather.name}
          </Text>
          <Text className="text-white/80 text-base mb-4 capitalize">
            {weather.weather[0].description}
          </Text>
          <Text className="text-white text-4xl font-light">
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            Feels like {Math.round(weather.main.feels_like)}°C
          </Text>
        </View>
        
        <View className="items-center">
          <Image
            source={{ uri: getWeatherIcon(weather.weather[0].icon) }}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <View className="bg-white/20 rounded-full px-3 py-1 mt-2">
            <Text className="text-white/90 text-xs font-medium">
              {weather.main.humidity}% humidity
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}