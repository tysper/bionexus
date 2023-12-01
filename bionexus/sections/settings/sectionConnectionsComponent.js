import { useContext, useEffect, useState } from "react";
import {View, Text, StyleSheet, Modal, TextInput, TouchableOpacity} from "react-native";
import SettingItem from "./settingItemComponent";
import { AppContext, SettingsContext } from "../../appcontext";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function SectionConnections(props) {
    const {wifiName, setWifiName, wifiPassword, setWifiPassword} = useContext(AppContext);
    const {wifiModal, setWifiModal} = useContext(SettingsContext);
    

    useEffect(() => {
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
            })
            .catch((err) => {
                console.log(`[LOG]: There was an error during wifi information retrival in AsyncStorage. (${err})`);
            })
        })()
    }, []);

    return (
        <View style={styles.outterContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <SettingItem type="more" title="WIFI" info={`${wifiName? wifiName: "Unknown"}`} onPress={() => setWifiModal(true)}/>
            <SettingItem type="more" title="BioNexus" info="Modelo 1.0"/>
        </View>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        backgroundColor:"transparent",
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#474747",
        paddingBottom: 10,
        paddingTop: 20,
    },
});

