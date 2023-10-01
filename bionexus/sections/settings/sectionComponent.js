import {View, Text, StyleSheet, TouchableOpacity} from "react-native";

export default function Section(props){
    return (
        <TouchableOpacity activeOpacity={0.5} style={styles.outterComponent}>
            <View style={styles.titleInfoContainer}>
                <Text style={styles.title}>{props.title}</Text>
                { typeof props.info === "string"?
                    <Text style={styles.info}>{props.info}</Text>
                    : typeof props.info === "object"?
                    props.info.map((info, i) =>(<Text key={i} style={styles.info}>{info}</Text>))
                    :
                    null
                }
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outterComponent: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        width: "100%",
    },
    titleInfoContainer: {
        gap: 5,
    },
    title: {
        fontSize: 16,
        color: "#484848",
        fontWeight: "600",
    },
    info: {
        fontSize: 14,
        color: "#585858",
        fontWeight: "400"
    },
})