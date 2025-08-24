import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Heart, LogOut } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { fetchWeatherByCity } from '@/lib/weather';
import { useAuth } from '@/hooks/useAuth';
import { WeatherData, FavoriteCity } from '@/types/weather';
import WeatherCard from '@/components/WeatherCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomeScreen() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
      
      // Load weather data for favorites
      if (data && data.length > 0) {
        const weatherPromises = data.map((fav) =>
          fetchWeatherByCity(fav.city_name)
        );
        const weatherResults = await Promise.allSettled(weatherPromises);
        const validWeather = weatherResults
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<WeatherData>).value);
        
        setWeatherData(validWeather);
      } else {
        setWeatherData([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const removeFavorite = async (cityName: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('city_name', cityName);

      if (error) throw error;
      loadFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  return (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-white text-2xl font-bold">
              Welcome back! 👋
            </Text>
            <Text className="text-white/80 text-base">
              Your favorite cities
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white/20 p-3 rounded-full"
          >
            <LogOut size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="white"
            />
          }
        >
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <LoadingSpinner size={50} />
              <Text className="text-white/80 text-center mt-4">
                Loading your favorites...
              </Text>
            </View>
          ) : weatherData.length === 0 ? (
            <Animated.View
              entering={FadeInDown}
              className="flex-1 items-center justify-center py-20"
            >
              <View className="bg-white/10 rounded-full p-8 mb-6">
                <Heart size={48} color="white" strokeWidth={1.5} />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                No favorites yet
              </Text>
              <Text className="text-white/80 text-center px-8 mb-8">
                Search for cities and add them to your favorites to see weather updates here.
              </Text>
              <View className="bg-white/20 rounded-2xl p-4 mx-6">
                <View className="flex-row items-center">
                  <View className="bg-white/20 rounded-full p-2 mr-3">
                    <Plus size={16} color="white" />
                  </View>
                  <Text className="text-white/90 text-sm">
                    Use the Search tab to find and save cities
                  </Text>
                </View>
              </View>
            </Animated.View>
          ) : (
            <View className="pb-6">
              {weatherData.map((weather, index) => (
                <WeatherCard
                  key={weather.name}
                  weather={weather}
                  index={index}
                  onPress={() =>
                    Alert.alert(
                      weather.name,
                      'Remove from favorites?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Remove',
                          style: 'destructive',
                          onPress: () => removeFavorite(weather.name),
                        },
                      ]
                    )
                  }
                />
              ))}
              
              <View className="items-center mt-4 px-6">
                <Text className="text-white/70 text-sm text-center">
                  Pull down to refresh weather data
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}