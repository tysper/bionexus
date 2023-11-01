import {React, useEffect, useState} from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import {StyleSheet, TouchableOpacity, View, Image} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import { Touchable } from "react-native";
import Player from "./playerComponent";
import BleManager from "react-native-ble-manager";

const Tab = createMaterialBottomTabNavigator();

function displayLog(message, type, additionalInfo){
    console.log(`[${type.toUpperCase()}]: ${message} ${additionalInfo? `(${additionalInfo})`: ""}`);
}
export default function App(){


    //Bluetooth Section
    const [bluetoothState, setBluetoothState] = useState(false);

    async function checkBluetoothState(){
        return BleManager.checkState()
        .then((result) => {
            if(result === "off"){
                setBluetoothState(false);
            } else if(result === "on"){
                setBluetoothState(true);
            }
        });
    }

    async function requestBleActivation(){
        return 
    }

    useEffect(()=> {

        //Bluetooth capabilities
        checkBluetoothState()
        .then(async () => {
            if(!bluetoothState){
                BleManager.enableBluetooth()
                .then(() => { 
                    setBluetoothState(true);
                })
                .catch((error) => {
                    displayLog("User did not activated bluetooth as prompted!", "error", error)
                })
                .finally(() => {
                    if(bluetoothState){
                        BleManager.start()
                        .catch((err) => {
                            displayLog("When trying to start bluetooth module", "error", err)
                        })
                        .finally(() => {
                           displayLog("Bluetooth was turned on!", "log");
                        });
                    }
                })
            } else{
                await BleManager.start();
                displayLog("Bluetooth was turned on!", "log");
            }
        }).then(() => {
            // BleManager.scan()
        })

    }, [])






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
                            size = focused? 25: 20;
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
                <Player/>
            </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    outterContainer: {
        height: "100%",
    },
})