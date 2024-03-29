import { useContext, useState, useRef, useEffect } from "react";
import {View, Text, StyleSheet, Animated, Image} from "react-native";
import WebView from "react-native-webview";
import Card from "./cardComponent";
import StreamRenderer from "./streamRenderer";
import Icon from "react-native-vector-icons/Ionicons";
import { AppContext } from "../../appcontext";


export default function LiveCamera() {
    const {connectionInfo, setConnectionInfo, connectedWithServer, setConnectedWithServer, isLoading} = useContext(AppContext);

    const spinnerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinnerAnimation, {toValue: 1, useNativeDriver: true, duration: 1000})
        ).start();
    }, [])



    return(
        <Card backgroundColor={"#fff"} paddingHorizontal={0} paddingVertical={0}>
            <View style={styles.container}>
                {connectedWithServer?
                    <WebView
                        style={[styles.image, {display: connectedWithServer? "flex": "none"}]}
                        source={{html: `<img style="width: 100%; height: 100%;"  id="stream" src="${connectionInfo["devices"]? 'http://'+connectionInfo["devices"]["esp32"]["local_ip"]+'/stream': ''}">`}}
                        useWebView2
                    />
                :
                isLoading?
                
                    <View style={[styles.image, {display: isLoading? "flex": "none", zIndex: 3, justifyContent: "center", alignItems: "center"}]}>
                            <Animated.View style={{transform: [{rotate: spinnerAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "360deg"]
                            })}]}}>
                                <Image source={require("./assets/spinner.png")} style={{width: 100, height: 100, opacity: 0.5}}/>
                            </Animated.View>
                    </View>
                
                :
                    <View style={[styles.image, {display: !connectedWithServer? "flex": "none", zIndex: 3, justifyContent: "center", alignItems: "center"}]}>
                        <Icon name={"alert-outline"} size={50} color={"#c00"} />
                        <Text style={{fontSize: 16, textTransform: "uppercase", fontWeight: "800"}}>Sem sinal</Text>
                    </View>
                }
                <View style={[styles.textContainer]}>
                    <View style={styles.dot}></View>
                    <Text style={styles.text}>Camera ao vivo</Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        borderRadius: 20,
        height: 300,
        overflow: "hidden",
    },
    image: {
        position: "absolute",
        top: -5,
        bottom: -5,
        left: -5,
        right: -5
    },
    textContainer: {
        position: "absolute",
        left: 10,
        bottom: 10,
        borderRadius: 10,
        backgroundColor: "#ffffffbb",
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 15,
        backgroundColor: "#ff4949",
    },
    text: {
        fontSize: 18,
        textTransform: "uppercase",
        fontWeight: "800",
        color: "#474747",
    },
    video: {
        height: "100%",
    }
})