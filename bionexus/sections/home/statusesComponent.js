
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Card from './cardComponent';

const iconSize = 30;
const imgSize = 45;



export default function Statuses(props) {

  const connectionStatus = [
    // {label: "status", key: "1", fontawesomeIcon: "bluetooth", info: props.bluetoothConnected? "conectado" : "desconectado", color: "#3491FF"},
    {label: "modelo", key: "2", fontawesomeIcon: "bionexus", info: props.modelConnected? props.modelName: "desconectado"},
    {label: "wifi", key: "3", fontawesomeIcon: "wifi", info: props.wifiConnected? props.wifiName: "desconectado", color: "#73E77F"},
  ];

  return (
    <Card >
      <View style={styles.innerBorder}>
        {
          connectionStatus.map((row) => {
            if(row.fontawesomeIcon === "bionexus"){
              return(
                <View key={row.key} style={styles.statusRow}>
                  <Image style={styles.image} source={require(`./assets/bionexus.png`)}/>
                  <Text style={styles.label}>{row.label}:</Text>
                  <Text style={styles.info}>{row.info}</Text>
                </View>
              )
            } else {
              return(
                <View key={row.key} style={styles.statusRow}>
                  <View style={styles.iconWrapper}>
                    <FontAwesome5 name={row.fontawesomeIcon} size={iconSize} color={row.color} style={styles.icon}/>
                  </View>
                  <Text style={styles.label}>{row.label}:</Text>
                  <Text style={styles.info}>{row.info}</Text>
                </View>
              )
            }
          })
        }
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  innerBorder: {
  },
  statusRow: {
    flexDirection: "row",
    alignItems: 'center'
  },
  image: {
    marginRight: 10,
    width: imgSize,
    height: imgSize,
    resizeMode: 'center',
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: imgSize,
    height: imgSize,
    marginRight: 10,
  },
  icon: {
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "800",
    color: "#111",
    marginRight: 2.5,
    fontSize: 20
  },
  info: {
    textTransform: "uppercase",
    fontWeight: "800",
    color: "#787878",
    fontSize: 20
  }
});
