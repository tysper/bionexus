import { useState, } from "react";
import {View, Text, Pressable, StyleSheet, TouchableOpacity, TextInput} from "react-native";


export default function Prompt(props){
    const [display, setDisplay] = useState(false);
    const [input, setInput] = useState("");
    const [inputValue, setInputValue] = useState("");

    function onCancelHandler(){
        closePrompt();
        setInput("");    
    }

    function onRenameHandler(){
        closePrompt();
        console.log("Renamed to "+ input);
        setInput("");
    }

    function closePrompt(){
        setDisplay(false);
        props.setVisible(false);
    }
    

    return (
        <View style={[styles.outterContainer, {display: display || props.visible? "flex": "none"}]}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Renomear faixa</Text>
                <Text style={styles.description}>Insira o novo nome da faixa abaixo</Text>
                <TextInput style={styles.input} placeholder={`${props.placeholder}`} value={input} onChangeText={value => setInput(value)}/>
                <View style={styles.btnsContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onCancelHandler}
                    >
                        <Text style={styles.text}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onRenameHandler}
                    >
                        <Text style={styles.text}>Renomear</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0002",
        // opacity: 0,
        // zIndex: -1,
        alignItems: "center",
        justifyContent: "center",
    },
    innerContainer: {
        padding: 30,
        backgroundColor: "white",
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#857BF7",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
    },
    btnsContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "space-around",
    },
    text: {
        fontSize: 16,
        fontWeight: "600",

    }
});