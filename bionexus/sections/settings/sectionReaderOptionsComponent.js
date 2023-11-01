import {View, Text, StyleSheet} from "react-native";
import SettingItem from "./settingItemComponent";

export default function SectionReaderOptions(props) {
    return (
        <View style={styles.outterContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <SettingItem type="switcher" title="Salvar transcrição" info="Audios serão salvos em seu dispositivo."/>
            {/* <SettingItem type="switcher" title="Clicar para ler" info="Clique no seu BioNexus para ditar o texto."/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    outterContainer: {
        backgroundColor:"transparent",
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        color: "#474747",
        paddingBottom: 10,
    }
});

