import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Heart } from 'lucide-react-native';
import * as Location from 'expo-location';
import { fetchWeatherByCity, fetchWeatherByCoords } from '@/lib/weather';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { WeatherData } from '@/types/weather';
import WeatherCard from '@/components/WeatherCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { user } = useAuth();

  const searchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city.trim());
      setWeather(data);
    } catch (error) {
      Alert.alert('Error', 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to use this feature.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const data = await fetchWeatherByCoords(latitude, longitude);
      setWeather(data);
      setCity(data.name);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location weather.');
    } finally {
      setLocationLoading(false);
    }
  };

  const addToFavorites = async () => {
    if (!weather || !user) return;

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('city_name', weather.name)
        .single();

      if (existing) {
        Alert.alert('Info', 'This city is already in your favorites.');
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            city_name: weather.name,
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', `${weather.name} added to favorites!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add to favorites.');
    }
  };

  return (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} className="flex-1">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="px-6 py-4">
            <Text className="text-white text-2xl font-bold mb-2">
              Search Weather
            </Text>
            <Text className="text-white/80 text-base mb-6">
              Find weather for any city worldwide
            </Text>

            <View className="space-y-4">
              <View className="bg-white/20 rounded-2xl p-4 flex-row items-center">
                <Search size={20} color="white" className="mr-3" />
                <TextInput
                  className="flex-1 text-white placeholder-white/70 text-base"
                  placeholder="Enter city name..."
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={city}
                  onChangeText={setCity}
                  onSubmitEditing={searchWeather}
                  returnKeyType="search"
                />
              </View>

              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className={`flex-1 bg-white/20 rounded-xl py-4 ${loading ? 'opacity-50' : ''}`}
                  onPress={searchWeather}
                  disabled={loading || !city.trim()}
                >
                  <Text className="text-white font-semibold text-center">
                    {loading ? 'Searching...' : 'Search'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`bg-white/20 rounded-xl px-4 py-4 ${locationLoading ? 'opacity-50' : ''}`}
                  onPress={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <LoadingSpinner size={20} />
                  ) : (
                    <MapPin size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-1">
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <LoadingSpinner size={50} />
                <Text className="text-white/80 text-center mt-4">
                  Searching for weather data...
                </Text>
              </View>
            ) : weather ? (
              <View className="flex-1">
                <WeatherCard weather={weather} />
                
                <View className="px-6 mt-4">
                  <TouchableOpacity
                    className="bg-white/20 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={addToFavorites}
                  >
                    <Heart size={20} color="white" className="mr-2" />
                    <Text className="text-white font-semibold ml-2">
                      Add to Favorites
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center px-8">
                <View className="bg-white/10 rounded-full p-8 mb-6">
                  <Search size={48} color="white" strokeWidth={1.5} />
                </View>
                <Text className="text-white text-xl font-semibold mb-2">
                  Search for a city
                </Text>
                <Text className="text-white/80 text-center">
                  Enter a city name above or use your current location to get weather information.
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}