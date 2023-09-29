import { useState } from "react";
import { StyleSheet, TouchableHighlight, Text, View, Image} from "react-native";


const fontSize = 16;
let timer;

export default Track = function(props) {

    const [active, setActive] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);


    function onPressHandler() {
        setActive(!active);

        if(active) {
            clearInterval(timer);
        } else {
            timer = setInterval(
            () => {
                setCurrentTime((prevTime) => {
                    if(prevTime === props.duration) {
                        clearInterval(timer);
                        setActive(false);
                        return 0;
                    }
                    return prevTime + 0.01;
                });
            }, 10);
        }   
    }

    return (
        <TouchableHighlight 
            activeOpacity={0.9}    
            underlayColor="#d9d9d9"
            onPress={onPressHandler}
            style={[styles.container, props?.lastOne? {borderBottomStartRadius: 20, borderBottomEndRadius: 20}: {}, active? {backgroundColor: "#686868"}: {backgroundColor: "#fff"}]}
        >
            <View style={styles.innerContainer}>
                <View style={styles.containerIconText}>
                    <Image style={styles.icon} source={active? require("./assets/pause.png") :require("./assets/play.png")}/>
                    <Text style={[styles.text, active? {color: "#fff"} : {color: "#787878"}]}>{props.title}</Text>
                </View>
                <View style={styles.containerTime}>
                    <View style={styles.time}>
                        <Text style={[styles.timeText, active? {color: "#fff"} : {color: "#787878"}]}>
                            {`${Math.floor(props.duration/60)}`.padStart(2, "0")}
                        </Text>
                    </View>
                    <Text style={[styles.timeText, active? {color: "#fff"} : {color: "#787878"}]}>Min</Text>
                    <View style={styles.time}>
                        <Text style={[styles.timeText, active? {color: "#fff"} : {color: "#787878"}]}>
                            {`${props.duration%60}`.padStart(2, "0")}
                        </Text>
                    </View>
                    <Text style={[styles.timeText, active? {color: "#fff"} : {color: "#787878"}]}>seg</Text>
                </View>
                {
                    active?
                    [                
                    <View key="0" style={{ position: "absolute", bottom: 0, top: 0, backgroundColor: "#857BF7", left: 0, right: `${117 - ((currentTime/props.duration*100)*117/100)}%`, zIndex: -1}}></View>,
                    <View key="1" style={{ position: "absolute", bottom: 0, top: 0, backgroundColor: "#787878", left: 0, right: 0, zIndex: -2}}></View>
                    ]: []
                }
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
        gap: 10,
    },
    icon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
    },
    text: {
        fontSize: fontSize,
        textTransform: "uppercase",
        fontWeight: "800",
        color: "#fff",
        width: "100",
        
    },
    containerTime: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },
    time: {
        width: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    timeText: {
        fontSize: fontSize,
        fontWeight: "800",
        color: "#fff",
        textTransform: "uppercase"
    }
});
