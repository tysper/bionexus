import {React} from "react";
import {View, StyleSheet} from "react-native";

function generateBoxShadow(xOffeset, yOffset, shadowColorIos, shadowOpacity, shadowRadius, elevation, shadowColorAndroid) {
    if(Platform.OS === "ios") {
      styles.boxShadow = {
        shadowColor: shadowColorIos,
        shadowOffset: {width: xOffeset, height: yOffset},
        shadowOpacity,
        shadowRadius,
      };
    } else if(Platform.OS === "android") {
      styles.boxShadow = {
        elevation,
        shadowColorAndroid,
      }
    }
}

export default function Card({children, paddingVertical, paddingHorizontal, backgroundColor, style}) {
    generateBoxShadow(-2, 4, "#171717", 0.2, 3, 4, "#171717");
    return (
        <View style={[styles.card, styles.boxShadow, {paddingHorizontal: paddingHorizontal ?? 20, paddingVertical: paddingVertical ?? 30, backgroundColor: backgroundColor || "#fff"}, style || {}]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    alignItems: 'center',
    height: "auto",
  },
});
