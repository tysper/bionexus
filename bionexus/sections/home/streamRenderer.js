import { View, Image, StyleSheet } from "react-native";

export default function StreamRenderer(){

    fetch("http://192.168.0.21:81/stream", {reactNative: {textStreaming: true}})
    .then(response => console.log(response.body))
    .then(stream => console.log(stream))

    return (<View>

    </View>)
}

const styles = StyleSheet.create({

});


