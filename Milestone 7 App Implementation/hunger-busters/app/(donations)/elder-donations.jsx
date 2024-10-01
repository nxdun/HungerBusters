import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';

const donationOptions = [
  { id: 1, label: 'Monetary', value: 'monetary' },
  { id: 2, label: 'Food', value: 'food' },
  { id: 3, label: 'Clothing', value: 'clothing' },
  { id: 4, label: 'Other', value: 'other' }
];

const ElderDonations = () => {
  const [form, setForm] = useState({
    elderHomeName: '',
    eldersCount: '',
    elderHomeAddress: '',
    contactNumber: '',
    contactPerson: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedDonations, setSelectedDonations] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedDonations((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate form fields
    if (!form.elderHomeName || !form.eldersCount || !form.elderHomeAddress || !form.contactNumber || !form.contactPerson) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (selectedDonations.length === 0) {
      setError('Please select at least one donation type.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://192.168.x.x:3543/api/v1/elder-donations', {
        ...form,
        donationTypes: selectedDonations
      });
      console.log('Donation request submitted successfully:', response.data.message);
      // Do something after successful submission (like navigation or form reset)
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
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Elder Home Donation Request</Text>

          <FormField 
            title="Elder Home Name"
            value={form.elderHomeName}
            handleChangeText={(e) => setForm({ ...form, elderHomeName: e })}
            otherStyles="mt-10"
          />

          <FormField 
            title="Elders Count"
            value={form.eldersCount}
            handleChangeText={(e) => setForm({ ...form, eldersCount: e })}
            otherStyles="mt-7"
            keyboardType="numeric"
          />

          <FormField 
            title="Elder Home Address"
            value={form.elderHomeAddress}
            handleChangeText={(e) => setForm({ ...form, elderHomeAddress: e })}
            otherStyles="mt-7"
          />

          <FormField 
            title="Contact Number"
            value={form.contactNumber}
            handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
            otherStyles="mt-7"
            keyboardType="phone-pad"
          />

          <FormField 
            title="Contact Person"
            value={form.contactPerson}
            handleChangeText={(e) => setForm({ ...form, contactPerson: e })}
            otherStyles="mt-7"
          />

          {/* Donation Type Checkboxes */}
          <Text className="text-lg text-white mt-7">Donation Type</Text>
          {donationOptions.map((option) => (
            <TouchableOpacity key={option.id} onPress={() => handleCheckboxChange(option.value)} className="flex-row items-center mt-2">
              <View className={`w-5 h-5 border-2 border-white rounded-lg ${selectedDonations.includes(option.value) ? 'bg-secondary' : 'bg-transparent'}`}>
                {selectedDonations.includes(option.value) && <View className="w-full h-full bg-white rounded-lg" />}
              </View>
              <Text className="text-white ml-2">{option.label}</Text>
            </TouchableOpacity>
          ))}

          <FormField 
            title="Special Requests or Notes"
            value={form.specialRequests}
            handleChangeText={(e) => setForm({ ...form, specialRequests: e })}
            otherStyles="mt-7"
            placeholder="Any special needs or requests"
          />

          {error ? <Text className="text-red-500 mt-4">{error}</Text> : null}

          <CustomButton 
            title="Submit"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ElderDonations;
