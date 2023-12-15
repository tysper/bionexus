import { useContext } from "react";
import {View, Text, StyleSheet} from "react-native";
import SettingItem from "./settingItemComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppContext } from "../../appcontext";

export default function SectionReaderOptions(props) {

    const {saveReading, setSaveReading} = useContext(AppContext);

    async function saveReadingHandler(state) {
        setSaveReading(state);

        try {
            await AsyncStorage.setItem("setting_save-reading", JSON.stringify(state));
        } catch(err) {
            console.log("There was an error in when setting setting in sectionReaderOptionsComponent. ("+err+")");
        }
    }

    return (
        <View style={styles.outterContainer}>
            <Text style={styles.title}>{props.title}</Text>
            <SettingItem type="switcher" title="Salvar transcrição" info="Audios serão salvos em seu dispositivo." onPress={saveReadingHandler} active={saveReading}/>
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

