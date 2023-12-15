import {React, useState, useContext }from "react";
import {View, Text, StyleSheet, StatusBar, FlatList, TextInput, TouchableOpacity, Keyboard} from "react-native";

import SectionInitial from "./sections/settings/sectionInitialComponent.js";
import SectionReaderOptions from "./sections/settings/sectionReaderOptionsComponent.js";
import SectionConnections from "./sections/settings/sectionConnectionsComponent.js";
import { SettingsContext, AppContext } from "./appcontext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({navigation}){
    const [sections, setSections] = useState([
        <SectionInitial/>,
        <SectionReaderOptions title="Opções de leitura"/>,
        <SectionConnections title="Conexões e Dispositivos"/>
    ])

    const {wifiName, setWifiName, wifiPassword, setWifiPassword, checkWifi} = useContext(AppContext);
    const [wifiModal, setWifiModal] = useState(false);

    const [currentWifiName, setCurrentWifiName] = useState("");
    const [currentWifiPassword, setCurrentWifiPassword] = useState("");

    async function onPressSaveHandler(){
        setWifiModal(false);
        setWifiName(currentWifiName);
        setWifiPassword(currentWifiPassword);
        try{
            const wifiInformation = JSON.stringify({name: currentWifiName, password: currentWifiPassword})
            await AsyncStorage.setItem("wifi-information", wifiInformation);
            console.log(`[LOG]: the wifi information was set correctly (${wifiInformation})`);
            checkWifi();
            navigation.navigate("INÍCIO");
            Keyboard.dismiss();
        } catch (err) {
            console.log(`[ERROR]: An error happened while setting the wifi information (${err})`);
        }
    }

    return (
        <SettingsContext.Provider value={{wifiModal, setWifiModal}}>
            <View style={styles.outterContainer}>
                <StatusBar/>
                <Text style={styles.title}>Configurações</Text>
                <FlatList
                    data={sections}
                    keyExtractor={(_, i) => `${i}`}
                    renderItem={({item}) => item}
                    contentContainerStyle={styles.list}
                >
                </FlatList>
                <View style={[styles.outterModalWifi, {display: wifiModal? "flex": "none"}]}>
                    <View style={styles.innerModalWifi}>
                        <Text style={styles.wifiTitle}>Configurações da Rede</Text>
                        <View style={styles.labelInputContainer}>
                            <Text style={styles.inputLabel}>Wifi</Text>
                            <TextInput style={styles.input} value={currentWifiName} onChangeText={(text) => setCurrentWifiName(text)} placeholder="Nome da rede" />
                        </View>
                        <View style={styles.labelInputContainer}>
                            <Text style={styles.inputLabel}>Senha</Text>
                            <TextInput style={styles.input} value={currentWifiPassword} onChangeText={(text) => setCurrentWifiPassword(text)} placeholder="Senha da rede"/>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity activeOpacity={0.5} style={[styles.btn, {backgroundColor: "#f0f4f5"}]}><Text style={[styles.btnText, {color: "#484848"}]} onPress={() => {setWifiModal(false); Keyboard.dismiss();}}>Voltar</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} style={[styles.btn, {backgroundColor: "#857BF7"}]}><Text style={[styles.btnText, {color: "#fff"}]} onPress={onPressSaveHandler}>Salvar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SettingsContext.Provider>
    );
}

const styles = StyleSheet.create({ 
    outterContainer: {
        paddingVertical: 30,
        backgroundColor: "#f3f3f3",
        height: "100%",
    },
    title: {
        fontSize: 25,
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "600",
        color: "#373737",
        paddingVertical: 40,

    },
    list: {
        paddingHorizontal: 20,
        backgroundColor: "transparent",
    },
    outterModalWifi: {
        alignItems: "center",
        justifyContent: "center",
        height: "110%",
        backgroundColor: "#12121255",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
    },
    innerModalWifi: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 10,
    },
    wifiTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
    },
    labelInputContainer: {
        gap: 6,
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#a4a4a4",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    input: {
        width: 250,
        backgroundColor: "#c4c4c4",
        borderRadius: 5,
        fontSize: 14,
        paddingVertical: 6,
        paddingHorizontal: 14,
        color: "#fff",
    },
    btnContainer: {
        marginTop: 10,
        flexDirection: "row",
        gap: 10,
    },
    btn: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingVertical: 10,
    },
    btnText: {
        fontWeight: "800",
        textTransform: "uppercase",
        fontSize: 14,
    }
});



