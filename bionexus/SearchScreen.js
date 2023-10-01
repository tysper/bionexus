import {React, useState} from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";

import SearchBar from "./sections/search/searchbarComponent";
import SearchHistory from "./sections/search/searchHistoryComponent";
import SearchResults from "./sections/search/searchResultsComponent";
import { StatusBar } from "expo-status-bar";

export default function SearchScreen() {
    const [view, setView] = useState("history");

    return (
        <View style={styles.outterContainer}>
            <StatusBar backgroundColor="#857bf7"></StatusBar>
            <SearchBar setView={setView}/>
            {
                view === "history"? <SearchHistory/>: view === "results"? <SearchResults/>: null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    outterContainer: {
        width: "100%",
        height: "100%",
    }
});