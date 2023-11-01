import { useState } from "react";
import {TouchableHighlight, TouchableOpacity, View, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function BtnOption(props){
    const [active, setActive] = useState(false);

    function onPressHandler(){
        setActive(!active);
        try{
            props.onPress();
        } catch {
            console.log("No function was declared");
        }
    }

    return (
        <TouchableHighlight
            activeOpacity={props.activeOpacity || 0.8}
            underlayColor={props.underlayColor || "#989898"}
            onPress={onPressHandler}
            style={[styles.iconWrapper, {backgroundColor: props.backgroundColor || "transparent"}]}
            hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
        >
            <Icon name={props.name} size={props.size || 30} color={props.persistent? active? "#857BF7": props.color || "#fff":props.color || "#fff"}/>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    }
});