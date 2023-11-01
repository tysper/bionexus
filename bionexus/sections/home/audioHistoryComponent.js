import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Card from "./cardComponent";
import Track from "./trackComponent";

export default function AudioHistory(props){
    return (
        <Card paddingHorizontal={0} paddingVertical={0} backgroundColor="#787878" style={{gap: 1}}>
            <View style={styles.componentTitleWrapper}>
                <Text style={styles.componentTitle}>Últimas Transcrições</Text>
            </View>
            <Track title="Harry Potter" trackAuthor="J.K Rolling" trackType="Livro"/>
            <Track title="Invocação do Mal" trackAuthor="Autor desconhecido" trackType="Livro"/>
            <Track title="Pequeno Principe" trackAuthor="Antoine de Saint-Exupéry" trackType="Livro" />
            <Track title="A Fazenda" trackAuthor="Monteiro Lobato" trackType="Livro" lastOne={true}/>
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