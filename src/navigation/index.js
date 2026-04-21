import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MobileNavigator from './MobileNavigator';
import WebNavigator from './WebNavigator.js';
const RootNavigator=()=>{
    const isWeb=Platform.OS === 'web';
    return(
        <NavigationContainer>
            {isWeb ? <WebNavigator/>:<MobileNavigator/>}
        </NavigationContainer>
    );
};
export default RootNavigator;