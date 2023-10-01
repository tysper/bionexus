import {View, Text, StyleSheet, Image, TouchableOpacity, TouchableHighlight} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Item(props) {
    const item = props.item;
    return(
        <TouchableOpacity activeOpacity={0.6} underlayColor={"#787878"} >
            <View style={styles.outterContainer}>
                <View style={styles.imgTitleContainer}>
                    <Image style={styles.image} source={item.image}/>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.type}>{item.type}</Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.6} style={styles.iconContainer}>
                    <Ionicons style={styles.icon} name={props.name || "close"} size={25} color={"#857bf7"}></Ionicons>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomColor: "#787878",
        borderBottomWidth: 0.8,
        backgroundColor: "#fff",
    },
    imgTitleContainer: {
        flexDirection: "row",
        gap: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: "center", 
        borderRadius: 5,
    },
    titleContainer: {
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    type: {
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: -0.2,
        fontWeight: "600",
        color: "#787878",
    },
    iconContainer: {
        width: 28,
        height: 28,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {},
});