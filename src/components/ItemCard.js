import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image, Icon } from "react-native-elements";
import TimeAgo from 'react-native-timeago';
import TimeoutAvatar from './TimeoutAvatar';
import opts from '../../config';

const width = Dimensions.get('window').width;
const hatafoto = require("../assets/hatafoto.png")

export default class ItemCard extends Component {
    constructor(props) {
        super(props)
        this.props = props;
    }

    onpress = () => {
        if (this.props.onpress)
            this.props.onpress(this.props.url);
    }

    render() {
        return (
            <View style={styles.flex}>
                <TouchableOpacity onPress={this.onpress} style={this.props.type != "photo" ? styles.container : styles.containerPhoto}>
                    {
                        this.props.image ? <View style={styles.imageContainer}>

                            <TimeoutAvatar
                                resizeMode="contain"
                                source={{ uri: this.props.image }}
                                logo={hatafoto}
                                style={styles.imageTimeAvatar}
                            />
                        </View> :
                            <View style={styles.imageContainerPhoto}>
                                <Image
                                    style={styles.imageLogoPhoto}
                                    source={this.props.image}
                                    resizeMode="contain" />
                            </View>
                    }
                    {/* TODO : resimlerin title kapattım tasarıma göre
                    {this.props.type == "photo" ? <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleStylePhoto}>{this.props.title ? this.props.title : ""}</Text> : null} 
                    */}

                    {this.props.type != "photo" ? <View style={styles.textContainer}>
                        <View style={styles.bodyContent}>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleStyle}>{this.props.title ? this.props.title : ""}</Text>
                            <Text numberOfLines={3} ellipsizeMode='tail' style={styles.subtitleStyle}>{this.props.message ? this.props.message : ""}</Text>
                        </View>
                        <View style={styles.actionBody}>
                            {
                                this.props.url ? <View style={styles.continueContainer}>
                                    <Text style={styles.continue}>{this.props.urlDescription}</Text>
                                    <Icon
                                        name='keyboard-arrow-right'
                                        type='MaterialIcons'
                                        size={17}
                                        color={"#00000060"}
                                    />
                                </View> : null
                            }
                        </View>
                    </View> : null}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        paddingTop: 10,
    },
    containerPhoto: {

        backgroundColor: "#fff",
        marginHorizontal: 5,
        justifyContent: "space-between",
        width: 160,

        borderRadius: 15,
    },
    container: {
        backgroundColor: "#fff",
        margin: 10,
        justifyContent: "space-between",
        width: 160,
        height: 275,

        shadowColor: "#afafaf",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    },

    imageContainer: {

        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",
        borderRadius: 15,
        height: 160,
        width: 160,
    },
    imageContainerPhoto: {

        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",
        borderRadius: 15,
    },
    textContainer: {
        flex: 1,
        justifyContent: "space-between",
    },
    imageLogoPhoto: {
        height: 100,
        width: 160,
        justifyContent: 'center',
        tintColor: '#FFFFFF',
    },

    imageTimeAvatar: {
        position: "absolute",
        width: 160,
        height: 160,

    },
    bodyContent: {
        justifyContent: "flex-start",
        padding: 5,
        flex: 1,
        paddingHorizontal: 5,
        paddingTop: 6,
    },
    titleStyle: {
        color: '#000000',
        paddingBottom: 5,
        fontSize: 18,
        fontWeight: "600"
    },
    titleStylePhoto: {
        textAlign: "center",
        padding: 5,
        paddingHorizontal: 5,
        color: '#000000',
        fontSize: 18,
    },
    subtitleStyle: {
        color: "#000000",
        opacity: 0.5,
        fontSize: 14,
        lineHeight: 16
    },
    actionBody: {
        flexDirection: "row",
        paddingHorizontal: 5,
    },

    continueContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    continue: {
        color: "#00000080",
        fontSize: 10
    }
});