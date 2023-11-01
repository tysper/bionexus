import { useState, useRef, useEffect } from "react";
import {View, Text, StyleSheet, Image, Pressable, Animated, TouchableHighlight, Modal, ImageBackground} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import BtnOption from "./btnOptionComponent";

export default function Player(){
    const [playing, setPlaying] = useState(false);

    const [previewImg, setPreviewImage] = useState({image: require("./assets/background.jpg")});
    const [title, setTitle] = useState("Titulo");
    const [description, setDescription] = useState("Autor • Tipo");
    const [durationInSecs, setDurationInSecs] = useState(60);
    const [trackSetten, setTrackSetten] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const [widthFrontBar, setWidthFrontBar] = useState(0);
    const [widthBackBar, setWidthBackBar] = useState(0);

    const progression = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);

    // const mappedValue = progression.interpolate({
    //     inputRange: [0, durationInSecs],
    //     outputRange: [0, durationInSecs],
    //     extrapolate: "clamp",
    // })

    useEffect(() => {
        if(playing){
            Animated.timing(progression, {toValue: durationInSecs, useNativeDriver: true, duration: 1000*durationInSecs}).start();
        } else {
            Animated.timing(progression, {toValue: durationInSecs, useNativeDriver: true, duration: 1000*durationInSecs}).stop();
        }
    }, [playing]);

    function getWidth(event){
        const { width } = event.nativeEvent.layout;
        return width;
    }

    function onLayoutFrontBarHandler(event){
        setWidthFrontBar(getWidth(event)*-1);
    }

    function onLayoutBackBarHandler(event){
        setWidthBackBar(getWidth(event)*-1);
    }


    // function startTimer(){
    //     timer.current = setInterval(() => {
    //         setCurrentTime(mappedValue._value);
    //     }, 500);
    // }

    // function stopTimer(){
    //     clearInterval(timer.current);
    // }

    function onPlayPressHandler(){
        setPlaying(!playing);
        console.log(playing? "Paused": "Playing");
        // if(!playing){
        //     startTimer();
        // } else {
        //     stopTimer();
        // }
    }

    function setTrack(track){
        setTrackSetten(true);
        setPreviewImage(previewImg);
        setTitle(track.title);
        setDescription(track.description);
        setDurationInSecs(track.durationInSecs);
    }

    function onPlayerPressHandler(){
        setModalVisible(true);
    }

    useEffect(() => {
        setTrack({previewImage: {image: require("./assets/background.jpg")}, title: "Invocação do Mal", description: "Livro • Stephen King", durationInSecs: 60});
    }, [])
    
    function onPressBackHandler(){
        setModalVisible(false);
    }

    return (
            <TouchableHighlight
                style={styles.playerOutterContainer}
                activeOpacity={0.8}
                underlayColor={"#efefef"}
                onPress={onPlayerPressHandler}
            >
                <View style={styles.touchableContainerInner}>
                    <View style={styles.previewTitleContainer}>
                        <View style={styles.previewContainer}>
                            <Image style={styles.image} source={previewImg.image}/>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text> 
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <Pressable
                            onPress={onPlayPressHandler}
                        >
                            {
                                playing?
                                <Icon name="pause" size={16} color={"#787878"} />
                                :
                                <Icon name="play" size={16} color={"#787878"} />
                            }
                        </Pressable>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <Animated.View onLayout={onLayoutFrontBarHandler} style={[styles.progressBar, {transform: [{translateX: progression.interpolate(
                                {
                                    inputRange: [0, durationInSecs],
                                    outputRange: [widthFrontBar, 0]
                                }
                            )
                        }]}]}>
                        </Animated.View>
                    </View>
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                    >

                        <ImageBackground source={require("./assets/exemplo.jpg")} style={styles.backgroundImage} blurRadius={5}>
                            <View style={styles.modalInner}>
                                <View style={styles.topBarContainer}>
                                    <Pressable 
                                        style={styles.iconWrapper} 
                                        hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                                        onPress={onPressBackHandler}
                                    >
                                        <Icon name={"chevron-down"} size={20} color={"#fff"}/>
                                    </Pressable>
                                    <View style={styles.topBarTitleContainer}>
                                        <Text style={styles.topBarTitle}>{title}</Text>
                                    </View>
                                    <View style={[styles.iconWrapper, {backgroundColor: "transparent"}]}></View>
                                </View>
                                <View style={{flex: 1}}></View>
                                <View style={styles.controlsContainer}>
                                    <View style={styles.modalProgressBarContainer}>
                                        <View style={styles.modalBar}>
                                            <Animated.View onLayout={onLayoutBackBarHandler} style={[styles.modalProgressBar, {transform: [{translateX: progression.interpolate(
                                                {
                                                    inputRange: [0, durationInSecs],
                                                    outputRange: [widthBackBar, 0]
                                                }
                                            )}]}]}></Animated.View>                                      
                                        </View>
                                        <View style={styles.modalDurationContainer}>
                                            <Text style={styles.durationText}>{`${Math.floor(currentTime/60)}`.padStart(2, "0")}:{`${Math.floor(currentTime%60)}`.padStart(2, "0")}</Text>
                                            <Text style={styles.durationText}>{`${Math.floor(durationInSecs/60)}`.padStart(2, "0")}:{`${durationInSecs%60}`.padStart(2, "0")}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.modalControlsInnerContainer}>
                                        <BtnOption name={"shuffle"} size={30} persistent={true}/>
                                        <BtnOption name={"play-back"} size={30} persistent={true}/>
                                        <BtnOption name={playing? "pause": "play"} size={30} color={"#fff"} backgroundColor={"#857BF7"} onPress={onPlayPressHandler}/>
                                        <BtnOption name={"play-forward"} size={30}/>
                                        <BtnOption name={"repeat"} size={30} persistent={true}/>
                                    </View>
                                    <View></View>
                                </View>
                            </View>
                        </ImageBackground>
                    </Modal>
                </View>
            </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    playerOutterContainer: {
        backgroundColor: "#fff", 
        width: "98%", 
        marginHorizontal: "auto", 
        left: "1%", 
        bottom: 85, 
        height: 60, 
        position: "absolute", 
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
    },
    touchableContainerInner: {
        width: "100%", 
        flexDirection: "row", 
        alignItems: "center", 
        height: "100%", 
        paddingVertical: 10, 
        paddingLeft: 10, 
        paddingRight: 20,
    },
    previewTitleContainer: {
        flexDirection: "row",
        flexGrow: 1,
        gap: 10,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    description: {
        fontSize: 13,
        textTransform: "capitalize",
        letterSpacing: 1,
    },
    progressBarContainer: {
        width: "108%",
        height: 3,
        backgroundColor: "#989898",
        position: "absolute",
        bottom: 0,
        left: 0,
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        overflow: "hidden",
    },
    progressBar: {
        backgroundColor: "#857BF7",
        width: "50%",
        height: "100%",
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
    },
    modalInner: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        height: "100%",
        backgroundColor: "#0008"
    },
    backgroundImage: {
        justifyContent: "center",
        height: "100%",
    },
    topBarContainer: {
        width: "100%",
        flexDirection: "row",
    },
    iconWrapper: {
        width: 40,
        height: 40,
        backgroundColor: "#484848",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    },
    topBarTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    topBarTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 18,
    },
    controlsContainer: {
        width: "100%",
        
    },
    modalProgressBarContainer: {
        width: "100%",
    },
    modalBar: {
        width: "100%",
        height: 4,
        backgroundColor: "#999",
        borderRadius: 10,
        marginBottom: 5,
        overflow: "hidden",
    },
    modalProgressBar: {
        borderRadius: 10,
        height: "100%",
        backgroundColor: "#857BF7",
        width: "100%",
    },
    modalDurationContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
    },
    durationText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#eee",
    },
    modalControlsInnerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 20,
    }
});