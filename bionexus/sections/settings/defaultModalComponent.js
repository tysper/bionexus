import {Modal, View, Text, StyleSheet, TouchableOpacity, Platform} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function DefaultModal(props) {
    return (
        <Modal
            visible={props.visible}
            animationType={`${props.animationType}`}
        >
            <View style={[styles.supportModal, Platform.OS === "ios"? {paddingTop: 50}: null, {backgroundColor: `${props.containerStyle.backgroundColor}` || "transparent"}]}>
                <TouchableOpacity style={styles.iconButtonContainer} activeOpacity={0.5} onPress={() => {props.onPressBack(false)}}>
                    <FontAwesome5 name={"angle-left"} size={30} color={"#474747"}/>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>
                <View style={props.containerStyle}>
                    {props.children}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    supportModal: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    iconButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    backText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#474747",
        textTransform: "uppercase",
    },
});

