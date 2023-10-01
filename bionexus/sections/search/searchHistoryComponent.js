import { useState } from "react";
import {FlatList, StyleSheet, View, Text} from "react-native";

import Item from "./itemComponent";

export default function SearchHistory() {

    const [history, setHistory] = useState([
        {image: require("./assets/exemplo.jpg"), title: "Pequeno Príncipe", type: "Livro"},
        {image: require("./assets/exemplo.jpg"), title: "Pequeno Príncipe", type: "Livro"},
        {image: require("./assets/exemplo.jpg"), title: "Pequeno Príncipe", type: "Livro"},
        {image: require("./assets/exemplo.jpg"), title: "Pequeno Príncipe", type: "Livro"},
        {image: require("./assets/exemplo.jpg"), title: "Pequeno Príncipe", type: "Livro"},
    ]);

    function renderItem(item) {
        return (
            <Item item={item} />
        );
    }

    return (
        <View style={styles.outterContainer}>
            <Text style={styles.title}>Pesquisas recentes</Text>
            <FlatList
                keyExtractor={(_, i) => `${i+1}`}
                data={history}
                renderItem={({item}) => renderItem(item)}
                contentContainerStyle={styles.container}
                />
        </View>
    );
}

const styles = StyleSheet.create({ 
    outterContainer: {
        backgroundColor: "#fff",
    },
    title: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#787878",
        borderBottomColor: "#787878",
        borderBottomWidth: 0.5,
    },
    container: {
        height: "100%",
        backgroundColor: "#fff",
    }
    
});