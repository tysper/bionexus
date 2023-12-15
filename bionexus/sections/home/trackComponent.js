import { useState } from "react";
import 
{ 
    StyleSheet, 
    TouchableHighlight, 
    Text, 
    View, 
    Image, 
    Modal, 
    TouchableOpacity, 
    Pressable, 
    ScrollView,
    Alert,
    Keyboard
}
from "react-native";
import { useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Prompt from "./promptComponent";

import Option from "./optionComponent";
import { TextInput } from "react-native-paper";

const fontSize = 16;
let timer;

export default Track = function(props) {

    const [active, setActive] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [repeat, setRepeat] = useState(false);

    
    const [renamePrompt, setRenamePrompt] = useState(false);
    function onPressHandler() {
        setActive(!active);
        try {
            props.onPress();
        } catch {
            console.log("Not a function.");
        }
    }

    function onCloseHandler(){
        setModalState(!modalState);
    }

    function onMoreSettingsHandler(){
        setModalState(true);
    }

    function onRemoveHandler(){
        console.log("[MODAL]: track removed.")
        setModalState(false);
    }

    function onRepeatHandler(){
        setRepeat(!repeat);
    }


    return (
        <TouchableHighlight 
            activeOpacity={0.9}    
            underlayColor="#d9d9d9"
            onPress={onPressHandler}
            style={[styles.container, props?.lastOne? {borderBottomStartRadius: 20, borderBottomEndRadius: 20}: {}]}
        >

            <View style={styles.innerContainer}>
                
                <View style={styles.containerIconText}>
                    <View style={styles.containerIcon}>
                        {active? <Icon name="pause" size={20} color="#857BF7"/> : <Icon name="play" size={20} color="#787878"/>}
                    </View>
                    <View style={styles.containerTitleSub}>
                        <Text style={[styles.text, active? {color: "#857BF7"} : {color: "#686868"}]}>{props.title}</Text>
                        <Text style={[styles.text, {color: "#787878", fontSize: 14, fontWeight: "500", textTransform: "capitalize", letterSpacing: 1}]}>{props.trackType || "Tipo Desconhecido"} • {props.trackAuthor || "Autor Desconhecido"}</Text>
                    </View>
                </View>
                <View style={styles.containerSettings}>
                    <Pressable
                        hitSlop={{top: 20, bottom: 20, left: 10, right: 10}}
                        style={({pressed}) => [pressed? {opacity: 0.6, transform: "scale(0.9)"}: {opacity: 1}]}
                        onPress={onMoreSettingsHandler}
                    >
                        <Text style={styles.moreSettings}>•••</Text>
                    </Pressable>
                    <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalState}
                    
                    >
                        <View style={styles.centeredContainer}>
                            <View style={styles.innerContainerModal}>
                                <ScrollView>
                                    <View style={styles.imgContainer}>
                                        {/* <Image source={require("./assets/background.jpg")} style={{width: 150, height: 150, borderRadius: 20, marginBottom: 15}}/> */}

                                        <Text style={[styles.text, {color: "#686868", fontSize: 22, marginBottom: 10}]} placeholderTextColor={"#686868"}>{props.title}</Text>

                                        <Text style={[styles.text, {color: "#787878", fontSize: 14, fontWeight: "500", textTransform: "capitalize", letterSpacing: 1}]}>{props.trackType || "Tipo Desconhecido"} • {props.trackAuthor || "Autor Desconhecido"}</Text>
                                    </View>
                                    <View style={styles.optionsContainer}>
                                        <Option iconName="remove-circle" description="Remover faixa salva" onPress={onRemoveHandler}/>
                                        <Option iconName="repeat" description="Repetir faixa" persistent={true} onPress={onRepeatHandler} pressed={repeat}/>
                                    </View>
                                </ScrollView>
                            </View>        

                            <View style={styles.btnCloseOutterContainer}>
                                <TouchableOpacity        
                                    activeOpacity={0.8}    
                                    underlayColor="#d9d9d9"
                                    onPress={onCloseHandler}
                                    style={styles.btnCloseContainer}
                                    >
                                        <Text style={styles.btnClose}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        overflow: "hidden",
    },
    innerContainer: {
        flexDirection: "row",
        paddingHorizontal: 25,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    containerIconText: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    containerIcon: {
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    containerTitleSub: {
        gap: -2,
    },
    text: {
        fontSize: fontSize,
        textTransform: "uppercase",
        fontWeight: "800",
        color: "#fff",
        
    },
    containerSettings: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    moreSettings: {
        verticalAlign: "middle",
        height: 8,
        fontWeight: "600",
        fontSize: 24,
        lineHeight: 18,
        letterSpacing: 2,
    },
    centeredContainer: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
        backgroundColor: "#fff",

    },
    innerContainerModal: {
        width: "100%",
        height: 100,
        flex: 1,
    },
    imgContainer: {
        width: "100%",
        alignItems: "center",
    },
    optionsContainer: {
        paddingVertical: 30,
        width: "100%",    
    },
    btnCloseContainer: {
        
    },
    btnCloseOutterContainer: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 25, 
    },
    btnClose: {
        fontSize: 22,
        textTransform: "capitalize",
        fontWeight: "500",
    }
});
