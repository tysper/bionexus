import {React} from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import { Touchable } from "react-native";

const Tab = createMaterialBottomTabNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, size, color}) => {
                        let iconName;
                        if(route.name==="INÍCIO"){
                            iconName = "home";
                        } else if(route.name==="PESQUISAR"){
                            iconName = "search";
                        } else if(route.name==="AJUSTES") {
                            iconName = "settings";
                        }
                        size = focused? 30: 25;
                        color = focused? "#857BF7": "#787878";
                        return (
                            <Ionicons name={iconName} size={size} color={color}/>
                        )
                    },
                    tabBarHideOnKeyboard: true,
                })}
                sceneAnimationType="shifting"

                barStyle={{backgroundColor: "#fff"}}
                shifting={true}
            >
                <Tab.Screen key="1" name="INÍCIO" component={HomeScreen}/>
                <Tab.Screen key="2" name="PESQUISAR" component={SearchScreen}/>
                <Tab.Screen key="3" name="AJUSTES" component={SettingsScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    outterContainer: {
        height: "100%",
    }
})