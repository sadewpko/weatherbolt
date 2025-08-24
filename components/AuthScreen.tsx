import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      Alert.alert('Error', error.message);
    }
    
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#8b5cf6']}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 px-6"
        >
          <View className="flex-1 justify-center py-12">
            <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
              <Text className="text-4xl font-bold text-white text-center mb-2">
                Weatherly
              </Text>
              <Text className="text-white/80 text-center mb-8">
                Your personal weather companion
              </Text>

              <View className="space-y-4">
                <TextInput
                  className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70"
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextInput
                  className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70"
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <TouchableOpacity
                  className={`bg-white rounded-xl py-4 mt-6 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleAuth}
                  disabled={loading}
                >
                  <Text className="text-primary-600 font-semibold text-center text-lg">
                    {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-4"
                  onPress={() => setIsSignUp(!isSignUp)}
                >
                  <Text className="text-white/80 text-center">
                    {isSignUp
                      ? 'Already have an account? Sign In'
                      : "Don't have an account? Sign Up"
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}