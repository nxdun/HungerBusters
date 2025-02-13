import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function CustomDrawerContent(props:any) {

    const {bottom} = useSafeAreaInsets();
    const navigation = useNavigation();

    const closeDrawer = ()=>{
        navigation.dispatch(DrawerActions.closeDrawer())
    }
  return (
    <View
        style={{flex: 1}}
    >
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={{padding: 20}}>
            <Image style={{height: 35}} resizeMode='contain' source={require('../assets/images/logo.png')} />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Pressable
        onPress={closeDrawer}
        style={({ pressed }) => ({
          padding: 20,
          paddingBottom: bottom + 10,
          backgroundColor: pressed ? '#d3d3d3' : '#6200ee', // Change color on press
          borderRadius: 5, // Rounded corners
        })}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Close Drawer</Text>
      </Pressable>
    </View>
  )
}