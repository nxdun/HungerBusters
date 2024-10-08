import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Table, Row, Rows } from "react-native-table-component";
import { images } from "../../constants";
import ShaderCanvas from "../shaderCanvas";
import { router } from "expo-router";
import TransparentTopBar from "../../components/TransparentTopBar"; // Importing the TransparentTopBar component

const apiUrl = process.env.EXPO_PUBLIC_API_URL; // Assuming you're using environment variables

const ExpertDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [requestData, setRequestData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${apiUrl}/api/fsr/get/dashboard-data`);
      const data = await response.json();

      setRequestData({
        approved: data.approved,
        total: data.total,
        expired: data.expired,
        pending: data.pending,
      });
      setTableData(data.tableData);
      setPendingApprovals(data.pendingApprovals);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(true);
      setLoading(false);
    }
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
          <PendingApprovalCard description={item.description} image={item.images[0]} /> // Display the first image
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
    <Image source={{ uri: image }} className="w-12 h-12 mb-3" resizeMode="contain" />
    <Text>{description}</Text>
    <TouchableOpacity className="bg-blue-500 mt-3 p-2 rounded">
      <Text className="text-white" onPress={() => router.push('/pending-requests')}>Approve</Text>
    </TouchableOpacity>
  </View>
);

export default ExpertDashboard;
