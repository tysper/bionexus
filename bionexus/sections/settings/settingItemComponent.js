import { useState } from "react";
import {View, Text, StyleSheet, Pressable, TouchableHighlight, TouchableOpacity} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";

export default function SettingItem(props, {children}) {   
    const [submitted, setSubmitted] = useState(false);
    const [active, setActive] = useState(false);

    function onPressHandlerSwicth(){
        setSubmitted(!submitted);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try{
            props.onPress();
        } catch {};
    }

    function onPressHandlerMore(){
        try{
            props.onPress();
        } catch {};
    }

    return (
        <TouchableOpacity activeOpacity={props.type === "switcher"? 1: 0.8} onPress={onPressHandlerMore} style={styles.outterContainer}>
            <View style={styles.titleInfoContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.info}>{props.info}</Text>
            </View>
            
                {
                    props.type === "switcher"?
                        <Pressable 
                        onPress={onPressHandlerSwicth}
                        style={[styles.switcherContainer, {backgroundColor: submitted? "#857BF7": "#787878", alignItems: submitted? "flex-end": "flex-start"}]}
                        >
                            <View style={styles.swicther}></View>
                        </Pressable>
                        :
                        <TouchableOpacity activeOpacity={0.5} style={styles.actionContainer}>
                            <FontAwesome5 name={"angle-right"} onPress={onPressHandlerMore} size={25} color={"#474747"}></FontAwesome5>
                        </TouchableOpacity>
                }
                {children}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
    },
    titleInfoContainer: {
        flexGrow: 1,
        gap: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    info: {
        fontWeight: "400",
        fontSize: 12,
    },
    actionContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
    },
    action: {

    },
    switcherContainer: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        padding: 5,
    },
    swicther: {
        width: 20,
        height: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    }
})