import { View, Text, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import axios from 'axios';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const submit = async () => {
    setIsSubmitting(true);
    setError('');
  
    // Validate form fields
    if (!form.email || !form.password) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axios.post(`${apiUrl}/api/v1/auth`, form);
  
      // Log the full response
      console.log('Response:', response.data);
  
      // Extract token and user data correctly
      const { token, user } = response.data.data;
      const { role, username, email } = user;
  
      // Ensure token exists before attempting to save it
      if (token) {
        // Store token and user details in AsyncStorage
        await AsyncStorage.setItem('userToken', token);  // Store token
        await AsyncStorage.setItem('userRole', role);    // Store role
        await AsyncStorage.setItem('userEmail', email);  // Store email
        await AsyncStorage.setItem('username', username); // Store username
      } else {
        throw new Error('Token is undefined');
      }
  
      // Handle successful login
      console.log('Login successful:', response.data.message);
  
      // Redirect based on user role
      if (role === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/home'); // Default redirect for regular users
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[350px] h-[190px]" />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to Hunger Busters</Text>
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}
            otherStyles="mt-7"
            secureTextEntry={true} // To hide the password
          />
          {error ? <Text className="text-red-500">{error}</Text> : null}
          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;
