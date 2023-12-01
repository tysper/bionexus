import { React, useContext, useEffect, useState} from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, SectionList, Text } from 'react-native';

import Statuses from './sections/home/statusesComponent';
import AudioHistory from './sections/home/audioHistoryComponent';
import LiveCamera from './sections/home/liveCameraComponent';
import { AppContext } from './appcontext';

export default function HomeScreen(props) {
  const {bionexusConnected, setBionexusConnected, wifiConnected, setWifiConnected, wifiName} = useContext(AppContext);

  const items = [
    <Text style={styles.title}>Inicio</Text>,
    <LiveCamera/>,
    <Statuses
      bluetoothConnected={bionexusConnected}
      
      modelConnected={true}
      modelName={"BioNexus 1.0"}
      
      wifiConnected={wifiConnected}
      wifiName={wifiName}/>,
    <AudioHistory/>
  ]

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <StatusBar backgroundColor="#f3f3f3"></StatusBar> */}
      <View style={styles.listContainer}>
        
        <FlatList 
          contentContainerStyle={styles.container}
          data={items}
          keyExtractor={(_, i) => `${i+1}`}
          renderItem={({item}) => item}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    overflow: "scroll",
    backgroundColor: "#f3f3f3"
  },
  title: {
    textAlign: "center",
    fontWeight: "800",
    color: "#474747",
    fontSize: 40,
    paddingVertical: 10,
  },
  container: {
    backgroundColor: '#f3f3f3',
    gap: 30,
    flexGrow: 0,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50
  },
});

