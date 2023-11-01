import {React, useState} from "react";
import {View, StyleSheet, SafeAreaView} from "react-native";

import SearchBar from "./sections/search/searchbarComponent";
import SearchHistory from "./sections/search/searchHistoryComponent";
import SearchResults from "./sections/search/searchResultsComponent";

export default function SearchScreen() {
    const [view, setView] = useState("history");

    return (
        <View style={styles.outterContainer}>
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