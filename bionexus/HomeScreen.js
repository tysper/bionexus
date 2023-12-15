import { React, useContext, useEffect, useState} from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, SectionList, Text, Modal, TouchableHighlight } from 'react-native';

import Statuses from './sections/home/statusesComponent';
import AudioHistory from './sections/home/audioHistoryComponent';
import LiveCamera from './sections/home/liveCameraComponent';
import { AppContext } from './appcontext';
import WebView from 'react-native-webview';


export default function HomeScreen(props) {
  const {bionexusConnected, setBionexusConnected, wifiConnected, setWifiConnected, wifiName, resultFound, setResultFound, lastText, setLastText, speakFunction, currentlyPlaying, setCurrentlyPlaying, base64Audio, setBase64Audio, checkLastResultFunction, setCheckLastResultFunction, setKeepChecking} = useContext(AppContext);

  const items = [
    <Text style={styles.title}>Inicio</Text>,
    <LiveCamera/>,
    <Statuses
      // bluetoothConnected={bionexusConnected}
      
      modelConnected={true}
      modelName={"BioNexus 1.0"}
      
      wifiConnected={wifiConnected}
      wifiName={wifiName}/>,
    <AudioHistory/>,
    <Modal animationType="slide" transparent={true} visible={resultFound}>
      <View style={{alignItems: "center", justifyContent: "center", height: "100%", backgroundColor:"#0002"}}>
        <View style={{alignItems: "center", justifyContent: "center", padding: 30, borderRadius: 10, backgroundColor: "#fff", gap: 20}}>
          <Text style={{fontSize: 24, fontWeight: 800}}>Texto Encontrado</Text>
          <Text style={{textAlign: "left"}}>{lastText || " "}</Text>
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor={"#55ff55"}
            onPress={() => {
              // speakFunction.readText(lastText);
            }}
            disabled={currentlyPlaying}
          >
            <View style={{backgroundColor: currentlyPlaying? "#44cc44": "#ff4444", borderRadius: 5, padding: 10}}>
              <Text style={{color: "#fff", fontWeight: 800}}>{currentlyPlaying? "REPRODUZINDO": "PROCESSANDO"}</Text>
            </View>
          </TouchableHighlight>
        <View style={{display: "none"}}>
          {
            currentlyPlaying ?
            <WebView
              style={{display: "none"}}
              originWhitelist={['*']}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              source={{
                html: 
                `<div style="display: flex; justify-content: center; align-items: center; width: 80%; height: 80%; scale: 2.5; border: 1px solid black;">
                  <audio class="audio-control" controls src="${base64Audio}" autoplay />
                </div>
                <script>
                  const audioControl = document.querySelector(".audio-control");

                  audioControl.addEventListener("ended", () => {
                    window.ReactNativeWebView.postMessage("ended");
                  })
                  
                  audioControl.addEventListener("complete", () => {
                    audioControl.play();
                  })

                </script>`
              }}
              useWebView2
              // style={{height: "100%"}}
              onMessage={(event) => {
                if(event.nativeEvent.data === "ended"){
                  setCurrentlyPlaying(false);
                  setResultFound(false);
                  setLastText("");
                  setBase64Audio("");
                  setTimeout(() => {
                    setKeepChecking(true);
                  }, 1000);
                }
              }}
              />
            :
            <WebView style={{display: "none"}} source={{html: "<p></p>"}}/>

          }
        </View>
        </View>
      </View>
    </Modal>
  ]

  return (
    <SafeAreaView style={{flex: 1}}>
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

