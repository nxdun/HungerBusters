import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, Button, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur'; // Glassmorphism effect
import { images } from "../../constants";
import ShaderCanvas from '../shaderCanvas';
const dummyRequestData = {
  approved: 12,
  total: 45,
  expired: 12,
  pending: 12,
};

const dummyTableData = [
  { date: '2023-09-01', status: 'Approved', expiry: '2023-12-01', delivery: 'Pending' },
  { date: '2023-09-05', status: 'Expired', expiry: '2023-11-05', delivery: 'Completed' },
];

const dummyPendingApprovals = [
  { id: 1, image: images.logo, description: 'Approval 1' },
  { id: 2, image: images.logo, description: 'Approval 2' },
];

const ExpertDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestData, setRequestData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setRequestData(dummyRequestData);
        setTableData(dummyTableData);
        setPendingApprovals(dummyPendingApprovals);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
      <ShaderCanvas/>
      <FlatList
        data={pendingApprovals}
        ListHeaderComponent={
          <>
            {/* Top Bar */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Experts Dashboard</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 10 }}>09:45 AM</Text>
                {/* Add battery and connection icons here */}
              </View>
            </View>

            {/* Summary Cards */}
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <SummaryCard title="Approved Requests" value={requestData.approved} color="#E5F4E3" />
                <SummaryCard title="Total Requests" value={requestData.total} color="#F9E6A0" />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SummaryCard title="Expired Requests" value={requestData.expired} color="#F9B3B3" />
                <SummaryCard title="Pending Requests" value={requestData.pending} color="#B4C7C5" />
              </View>

              {/* Table Section */}
              <View style={{ marginTop: 20, backgroundColor: '#EDEFF2', padding: 12, borderRadius: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                  <Text style={{ fontWeight: '600' }}>Date</Text>
                  <Text style={{ fontWeight: '600' }}>Status</Text>
                  <Text style={{ fontWeight: '600', color: '#FF4B4B' }}>Expiry</Text>
                  <Text style={{ fontWeight: '600' }}>Delivery</Text>
                </View>
                {tableData.map((row, index) => (
                  <TableRow key={index} {...row} />
                ))}
              </View>

              {/* Pending Approvals */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Pending Approvals</Text>
                <View style={{ height: 2, backgroundColor: '#000', width: '100%', marginBottom: 10 }} />
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => <PendingApprovalCard image={item.image} description={item.description} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, color }) => (
  <View style={{ backgroundColor: color, padding: 20, borderRadius: 10, width: '47%', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } }}>
    <Text style={{ fontSize: 18, fontWeight: '700' }}>{value}</Text>
    <Text style={{ fontSize: 16, color: '#666', marginTop: 5 }}>{title}</Text>
  </View>
);

// TableRow Component
const TableRow = ({ date, status, expiry, delivery }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#DDD' }}>
    <Text>{date}</Text>
    <Text>{status}</Text>
    <Text style={{ color: '#FF4B4B' }}>{expiry}</Text>
    <Text>{delivery}</Text>
  </View>
);

// Pending Approval Card Component
const PendingApprovalCard = ({ image, description }) => (
  <View style={{ backgroundColor: '#FFF', padding: 15, marginBottom: 15, borderRadius: 12, width: '47%', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } }}>
    <Image source={image} style={{ width: '100%', height: 120, borderRadius: 10 }} resizeMode="contain" />
    <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '500' }}>{description}</Text>
    <TouchableOpacity style={{ marginTop: 8 }}>
      <Button title="Browse" />
    </TouchableOpacity>
  </View>
);

export default ExpertDashboard;
