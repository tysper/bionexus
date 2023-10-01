import {React, useState }from "react";
import {View, Text, StyleSheet, StatusBar, FlatList} from "react-native";

import SectionInitial from "./sections/settings/sectionInitialComponent.js";
import SectionReaderOptions from "./sections/settings/sectionReaderOptionsComponent.js";
import SectionConnections from "./sections/settings/sectionConnectionsComponent.js";

export default function SettingsScreen(){
    const [sections, setSections] = useState([
        <SectionInitial/>,
        <SectionReaderOptions title="Opções de leitura"/>,
        <SectionConnections title="Conexões e Dispositivos"/>
    ])

    return (
        <View style={styles.outterContainer}>
            <StatusBar/>
            <Text style={styles.title}>Configurações</Text>
            <FlatList
                data={sections}
                keyExtractor={(_, i) => `${i}`}
                renderItem={({item}) => item}
                contentContainerStyle={styles.list}
            >
            </FlatList>
        </View>
    );
}

const styles = StyleSheet.create({ 
    outterContainer: {
        paddingVertical: 30,
        backgroundColor: "#f3f3f3",
        height: "100%",
    },
    title: {
        fontSize: 25,
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "600",
        color: "#373737",
        paddingVertical: 40,

    },
    list: {
        paddingHorizontal: 20,
        backgroundColor: "transparent",
    }
});



