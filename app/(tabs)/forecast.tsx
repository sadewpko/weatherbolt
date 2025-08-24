import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Search } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { fetchForecastByCity, getWeatherIcon } from '@/lib/weather';
import { ForecastData } from '@/types/weather';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ForecastScreen() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  const searchForecast = async () => {
    if (!city.trim()) return;

    setLoading(true);
    try {
      const data = await fetchForecastByCity(city.trim());
      setForecast(data);
    } catch (error) {
      Alert.alert('Error', 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDailyForecast = () => {
    if (!forecast) return [];

    const dailyData: any[] = [];
    const today = new Date().toDateString();

    forecast.list.forEach((item) => {
      const itemDate = new Date(item.dt * 1000);
      const dateString = itemDate.toDateString();

      if (dateString === today) return; // Skip today

      const existingDay = dailyData.find((day) => day.date === dateString);

      if (!existingDay) {
        dailyData.push({
          date: dateString,
          day: itemDate.toLocaleDateString('en', { weekday: 'short' }),
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
      } else {
        // Update min/max temps for the day
        existingDay.temp_min = Math.min(existingDay.temp_min, item.main.temp_min);
        existingDay.temp_max = Math.max(existingDay.temp_max, item.main.temp_max);
      }
    });

    return dailyData.slice(0, 5); // Return 5-day forecast
  };

  return (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-white text-2xl font-bold mb-2">
            5-Day Forecast
          </Text>
          <Text className="text-white/80 text-base mb-6">
            Get extended weather predictions
          </Text>

          <View className="bg-white/20 rounded-2xl p-4 flex-row items-center mb-4">
            <Search size={20} color="white" className="mr-3" />
            <TextInput
              className="flex-1 text-white placeholder-white/70 text-base"
              placeholder="Enter city name..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={searchForecast}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            className={`bg-white/20 rounded-xl py-4 ${loading ? 'opacity-50' : ''}`}
            onPress={searchForecast}
            disabled={loading || !city.trim()}
          >
            <Text className="text-white font-semibold text-center">
              {loading ? 'Loading Forecast...' : 'Get Forecast'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <LoadingSpinner size={50} />
              <Text className="text-white/80 text-center mt-4">
                Loading forecast data...
              </Text>
            </View>
          ) : forecast ? (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="px-6 pb-6">
                <Text className="text-white text-xl font-semibold mb-4">
                  {forecast.city.name}, {forecast.city.country}
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-6"
                >
                  {getDailyForecast().map((day, index) => (
                    <Animated.View
                      key={day.date}
                      entering={FadeInRight.delay(index * 100)}
                      className="bg-white/20 rounded-2xl p-4 mr-4 items-center min-w-[140px]"
                    >
                      <Text className="text-white font-semibold text-lg mb-2">
                        {day.day}
                      </Text>
                      <Image
                        source={{ uri: getWeatherIcon(day.icon) }}
                        className="w-12 h-12 mb-2"
                        resizeMode="contain"
                      />
                      <Text className="text-white/90 text-sm text-center mb-3 capitalize">
                        {day.description}
                      </Text>
                      <View className="items-center">
                        <Text className="text-white text-xl font-bold">
                          {Math.round(day.temp_max)}°
                        </Text>
                        <Text className="text-white/70 text-sm">
                          {Math.round(day.temp_min)}°
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </ScrollView>

                <View className="bg-white/10 rounded-2xl p-4">
                  <Text className="text-white/90 text-sm text-center">
                    💡 Swipe horizontally to see all forecast days
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center px-8">
              <View className="bg-white/10 rounded-full p-8 mb-6">
                <Calendar size={48} color="white" strokeWidth={1.5} />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                Get 5-Day Forecast
              </Text>
              <Text className="text-white/80 text-center">
                Enter a city name above to view the extended weather forecast for the next 5 days.
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}