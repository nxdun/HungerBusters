import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomDrawerContent from '../../components/customDrawerContent';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      drawerContent={CustomDrawerContent}
      >
        <Drawer.Screen
          name="admin-dashboard"
          options={{
            drawerLabel: 'Admin Dashboard',
            title: 'Admin Dashboard',
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons
                name={focused ? 'dashboard' : 'dashboard'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: 'About',
            title: 'About Us',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'information-circle' : 'information-circle-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
