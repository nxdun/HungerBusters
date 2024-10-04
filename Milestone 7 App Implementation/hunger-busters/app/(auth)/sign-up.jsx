import { View, Text, ScrollView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import axios from 'axios';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();


  const submit = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate form fields
    if (!form.username || !form.email || !form.password) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    try {
      // uSE ENVIROMENT VARIABLE TO SET DYNAMIC URL
      const response = await axios.post(`${apiUrl}/api/v1/users`, form);
      console.log('User created successfully:', response.data.message);
      router.replace('/sign-in');
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
          <Image source={images.logo} resizeMode="contain" className="w-[350px] h-[190px]" />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign up to Hunger Busters
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          {error ? <Text className="text-red-500">{error}</Text> : null}

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
