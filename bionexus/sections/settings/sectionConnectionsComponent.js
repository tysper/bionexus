import { useState } from "react";
import {View, Text, StyleSheet, Modal, TextInput, TouchableOpacity} from "react-native";
import SettingItem from "./settingItemComponent";

export default function SectionConnections(props) {
    const [modalWifi, setWifiModal] = useState(false);


    function onPressSaveHandler(){
        setWifiModal(false);
    }

    return (
        <View style={styles.outterContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <SettingItem type="more" title="WIFI" info="WIFI DO PEDRO 2.4G" onPress={setWifiModal}/>
            <Modal
                visible={modalWifi}
                transparent
                animationType={"fade"}
                style={{alignItems: "center", justifyContent: "center"}}
            >
                <View style={styles.outterModalWifi}>
                    <View style={styles.innerModalWifi}>
                        <Text style={styles.wifiTitle}>Configurações da Rede</Text>
                        <View style={styles.labelInputContainer}>
                            <Text style={styles.inputLabel}>Wifi</Text>
                            <TextInput style={styles.input} placeholder="Nome da rede" />
                        </View>
                        <View style={styles.labelInputContainer}>
                            <Text style={styles.inputLabel}>Senha</Text>
                            <TextInput style={styles.input} placeholder="Senha da rede"/>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity activeOpacity={0.5} style={[styles.btn, {backgroundColor: "#f0f4f5"}]}><Text style={[styles.btnText, {color: "#484848"}]} onPress={() => setWifiModal(false)}>Voltar</Text></TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5} style={[styles.btn, {backgroundColor: "#857BF7"}]}><Text style={[styles.btnText, {color: "#fff"}]} onPress={onPressSaveHandler}>Salvar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    outterModalWifi: {
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#12121255"
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
        color: "#484848",
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

