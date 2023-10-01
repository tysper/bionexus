import { useState } from "react";
import {View, Text, TextInput, StyleSheet, TouchableHighlight, Platform, Keyboard} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function platformSpecificStyles(){
    if(Platform.OS === "android") {
        styles.input = {
            flexGrow: 1,
            backgroundColor: "#fff",
            color: "#787878",
            borderRadius: 10,
            paddingLeft: 40,
            paddingVertical: 5, 
            fontSize: 16,
            fontWeight: "600",
            maxWidth: 260,
        };
        styles.icon = {
            position: "absolute",
            left: 8,
            zIndex: 2,
            top: 8,
        };
    } else if(Platform.OS === "ios") {
        styles.input = {
            flexGrow: 1,
            backgroundColor: "#fff",
            color: "#787878",
            borderRadius: 10,
            paddingLeft: 40,
            paddingVertical: 8, 
            fontSize: 16,
            fontWeight: "600",
            maxWidth: 290,
        }
        styles.icon = {
            position: "absolute",
            left: 8,
            top: 6,
            zIndex: 2,
        }
    }
}

let timer;

export default function SearchBar(props) {
    const [currentText, setText] = useState("");
    let [currentWidth, setCurrentWidth] = useState(0);

    platformSpecificStyles();

    function onFocusHandler() {
        clearInterval(timer);
        timer = setInterval(
            () => {
                setCurrentWidth((prevValue) => {
                    if(prevValue >= 130) {
                        clearInterval(timer);
                        return 130;
                    } else {
                        return prevValue+15;
                    }
                })
            }, 5);
    }

    function onPressHandler() {
        setText("");
        clearInterval(timer);
        timer = setInterval(() => {
            setCurrentWidth((prevValue) => {
                if(prevValue <= 0) {
                    Keyboard.dismiss();
                    clearInterval(timer);
                    return 0;
                } else {
                    return prevValue-15;
                }
            })}, 5);
    }

    function onHideHandler() {
        clearInterval(timer);
        timer = setInterval(() => {
            setCurrentWidth((prevValue) => {
                if(prevValue <= 0) {
                    Keyboard.dismiss();
                    clearInterval(timer);
                    return 0;
                } else {
                    return prevValue-15;
                }
            })}, 5);
    }
    function searchHandler(){
        props.setView("results");
    }

    function onChangeTextHandler(text){
        setText(text);
        if(text === "") {
            props.setView("history");
        }
    }

    Keyboard.addListener("keyboardDidHide", onHideHandler);

    return (
        <View style={[styles.searchContainer, {height: (Platform.OS === "android"? 85: Platform.OS === "ios"? 110: null)}]}>
            <View style={[styles.inputBtnContainer]}>
                <View style={{position: "absolute", top: 0, bottom: 0, right: currentWidth, left: "50%", backgroundColor: "#fff", borderRadius: 10}}></View>
                <View style={styles.inputContainer}>
                    <FontAwesome5 style={styles.icon} name={"search"} size={20} color={"#787878"}></FontAwesome5>
                    <TextInput value={currentText} style={styles.input} placeholder="PESQUISAR" onFocus={onFocusHandler} onBlur={onHideHandler} onChangeText={onChangeTextHandler} onSubmitEditing={searchHandler}></TextInput>
                </View>
                <TouchableHighlight style={styles.cancelBtn} onPress={onPressHandler}
                    underlayColor={"transparent"}
                    activeOpacity={0.4}
                ><Text style={styles.cancelBtnTxt}>Cancelar</Text></TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: "#857bf7",
        justifyContent: "flex-end",
        padding: 15,
    },
    inputBtnContainer: {
        maxWidth: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    inputContainer: {
        flexGrow: 1,
        position: "relative",
    },
    cancelBtn: {
        
    },
    cancelBtnTxt: {
        fontSize: 16,
        fontWeight: "600",
        textTransform: "uppercase",
        color: "#fff",
    }
});