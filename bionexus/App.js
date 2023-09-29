import { React} from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import Statuses from './sections/home/statusesComponent';
import AudioHistory from './sections/home/audioHistoryComponent';

export default function App({props}) {

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.container}>
        <Statuses 
          key="0"
          bluetoothConnected={true}
          
          modelConnected={true}
          modelName={"BioNexus 1.0"}
          
          wifiConnected={true}
          wifiName={"Wifi do Pedro"}
          />

        <AudioHistory key="1"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeview: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: '#aaaaaa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 30,
  },
});

