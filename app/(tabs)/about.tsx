import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Info, 
  Heart, 
  Cloud, 
  Smartphone, 
  Globe, 
  Mail, 
  ExternalLink 
} from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const features = [
    {
      icon: Cloud,
      title: 'Real-time Weather',
      description: 'Get accurate weather data powered by OpenWeatherMap API',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Weather information for cities worldwide at your fingertips',
    },
    {
      icon: Heart,
      title: 'Favorite Cities',
      description: 'Save and track weather for your favorite locations',
    },
    {
      icon: Smartphone,
      title: 'Modern Design',
      description: 'Beautiful, intuitive interface built with React Native',
    },
  ];

  return (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            <Animated.View
              entering={FadeInUp}
              className="items-center mb-8"
            >
              <View className="bg-white/20 rounded-full p-6 mb-4">
                <Cloud size={48} color="white" strokeWidth={1.5} />
              </View>
              <Text className="text-white text-3xl font-bold mb-2">
                Weatherly
              </Text>
              <Text className="text-white/80 text-center text-lg">
                Your personal weather companion
              </Text>
              <View className="bg-white/20 rounded-full px-4 py-2 mt-3">
                <Text className="text-white text-sm font-medium">
                  Version 1.0.0
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(200)}
              className="mb-8"
            >
              <Text className="text-white text-xl font-semibold mb-4">
                Features
              </Text>
              <View className="space-y-4">
                {features.map((feature, index) => (
                  <Animated.View
                    key={feature.title}
                    entering={FadeInUp.delay(300 + index * 100)}
                    className="bg-white/20 rounded-2xl p-4 flex-row items-start"
                  >
                    <View className="bg-white/20 rounded-full p-3 mr-4">
                      <feature.icon size={24} color="white" strokeWidth={1.5} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-lg mb-1">
                        {feature.title}
                      </Text>
                      <Text className="text-white/80 text-sm">
                        {feature.description}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(700)}
              className="mb-8"
            >
              <Text className="text-white text-xl font-semibold mb-4">
                About the App
              </Text>
              <View className="bg-white/20 rounded-2xl p-6">
                <Text className="text-white/90 text-base leading-6 mb-4">
                  Weatherly is a modern weather application built with React Native and Expo. 
                  It provides real-time weather information, forecasts, and the ability to 
                  track your favorite cities.
                </Text>
                <Text className="text-white/90 text-base leading-6 mb-4">
                  The app uses Supabase for user authentication and data storage, 
                  ensuring your favorite cities are synced across all your devices.
                </Text>
                <Text className="text-white/80 text-sm">
                  Weather data is provided by OpenWeatherMap, offering accurate and 
                  up-to-date information for locations worldwide.
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(900)}
              className="mb-8"
            >
              <Text className="text-white text-xl font-semibold mb-4">
                Technologies Used
              </Text>
              <View className="bg-white/20 rounded-2xl p-6">
                <View className="space-y-3">
                  <Text className="text-white/90 text-base">
                    • React Native & Expo
                  </Text>
                  <Text className="text-white/90 text-base">
                    • Supabase (Authentication & Database)
                  </Text>
                  <Text className="text-white/90 text-base">
                    • OpenWeatherMap API
                  </Text>
                  <Text className="text-white/90 text-base">
                    • NativeWind (Tailwind CSS)
                  </Text>
                  <Text className="text-white/90 text-base">
                    • React Native Reanimated
                  </Text>
                  <Text className="text-white/90 text-base">
                    • Expo Location Services
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(1100)}
              className="mb-6"
            >
              <Text className="text-white text-xl font-semibold mb-4">
                Contact & Support
              </Text>
              <View className="space-y-3">
                <TouchableOpacity
                  className="bg-white/20 rounded-xl p-4 flex-row items-center"
                  onPress={() => openLink('https://openweathermap.org')}
                >
                  <ExternalLink size={20} color="white" className="mr-3" />
                  <View className="flex-1">
                    <Text className="text-white font-medium">
                      OpenWeatherMap
                    </Text>
                    <Text className="text-white/70 text-sm">
                      Weather data provider
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white/20 rounded-xl p-4 flex-row items-center"
                  onPress={() => openLink('https://supabase.com')}
                >
                  <ExternalLink size={20} color="white" className="mr-3" />
                  <View className="flex-1">
                    <Text className="text-white font-medium">
                      Supabase
                    </Text>
                    <Text className="text-white/70 text-sm">
                      Backend infrastructure
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(1300)}
              className="items-center py-8"
            >
              <Text className="text-white/70 text-sm text-center">
                Made with ❤️ for weather enthusiasts
              </Text>
              <Text className="text-white/60 text-xs text-center mt-2">
                © 2024 Weatherly. All rights reserved.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}