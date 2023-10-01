import {View, Text, StyleSheet, Image} from "react-native";
import Card from "./cardComponent";

export default function LiveCamera() {
    return(
        <Card backgroundColor={"#fff"} paddingHorizontal={0} paddingVertical={0}>
            <View style={styles.container}>
                <Image style={styles.image} source={require("./assets/exemplo.jpg")} width={300} height={300}></Image>
                <View style={styles.textContainer}>
                    <View style={styles.dot}></View>
                    <Text style={styles.text}>Camera ao vivo</Text>
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        borderRadius: 20,
        height: 300,
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
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
    }
})