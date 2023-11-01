import {useState} from "react";
import {Text, View, StyleSheet, Pressable} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Option(props){
    const [pressedState, setPressedState] = useState(props.pressed? true: false);

    function onPressHandler(){
        setPressedState(!pressedState)
    }

    function onPressHandlerFunction(){
        try {
            props.onPress();
        } catch {
            console.log("[OPTION COMPONENT]: no function defined.")
        }
    }

    return (
        <Pressable
            style={{ opacity: pressedState? 0.7: 1}}
            onPressIn={props.persistent? onPressHandler: onPressHandler}
            onPressOut={props.persistent? null: onPressHandler}
            onPress={onPressHandlerFunction}
        >
            <View style={styles.outterView}>
                <Icon name={props.iconName} size={35} color={pressedState? "#857BF7" : "#787878"}/>
                <Text style={[styles.text, {color: pressedState? "#857BF7" : "#787878"}]}>{props.description}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    outterView: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
    }
});