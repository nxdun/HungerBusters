import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

const SchoolDonations = () => {
  const [form, setForm] = useState({
    schoolName: '',
    contactNumber: '',
    principalName: '',
    address: ''
  });

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Function to handle document selection
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // For DOCX files
        ],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setSelectedDocument(result);
        console.log('Document selected:', result);
      } else {
        console.log('Document selection canceled');
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate form fields
    if (!form.schoolName || !form.contactNumber || !form.principalName || !form.address) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (!selectedDocument) {
      setError('Please upload a document containing student details.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a FormData object to upload the file and form data
      const formData = new FormData();
      formData.append('schoolName', form.schoolName);
      formData.append('contactNumber', form.contactNumber);
      formData.append('principalName', form.principalName);
      formData.append('address', form.address);
      formData.append('studentDetailsFile', {
        uri: selectedDocument.uri,
        type: selectedDocument.mimeType || 'application/octet-stream',
        name: selectedDocument.name
      });

      // Assuming you're posting the form data to this endpoint
      const response = await axios.post('http://192.168.x.x:3543/api/v1/school-donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Donation form submitted successfully:', response.data.message);
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
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">School Donations Form</Text>
          
          <FormField 
            title="Enter School Name"
            value={form.schoolName}
            handleChangeText={(e) => setForm({ ...form, schoolName: e })}
            otherStyles="mt-10"
          />

          <FormField 
            title="School Contact Number"
            value={form.contactNumber}
            handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
            otherStyles="mt-7"
            keyboardType="phone-pad"
          />

          <FormField 
            title="Principal Name"
            value={form.principalName}
            handleChangeText={(e) => setForm({ ...form, principalName: e })}
            otherStyles="mt-7"
          />

          <FormField 
            title="School Address"
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyles="mt-7"
          />

          {/* Document Upload Section */}
          <TouchableOpacity onPress={pickDocument} className="mt-7 bg-secondary p-4 rounded-lg">
            <Text className="text-white text-center">
              {selectedDocument ? `Selected File: ${selectedDocument.name}` : 'Upload Document'}
            </Text>
          </TouchableOpacity>

          {/* Accepted file types message */}
          <Text className="text-gray-300 text-sm mt-2 text-center">
            Accepted formats: PDF, DOC, DOCX
          </Text>

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

export default SchoolDonations;
