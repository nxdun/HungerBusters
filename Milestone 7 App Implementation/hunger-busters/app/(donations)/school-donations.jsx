import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'; // Import Alert here
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
  
      console.log('Document selection result:', result); // Log result for debugging
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0]; // Extract the first document from the assets array
        setSelectedDocument(selectedFile); // Set the selected document
        console.log('Document selected:', selectedFile);
      } else {
        console.log('Document selection canceled or no assets found');
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  // Function to remove the selected document
  const removeDocument = () => {
    setSelectedDocument(null);
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
      const response = await axios.post('http://192.168.113.235:3543/api/v1/school-donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Donation form submitted successfully:', response.data.message);
      // Show success alert
      Alert.alert('Success', 'Donation request submitted successfully.');

      // Reset form after successful submission
      setForm({
        schoolName: '',
        contactNumber: '',
        principalName: '',
        address: ''
      });
      setSelectedDocument(null); // Reset selected document
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
          {!selectedDocument ? (
            <TouchableOpacity onPress={pickDocument} className="mt-7 bg-secondary p-4 rounded-lg">
              <Text className="text-white text-center">Upload Document</Text>
            </TouchableOpacity>
          ) : (
            <View className="mt-7">
              <Text className="text-white text-center mb-2">Selected File: {selectedDocument.name}</Text>
              <TouchableOpacity onPress={removeDocument} className="bg-red-500 p-3 rounded-lg">
                <Text className="text-white text-center">Remove Document</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Accepted file types message */}
          <Text className="text-gray-300 text-sm mt-2 text-center">
            Document name: schoolName.Docx/Doc/Pdf
          </Text>
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
