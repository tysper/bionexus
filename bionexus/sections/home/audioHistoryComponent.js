import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Card from "./cardComponent";
import Track from "./trackComponent";

export default function AudioHistory(){
    return (
        <Card paddingHorizontal={0} paddingVertical={0} backgroundColor="#787878" style={{gap: 1}}>
            <View style={styles.componentTitleWrapper}>
                <Text style={styles.componentTitle}>Últimas Transcrições</Text>
            </View>
            <Track percentage={78} duration={10} title="Pequeno Principe"/>
            <Track percentage={20} duration={435} title="Pequeno Principe"/>
            <Track percentage={78} duration={788} title="Pequeno Principe"/>
            <Track percentage={32} duration={43} title="Pequeno Principe" lastOne={true}/>
        </Card>
    )
}

const styles = StyleSheet.create({
    componentTitleWrapper: {
        paddingVertical: 15,
        backgroundColor: "#fff",
        width: "100%",
        alignItems: "center",
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
    },
    componentTitle: {
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "800",
        color: "#474747"
    },
    trackWrapper: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
    }
})