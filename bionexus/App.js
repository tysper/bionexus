import { React, createContext, useEffect, useState} from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import {StyleSheet, TouchableOpacity, View, Image, NativeAppEventEmitter, PermissionsAndroid, Alert} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import { Touchable } from "react-native";
import Player from "./playerComponent";
import BleManager from "react-native-ble-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./appcontext";
import { Buffer } from "buffer";
import NetInfo, {useNetInfo} from "@react-native-community/netinfo";

const Tab = createMaterialBottomTabNavigator();

function displayLog(message, type, additionalInfo){
    console.log(`[${type.toUpperCase()}]: ${message} ${additionalInfo? `(${additionalInfo})`: ""}`);
}



const peripherals = new Map();

export default function App(){

    //Bluetooth Section
    const [bluetoothState, setBluetoothState] = useState("off");
    const [connectedDevice, setConnectedDevice] = useState("");
    const [bionexusConnected, setBionexusConnected] = useState(false);
    const [wifiConnected, setWifiConnected] = useState(false);
    const [wifiName, setWifiName] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [serviceObj, setServiceObj] = useState("");
    const [connectionInfo, setConnectionInfo] = useState("");
    const [connectedWithServer, setConnectedWithServer] = useState(false);

    const {type, isConnected, details} = useNetInfo();

    const DEVICE_ID = "7C:87:CE:30:29:0A";
    const SERVICE_UUID = "1d4285ac-eb30-42f1-95c3-0d8072e36151";
    const READ_CHARACTERISTIC_UUID = "16e057d2-8ddf-4d9b-97a8-5d674e6be18d";
    const WRITE_CHARACTERISTIC_UUID = "6406154d-b6a2-4af0-be63-ec98f3e6912c";
    const [BASE, setBASE] = useState("primal-turbine-327912.rj.r.appspot.com");

    async function connectToBionexus(deviceId){
        await BleManager.getDiscoveredPeripherals()
        .then((discovered) => {
            if(discovered.length){
                discovered.forEach(async (e) => {
                    const {name, id} = e;
                    if(name){
                        if(id === deviceId) {
                            await BleManager.connect(id)
                            .then(() => {
                                setConnectedDevice(deviceId);
                            })
                            .catch((err) => {
                                displayLog("Some error occurred during device connection", "error", err);
                            })
                        }
                    }
                })
            } else {
                BleManager.scan([], 5);
            }
        })
        .catch((err) => {
            displayLog("There was an error getting discovered peripherals", "error", err);
        })
    }

    function isTheRightDevice(serviceInfo, serviceUUID, charReadUIID, charWriteUUID){
        const serviceString = JSON.stringify(serviceInfo);
        if(serviceString.includes(serviceUUID) && serviceString.includes(charReadUIID) && serviceString.includes(charWriteUUID)){
            return true;
        }
        return false;
    }

    async function sendData(command, serviceInfo){
        let result = false;

        const rightDevice = isTheRightDevice(serviceInfo, SERVICE_UUID, READ_CHARACTERISTIC_UUID, WRITE_CHARACTERISTIC_UUID);

        const commandByteArray = [];
        const commandStr = `${command}`;
        for(let i = 0; i < commandStr.length; i++){
            commandByteArray.push(commandStr.charCodeAt(i));
        }
        await BleManager.write(DEVICE_ID, SERVICE_UUID, WRITE_CHARACTERISTIC_UUID, commandByteArray)
        .then(() => {
            displayLog("The message was written to BioNexus correctly!", "log", commandStr);
            result = true;
        })
        .catch((err) => {
            displayLog("The message failed to be delivered!", "error", err);
        });

        return result;
    }

    async function AsyncAlert(title, message){
        return new Promise((resolve, reject) => {
            Alert.alert(title, message, [
                {
                  text: 'OK',
                  onPress: () => {
                    resolve(true);
                  },
                },
              ],
              { cancelable: false })
        });
    }

    async function startServerConnection(state){
        return fetch(`http://${BASE}/start-connection/cellphone/${SERVICE_UUID}/${state.details.ipAddress}`)
        .then(() => {
            displayLog("Connection request was sent successfully", "request");
            
            getConnectionInfo()
            .then((data) => {
                displayLog("request sent successfully", "response", (data));
                let obj = JSON.parse(data);
                console.log(obj["devices"]["esp32"]["local_ip"]);
                if(obj["connection_established"]){
                    setConnectedWithServer(true);
                    setConnectionInfo(obj);
                } else {
                    getConnectionInfo();
                }
            })
            .catch((err) => {
                displayLog("The request for connection information failed", "error", err);
                getConnectionInfo();
            })
        })
        .catch((err) => {
            displayLog("There was an error when starting the connection", "error", err);
            startServerConnection();
        })
    }

    async function getConnectionInfo(){
        return fetch(`http://${BASE}/get-connection-info/${SERVICE_UUID}`)
        .then((result) => {
            return result.json();
        })
    }

    async function checkWifi(){
        setTimeout(() => {
            try {
                NetInfo.fetch()
                .then(async (state) => {
                    if(state.isWifiEnabled){
                        if(state.isConnected){
                            NetInfo.fetch("wifi")
                            .then(async (state) => {
                                let name, password;
                                setWifiName(previous => {
                                    name = previous;
                                    return previous;
                                });
                                setWifiPassword(previous => {
                                    password = previous;
                                    return previous;
                                })
                                if(name){
                                    displayLog("Currently configured with these informations", "log", JSON.stringify({name, password}));
                                    // if(state.details.ssid === name){
                                    //     displayLog("Connected to the right WIFI", "log", state.details.ssid);

                                        setWifiConnected(true);
                                        startServerConnection(state);

                                    // } else {
                                    //     await AsyncAlert("Rede incorreta", `É necessário conectar-se a rede ${name} para o bom funcionamento do dispositivo, vá até configurações e efetue a mudança.`);
                                    // }
                                } else {
                                    await AsyncAlert("Dados não inseridos", "Por gentileza insira os dados nas configurações para o bom funcionamento do dispositivo");
                                }
                            })
                        } else {
                            await AsyncAlert("Desconectado da Rede", "É necessário conectar a rede para utilizar o BioNexus");
                            checkWifi();
                        }
                    } else {
                        await AsyncAlert("Wifi desligado", "É necessário ativar o wifi para utilizar o BioNexus");
                        checkWifi();
                    }
                })
                // if(isConnected){
                //     NetInfo.fetch("wifi")
                //     .then((state) => {       
                //         displayLog("Wifi conencted!", "log", JSON.stringify(state));
                //     })
                // } else {
                //     displayLog("Wifi disconnected, checking again in 5 seconds", "log");
                //     checkWifi();
                // }
            } catch (err) {
                displayLog("There was an error when checking the wifi connection", "error", err);
                checkWifi();
            }
        }, 10000);
    }

    useEffect(()=> {
        //wifi section
        (async function(){
            await AsyncStorage.getItem("wifi-information")
            .then((value) => {
                if(value === null){
                    console.log("[LOG]: value was not found! (null)");
                } else {
                    const {name, password} = JSON.parse(value);
                    setWifiName(name);
                    setWifiPassword(password);

                    console.log(`[LOG]: Wifi information was set to the App context. (${value})`);
                }

                checkWifi();
            })
            .catch((err) => {
                console.log(`[LOG]: There was an error during wifi information retrival in AsyncStorage. (${err})`);
            })
        })()
        //bluetooth section
        // async function startBluetooth(){
        //     try {
        //         const granted = await PermissionsAndroid.request(
        //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //           {
        //             'title': 'BioNexus',
        //             'message': 'Bionexus está pedindo para utilizar sua localização.'
        //           }
        //         )
        //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //           displayLog("You can use the location", "log");
        //         } else {
        //           displayLog("location permission denied", "log");
        //           Alert.alert("A localização é necessária para se conectar com seu dispositivo BioNexus");
        //         }
        //       } catch (err) {
        //         displayLog("An error occurred when trying to access location", "error", err);
        //       }
    
    
            
        //     await BleManager.start();

        //     BleManager.checkState()
        //     .then((state) => {
        //         setBluetoothState(state);
        //     })
    
        //     NativeAppEventEmitter.addListener("BleManagerDiscoverPeripheral", (peripheral) => {
        //         const {id, name} = peripheral;
        //         peripherals.set(id, name);
        //     })
    
        //     NativeAppEventEmitter.addListener("BleManagerStopScan", () => {
        //         displayLog("Scan stopped.", "log");
        //         connectToBionexus(DEVICE_ID);
        //         setTimeout(async () => {
        //             BleManager.retrieveServices(DEVICE_ID)
        //             .then((result) => {
        //                 setServiceObj(result);
        //                 sendData("on", result);
        //                 setTimeout(() => {
        //                     sendData("off", result);
        //                     setTimeout(() => {
        //                         sendData("on", result);
        //                         setTimeout(() => {
        //                             sendData("off", result);
        //                             // setTimeout(() => {
                                        
        //                             // }, 50)
        //                         }, 50)
        //                     }, 50)
        //                 }, 50)
        //             })
        //             .catch((err) => {
        //                 displayLog("There was an error during service retrival.", "error", err);
        //             });
        //         }, 500);
        //     })
            
        //     NativeAppEventEmitter.addListener("BleManagerConnectPeripheral", async (data) => {
        //         displayLog("Bionexus 1.0 connected", "log", JSON.stringify(data));
        //         setBionexusConnected(true);
        //     })

        //     NativeAppEventEmitter.addListener("BleManagerDisconnectPeripheral", async (data) => {
        //         displayLog("Bionexus 1.0 disconnected", "log", JSON.stringify(data));
        //         setBionexusConnected(false);
        //         setConnectedDevice("");
        //         setServiceObj("");
        //         await BleManager.scan([], 5);
        //         await checkWifi();
        //     })

        //     NativeAppEventEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", async ({value}) => {
                
        //         const result = Buffer.from(value);
        //         displayLog("Data Received", "log", result.toString());
        //     })

        //     BleManager.scan([], 5);
        // }

        
    }, [])






    return (
        <AppContext.Provider value={{bionexusConnected, setBionexusConnected, wifiConnected, setWifiConnected, wifiName, setWifiName, wifiPassword, setWifiPassword, checkWifi, connectionInfo, setConnectionInfo, connectedWithServer, setConnectedWithServer, BASE}}>
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
                {/* <Player/> */}
            </NavigationContainer>
        </AppContext.Provider>
    )
}

const styles = StyleSheet.create({
    outterContainer: {
        height: "100%",
    },
})