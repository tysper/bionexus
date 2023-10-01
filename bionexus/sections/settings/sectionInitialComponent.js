import { useState } from "react";
import {View, Text, StyleSheet, Modal, Image, TouchableOpacity} from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SettingItem from "./settingItemComponent";
import DefaultModal from "./defaultModalComponent";

import Section from "./sectionComponent";

export default function SectionInitial() {

    const [supportModal, setSupportModal] = useState(false);

    function onPressSupport(){
        setSupportModal(true);
    }

    return (
        <View style={styles.outterContainer}>
            <SettingItem type="more" title="Suporte e Informações" info="VERSÂO 1.0" onPress={onPressSupport}>
            </SettingItem>
                <DefaultModal
                    visible={supportModal}
                    onPressBack={setSupportModal}
                    animationType="slide"
                    containerStyle={styles.modalContainer}
                >
                    <View style={styles.imgContainer}>
                        <Image style={styles.avatarImg} source={require("./assets/bionexus.png")}></Image>
                    </View>
                    <Text style={styles.avatarText}>BioNexus</Text>
                    <Section title="Versão do Aplicativo" info="1.0"/>
                    <Section title="Integrantes do Projeto" info={["Gabriele Cristina - RA: 220060", "João Pedro Bently - RA: 215276", "Leonardo Antônio - RA: 200538", "Pedro Paulo Nunes - RA: 219672", "Raphael Bruno - RA: 216171"]}/>
                    <Section title="Email de Suporte" info="ps219672@alunos.unisanta.com"/>
                </DefaultModal>
        </View>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        backgroundColor:"transparent",
        justifyContent: "space-around",
        paddingVertical: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#474747",
    },
    modalContainer: {
        backgroundColor: "#f4f4f4",
        height: "100%",
        alignItems: "center",
        gap: 10,
    },
    imgContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#ffffff",
        borderRadius: 60,
    },
    avatarImg: {
        width: 120,
        height: 120,
        resizeMode: "center",
    },
    avatarText: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "600",
        color: "#474747",
        marginBottom: 20,
    }
});

