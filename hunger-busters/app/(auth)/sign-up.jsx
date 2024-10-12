import { View, Text, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
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
    password: '',
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="w-full justify-center min-h-[85vh] px-6 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[300px] h-[150px] mx-auto mt-5"
            />
            <Text className="text-3xl text-white text-center font-bold mt-8">
              Sign up to Hunger Busters
            </Text>

            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-12"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-8"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-8"
              secureTextEntry
            />

            {error ? (
              <Text className="text-red-500 text-center mt-4">
                {error}
              </Text>
            ) : null}

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-8"
              isLoading={isSubmitting}
            />

            <View className="flex-row justify-center mt-8">
              <Text className="text-lg text-gray-300">
                Have an account already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg text-secondary ml-2 font-semibold"
              >
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>

        <View className="justify-center pb-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Are you a Expert?
          </Text>
          <Link
            href="/sign-up-expert"
            className="text-lg font-psemibold text-secondary"
          >
            Sign up As Expert
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
