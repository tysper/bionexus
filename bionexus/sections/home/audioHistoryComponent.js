import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Card from "./cardComponent";
import Track from "./trackComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";

import { AppContext } from "../../appcontext";

export default function AudioHistory(props){

    const {lastTracks, setLastTracks} = useContext(AppContext);


    useEffect(() => {
        
        async function checkLastTracks(){
            let lastTracksArr = await AsyncStorage.getItem("tracks_last-tracks");

            setLastTracks(lastTracksArr?.tracks);
        }

        checkLastTracks();
    }, [])




    return (
        <Card paddingHorizontal={0} paddingVertical={0} backgroundColor="#787878" style={{gap: 1}}>
            <View style={styles.componentTitleWrapper}>
                <Text style={styles.componentTitle}>Últimas Transcrições</Text>
            </View>

            {
                lastTracks?
                lastTracks.map((el, i) => {
                    return(
                        <Track title={el.title} trackAuthor={el.trackAuthor} trackType={el.trackType} lastOne={i==3}/>
                    )
                })
                :
                <Text style={{marginVertical: 20, fontWeight: "600", color: "white" }}>Nenhuma transcrição recente.</Text>
            }
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