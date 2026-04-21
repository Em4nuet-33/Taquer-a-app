// src/navigation/MobileNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrdersHistoryScreen from '../screens/OrdersHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminPanel from '../screens/AdminPanel';

const Stack = createStackNavigator();

const MobileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="AdminPanel" component={AdminPanel} />
  </Stack.Navigator>
);

export default MobileNavigator;