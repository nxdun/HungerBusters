import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import TransparentTopBar from '../../components/TransparentTopBar'; // Custom top bar
import ShaderCanvas from '../shaderCanvas'; // Background shader
import CustomButton from "../../components/CustomButton";

const screenWidth = Dimensions.get('window').width;

const RequestData = {
  approved: 12,
  total: 45,
  expired: 12,
  pending: 12,
};

const dummyTimeSeriesData = {
  approvals: [5, 10, 15, 20, 10, 12, 18, 14, 25, 12],
  rejects: [3, 5, 8, 6, 5, 7, 10, 5, 8, 6],
  deliveries: [20, 15, 12, 10, 12, 18, 14, 18, 15, 22],
};

const AnalysisDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const handleApprove = () => {
    console.log("Download");
  };

  useEffect(() => {
    // Fetch data from server or backend here (dummy for now)
    const fetchData = async () => {
      try {
        // Simulate fetch
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Pie chart data (RequestData)
  const pieChartData = [
    { name: 'Approved', count: RequestData.approved, color: '#4caf50', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Pending', count: RequestData.pending, color: '#2196f3', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Expired', count: RequestData.expired, color: '#f44336', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Total', count: RequestData.total, color: '#ffeb3b', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const downloadData = [
    ['Date', 'Approvals', 'Rejects', 'Deliveries'],
    ['2023-01', 5, 3, 20],
    ['2023-02', 10, 5, 15],
    ['2023-03', 15, 8, 12],
    // Add more rows as needed...
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ShaderCanvas />

      {/* Transparent Top Bar */}
      <TransparentTopBar title="Analysis Dashboard" />

      <ScrollView className="p-4">
        {/* Pie Chart */}
        <View className="mb-5">
          <Text className="text-lg font-semibold text-center mb-2">Request Analysis</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
          />
        </View>

        {/* Line Chart for Approvals and Rejects Over Time */}
        <View className="mb-5">
          <Text className="text-lg font-semibold text-center mb-2">Approvals vs Rejects Over Time</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              datasets: [
                {
                  data: dummyTimeSeriesData.approvals,
                  color: (opacity = 1) => `rgba(34, 202, 34, ${opacity})`, // Green
                },
                {
                  data: dummyTimeSeriesData.rejects,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red
                },
              ],
            }}
            width={screenWidth - 20}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Line Chart for Deliveries Over Time */}
        <View className="mb-5">
          <Text className="text-lg font-semibold text-center mb-2">Delivery Before Expiration Over Time</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              datasets: [
                {
                  data: dummyTimeSeriesData.deliveries,
                  color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`, // Blue
                },
              ],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={{
              backgroundColor: '#022173',
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Download Button */}
        <CustomButton
              title="Downlaod"
              handlePress={handleApprove}
              containerStyles="w-full"
              textStyles="text-lg"
            />
       
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisDashboard;
