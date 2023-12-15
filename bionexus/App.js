import { React, useEffect, useState} from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import {StyleSheet, Alert} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import BleManager from "react-native-ble-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "./appcontext";
import NetInfo, {useNetInfo} from "@react-native-community/netinfo";
import { io } from "socket.io-client";

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
    const [lastReading, setLastReading] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [resultFound, setResultFound] = useState(false);
    const [lastText, setLastText] = useState("");
    const [speakFunction, setSpeakFunction] = useState({});
    const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
    const [base64Audio, setBase64Audio] = useState(" ");
    const [checkLastResultFunction, setCheckLastResultFunction] = useState(" ");
    const [keepChecking, setKeepChecking] = useState(true);
    const [processingImage, setProcessingImage] = useState(false);
    const [saveReading, setSaveReading] = useState(false);
    const [lastTracks, setLastTracks] = useState([]);

    const {type, isConnected, details} = useNetInfo();

    const DEVICE_ID = "7C:87:CE:30:29:0A";
    const SERVICE_UUID = "1d4285ac-eb30-42f1-95c3-0d8072e36151";
    const READ_CHARACTERISTIC_UUID = "16e057d2-8ddf-4d9b-97a8-5d674e6be18d";
    const WRITE_CHARACTERISTIC_UUID = "6406154d-b6a2-4af0-be63-ec98f3e6912c";
    // const [BASE, setBASE] = useState("primal-turbine-327912.rj.r.appspot.com");
    const [BASE, setBASE] = useState("primal-turbine-327912.rj.r.appspot.com");

    let lastReadingTimer;
    

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

    

    async function readText(text) {
        let apiKey = "6a0976e2d061484ba70e64498a4d8a09";
        let lan = "pt-br";
        let b64 = "true";

        displayLog("Requesting audio", "log");

        fetch(`http://api.voicerss.org/?key=${apiKey}&hl=${lan}&src=${text}&b64=${b64}`)
        .then((response) => {
            if(!response.ok) {
                displayLog("There was an error during the request!", "error", JSON.stringify(response));
            }

            return response.text();
        })
        .then((data) => {
            displayLog("Text was converted to audio!", "log");
            //store the base64 object
            setBase64Audio(data);
            //displays the audio controls
            setCurrentlyPlaying(true);

        })


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
                    setIsLoading(false);
                    // startChecking();
                    setTimeout(() => {
                        startWebSocketConnection();
                    }, 2000)
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


    // function verifylastreading(){
    //     let connected; 
    //     setConnectedWithServer((previous) => {
    //         connected = previous;
    //         return previous;
    //     })
    //     if(connected){
    //         fetch(`http://${BASE}/get-last-reading/${SERVICE_UUID}`)
    //         .then((data) => {
    //             data.json()
    //             .then((data) => {
    //                 displayLog(JSON.stringify(data), "reading");
    //                 setLastReading(data);
    //                 try{
    //                     if(data["response"]["ParsedResults"][0]["ParsedText"].length > 0){
    //                         let texto = data["response"]["ParsedResults"][0]["ParsedText"];
    
    
    //                         fetch(`http://${BASE}/flush-reading/${SERVICE_UUID}`)
    //                         .then((response) => {
    //                             if(response.ok) {
    
    //                                 displayLog("Text found!", "log", texto)
    //                                 // texto
    //                                 setLastText(texto);
    //                                 //ativar o modal
    //                                 setResultFound(true);
    //                                 //parar de checar por novas entradas
    //                                 clearInterval(lastReadingTimer);
    //                                 //ler o texto
    //                                 readText(texto);
    //                             } else {
    //                                 displayLog("Error when flushing last reading!", "error");
    //                             }
    //                         })                      
    //                     } else {
    //                         setTimeout(()=> {
    //                             verifylastreading();
    //                         }, 1000)
    //                     }
    //                 } catch(err) {
    //                     clearInterval(lastReadingTimer);
    //                     verifylastreading();

    //                     displayLog("There was an error during messaging reading!", "error", err);
    //                 }
    //             })
    //         })
    //         .catch((err) => {
    //             displayLog("An error occurred during the text request", "error", err);
    //         })
    //     }
    // }

    // function startChecking(){
    //     lastReadingTimer = setTimeout(() => {
    //         verifylastreading();
    //     }, 1000)
    // }

    function startWebSocketConnection(){
        
        let connected; 
        setConnectedWithServer((previous) => {
            connected = previous;
            return previous;
        })

        displayLog("Starting websocket connection!", "log", connected);
        if(connected){
            const socket = io(`http://${BASE}`);

            socket.on("connect", () => {
                displayLog("Socket connection was opened!", "socket");
            })
            
            socket.on("message", (msg) => {
                displayLog("Message received!", "socket", JSON.stringify(msg));

                let processingImageCurrent;
                let keepCheckingCurrent;
                let currentlyPlayingCurrent;
                setProcessingImage((previous) => {
                    processingImageCurrent = previous;
                    return previous;
                })
                setKeepChecking((previous) => {
                    keepCheckingCurrent = previous;
                    return previous;
                })
                setCurrentlyPlaying((previous) => {
                    currentlyPlayingCurrent = previous;
                    return previous;
                })

                if(msg.command == "capture"){
                    if(keepCheckingCurrent && !processingImageCurrent && !currentlyPlayingCurrent) {

                        setLastText("");
                        setBase64Audio(" ");


                        let connectionInfoCurrent;
                        setConnectionInfo((previous) => {
                            connectionInfoCurrent = previous;
                            return previous;
                        })
    
                        let base_url = `${connectionInfoCurrent.devices.esp32.local_ip}`.split("").map((el, i, arr) => {
                            if(i == arr.length-1){
                                return parseInt(el)-1;
                            } else {
                                return el;
                            }
                        }).join("");
    
                        fetch(`http://${base_url}/control?var=framesize&val=13`)
                        .then((response) => {
                            if(response.ok) {
                                displayLog("Image adjusted to 13", "log");
                                fetch(`http://${base_url}/capture`)
                                .then((response) => {
                                    if(response.ok) {
    
                                        response.blob()
                                        .then((blob) => {
                                            const reader = new FileReader();
    
                                            reader.onload = () => {
                                                const base64 = reader.result;
                                                const jpegDataURL = `data:image/jpeg;base64,${base64.split(',')[1]}`;
    
                                                fetch(`http://${base_url}/control?var=framesize&val=3`)
                                                .then((response) => {
                                                    if(response.ok) {
                                                        displayLog("Image adjusted to 13", "log");
    
                                                        const api_key = "K86879446488957";
                                                        const base64Image = jpegDataURL;
                                                        const language = "por";
                                                        const isOverlayRequired = "false";
                                                        const iscreatesearchablepdf = "false";
                                                        const issearchablepdfhidetextlayer = "false";
    
                                                        const form_data = new FormData();
                                                        form_data.append("base64Image", base64Image);
                                                        form_data.append("language", language);
                                                        form_data.append("isOverlayRequired", isOverlayRequired);
                                                        form_data.append("iscreatesearchablepdf", iscreatesearchablepdf);
                                                        form_data.append("issearchablepdfhidetextlayer", issearchablepdfhidetextlayer);
    
                                                        const headers = {
                                                            'apikey': api_key
                                                        }
    
                                                        // console.log(JSON.stringify(request_body));
                                                        setProcessingImage(true);
                                                        fetch("https://api.ocr.space/parse/image", {
                                                            method: "POST",    
                                                            headers, 
                                                            body: form_data,
                                                        })
                                                        .then((response) => {
                                                            response.json()
                                                            .then((data) => {
                                                                setProcessingImage(false);
                                                                
                                                                let texto = data["ParsedResults"][0]["ParsedText"];
                                                                if(texto.length) {
                                                                    console.log(data);
                                                                    
                                                                    displayLog("Text found!", "log", texto);
                                                                    // texto
                                                                    setLastText(texto);
                                                                    //ativar o modal
                                                                    setResultFound(true);
                                                                    //parar de checar por novas entradas
                                                                    // clearInterval(lastReadingTimer);
                                                                    //ler o texto
                                                                    readText(texto);
                                                                    setKeepChecking(false);
                                                                }
                                                                
                                                            })
                                                        })
    
                                                        // console.log(jpegDataURL);
                                                    } else {
                                                        displayLog("An error ocurred while changing the quality!", "error");
                                                    }
                                        })
    
                                            }
    
                                            reader.readAsDataURL(blob);
                                        })
                                    } else {
                                        displayLog("An error ocurred while capturing the image!", "error");
                                    }
                                })
                            } else {
                                displayLog("An error ocurred while changing the quality!", "error");
                            }
                        }).catch((err) => {
                            displayLog("Error: ", "error", err);
                        })
                    }

                }
            })

            socket.on("error", (err) => {
                displayLog("An error was thrown in the websocket!", "error", JSON.stringify(err));
            })

            socket.on("disconnect", () => {
                displayLog("The connection was closed", "socket");
            })
        }
    }

    useEffect(()=> {

       

        // setSpeakFunction({readText});
        // setCheckLastResultFunction({startChecking});

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
                setIsLoading(true);
                //reactivate ↓
                // checkWifi();

                // setResultFound(true);
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


    useEffect(() => {

        async function checkSettings(){
            const saveReading = await AsyncStorage.getItem("setting_save-reading");
            if(saveReading){
                if(saveReading == "true"){
                    setSaveReading(true); 
                    displayLog("Setting: saveReading set to true.", "log");   
                } else {
                    setSaveReading(false);
                    displayLog("Setting: saveReading set to false.", "log");   
                }
            }
        };

        checkSettings();

    }, [saveReading])





    return (
        <AppContext.Provider value={{bionexusConnected, setBionexusConnected, wifiConnected, setWifiConnected, wifiName, setWifiName, wifiPassword, setWifiPassword, checkWifi, connectionInfo, setConnectionInfo, connectedWithServer, setConnectedWithServer, BASE, isLoading, setIsLoading, resultFound, setResultFound, lastText, setLastText, speakFunction, setSpeakFunction, currentlyPlaying, setCurrentlyPlaying, base64Audio, setBase64Audio, checkLastResultFunction, setCheckLastResultFunction, setKeepChecking, saveReading, setSaveReading, lastTracks, setLastTracks}}>
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