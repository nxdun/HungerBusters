import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Table, Row, Rows } from "react-native-table-component";
import { images } from "../../constants";
import ShaderCanvas from "../shaderCanvas";
import { router } from "expo-router";
import TransparentTopBar from "../../components/TransparentTopBar"; // Importing the TransparentTopBar component

const dummyRequestData = {
  approved: 12,
  total: 45,
  expired: 12,
  pending: 12,
};

const dummyTableData = [
  ["2023-09-01", "Approved", "2023-12-01", "Pending"],
  ["2023-09-05", "Expired", "2023-11-05", "Completed"],
  ["2023-08-05", "Expired", "2023-11-05", "Complete"],
  ["2023-09-05", "Expired", "2023-11-05", "Completed"],
  ["2023-09-05", "Expired", "2023-11-05", "Completed"],
  ["2023-09-05", "Expired", "2023-11-05", "Completed"],
];

const dummyPendingApprovals = [
  { id: 1, image: images.logo, description: "Approval 1" },
  { id: 2, image: images.logo, description: "Approval 2" },
  { id: 3, image: images.logo, description: "Approval 3" },
  { id: 4, image: images.logo, description: "Approval 4" },
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
    }, 1000);
  };

  const handleBackPress = () => {
    router.push("/"); // Navigate back to home or any other page
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Function to render summary cards, table, and pending approvals
  const renderDashboardContent = () => {
    return (
      <>
        {/* Summary Cards */}
        <View className="px-4 mt-3">
          <View className="flex-row justify-between mb-4">
            <SummaryCard title="Approved Requests" value={requestData.approved} color="bg-green-100" />
            <SummaryCard title="Total Requests" value={requestData.total} color="bg-yellow-200" />
          </View>
          <View className="flex-row justify-between">
            <SummaryCard title="Expired Requests" value={requestData.expired} color="bg-red-200" />
            <SummaryCard title="Pending Requests" value={requestData.pending} color="bg-teal-300" />
          </View>
        </View>

        {/* Table Section */}
        <View className="mt-5 p-3 rounded-2xl shadow">
          <TouchableOpacity onPress={() => router.push('/analysis-dashboard')}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#DDDDDD" }}>
              <Row
                data={["Date", "Status", "Expiry", "Delivery"]}
                style={{ height: 40, backgroundColor: "#f1f1f1" }}
                textStyle={{ fontWeight: "600", textAlign: "center", color: "#333" }}
              />
              <Rows
                data={tableData}
                textStyle={{ margin: 6, textAlign: "center", color: "#000" }}
              />
            </Table>
          </TouchableOpacity>
        </View>

        {/* Pending Approvals */}
        <View className="mt-5 p-4">
          <Text className="text-lg font-semibold mb-2">Pending Approvals</Text>
          <View className="h-1 bg-black mb-2"></View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-pink">
      <ShaderCanvas />

      {/* Using TransparentTopBar */}
      <TransparentTopBar title="Experts Dashboard" onBackPress={handleBackPress} />

      {/* Use FlatList to render everything */}
      <FlatList
        ListHeaderComponent={renderDashboardContent} // Renders summary and table
        data={pendingApprovals}
        renderItem={({ item }) => (
          <PendingApprovalCard description={item.description} image={item.image} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }}
      />
    </SafeAreaView>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, color }) => (
  <View className={`p-5 rounded-xl w-[47%] items-center shadow-sm ${color}`}>
    <Text className="text-lg font-semibold">{value}</Text>
    <Text className="text-base text-gray-600 mt-2">{title}</Text>
  </View>
);

// Pending Approval Card Component with image and button
const PendingApprovalCard = ({ description, image }) => (
  <View className="bg-white p-5 mb-5 rounded-xl w-[47%] items-center shadow-sm">
    <Image source={image} className="w-12 h-12 mb-3" resizeMode="contain" />
    <Text>{description}</Text>
    <TouchableOpacity className="bg-blue-500 mt-3 p-2 rounded">
      <Text className="text-white" onPress={() => router.push('/pending-requests')}>Approve</Text>
    </TouchableOpacity>
  </View>
);

export default ExpertDashboard;
