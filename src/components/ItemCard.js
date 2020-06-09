import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import TimeAgo from 'react-native-timeago';
import TimeoutAvatar from './TimeoutAvatar';
import opts from '../../config';

const width = Dimensions.get('window').width;

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
                            <Image
                                style={styles.imageBlur}
                                source={{ uri: this.props.image }}
                                blurRadius={20}
                                resizeMode="stretch" />
                            <TimeoutAvatar
                                resizeMode="contain"
                                source={{ uri: this.props.image }}
                                logo={opts.logo}
                                style={styles.image}
                            />
                        </View> :
                            <View style={styles.imageContainer}>
                                <Image
                                    style={styles.imageLogo}
                                    source={opts.logo}
                                    resizeMode="stretch" />
                            </View>
                    }
                    {this.props.type == "photo" ? <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleStylePhoto}>{this.props.title ? this.props.title : ""}</Text> : null}

                    {this.props.type != "photo" ? <View style={styles.textContainer}>
                        <View style={styles.bodyContent}>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleStyle}>{this.props.title ? this.props.title : ""}</Text>
                            <Text numberOfLines={3} ellipsizeMode='tail' style={styles.subtitleStyle}>{this.props.message ? this.props.message : ""}</Text>
                        </View>
                        <View style={styles.actionBody}>
                            {
                                this.props.url ? <View style={styles.continueContainer}>
                                    <Text style={styles.continue}>{this.props.urlDescription}</Text>
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
        width: 185,
        height: 185,
        borderWidth: 0.75,
        borderColor: opts.color.LIGHT_PRIMARY,
        overflow: "hidden"
    },
    container: {
        backgroundColor: "#fff",
        marginHorizontal: 5,
        justifyContent: "space-between",
        width: 185,
        height: 260,
        borderWidth: 0.75,
        borderColor: opts.color.LIGHT_PRIMARY,
        overflow: "hidden"
    },
    imageContainer: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: opts.color.PRIMARY
    },
    textContainer: {
        flex: 5,
    },
    imageLogo: {
        height: 90,
        width: 100,
        justifyContent: 'center',
        tintColor: '#FFFFFF'
    },
    imageBlur: {
        height: '100%',
        width: width / 2,
        flex: 1,
    },
    image: {
        position: "absolute",
        width: width / 2,
        height: "100%"
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
        justifyContent: "flex-end",
        paddingTop: 5,
        paddingHorizontal: 5,
    },
    dateContainer: {
        height: 36,
    },
    date: {
        color: opts.color.PRIMARY,
        fontSize: 12
    },
    continueContainer: {
        height: 36,
    },
    continue: {
        color: opts.color.PRIMARY,
        fontSize: 12
    }
});