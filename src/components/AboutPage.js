import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import * as notificationApi from '../apis/aboutApi';
import i18n from '../locales';
import ItemCard from './ItemCard';
import NoDataText from './NoDataText';
import opts from '../../config';
import * as langStore from '../store/language';
import { Image } from "react-native-elements";
import TimeoutAvatar from 'react-native-wooabout/src/components/TimeoutAvatar';
import DeviceInfo from 'react-native-device-info';

const logowoo = require("../assets/woomedyalogo.png")
export default class AboutPage extends Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.defaultLang = 'tr';

        this.state = {
            i18n: i18n(),
            notificationsList: [],
            initial: false,
            refreshing: false,
            description: null,
        };
    }

    componentDidMount() {
        this.refresh();

        langStore.default.addListener(langStore.LANG, this.langChanged);
    }

    componentWillUnmount() {
        langStore.default.removeListener(langStore.LANG, this.langChanged);
    }

    refresh = async () => {
        this.setState({
            initial: false
        });

        var notificationsList = await this.getNotificationList();
        this.defaultLang = notificationsList[0].defaultLang;
        var description = notificationsList.map(x => x.items)[0].map(x => x.title[opts.lang] || x.title[this.defaultLang] == DeviceInfo.getApplicationName() ? x.description : null).filter(x => x != null)[0];
        var descriptionLang = description[opts.lang] || description[this.defaultLang];

        this.setState({
            notificationsList,
            initial: true,
            refreshing: false,
            description: descriptionLang
        });
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });
    }

    getNotificationList = async () => {
        var lang = langStore.getLanguage();
        return await notificationApi.getNotificationList({ lang });
    }

    openDetail = (url) => {
        if (this.props.openDetail)
            this.props.openDetail(url);
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true
        }, this.refresh);
    }

    keyItem = (item, index) => {
        return index.toString();
    }

    renderItem = ({ item }) => {
        return <ItemCard
            type={item.type}
            url={Platform.OS == 'ios' ? item.link.ios : item.link.android}
            title={item.title[opts.lang] || item.title[this.defaultLang]}
            message={item.message[opts.lang] || item.message[this.defaultLang]}
            image={item.image[opts.lang] || item.image[this.defaultLang]}
            onpress={this.openDetail}
            urlDescription={this.state.i18n.notification.urlDescription}
        />
    }
    renderCategory = ({ item }) => {
        return item.items ? <View  >
            <View style={{
                flexDirection: "row", justifyContent: "space-between",
                backgroundColor: "#fff", marginTop: 15, paddingVertical: 10, paddingHorizontal: 5, marginHorizontal: 5
            }}>
                <Text style={styles.titleStyle}>{item.title[opts.lang] || item.title[this.defaultLang]}</Text>
                {(Platform.OS == 'ios' ? item.link.ios : item.link.android) ? <TouchableOpacity onPress={() => this.openLink(Platform.OS == 'ios' ? item.link.ios : item.link.android)}>
                    <Text style={styles.subTextStyleMin}>{this.state.i18n.all}</Text>
                </TouchableOpacity> : null}
            </View>
            <FlatList
                numColumns={1}
                keyExtractor={this.itemKey}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                data={item.items}
                initialNumToRender={4}
                horizontal
                style={styles.itemlist}
                renderItem={this.renderItem}
            />
        </View> : null
    }

    openLink = (link) => {
        Linking.openURL(link);
    }

    renderNoText = () => {
        return opts.renderNoText ? opts.renderNoText(this.state.notificationsList.length == 0) : <NoDataText
            visible={this.state.notificationsList.length == 0}
            text={this.state.i18n.notification.noData} />
    }

    footerComponent = () => {
        return <TouchableOpacity onPress={() => this.openLink(this.state.i18n.webUrl)} style={{ flexDirection: "row", backgroundColor: "#fff", marginTop: 20, padding: 10 }}>
            <Image
                resizeMode="center"
                source={logowoo}
                style={[styles.imageStyleFooter]}
            />
            <View style={{ flexDirection: "column", flex: 1, alignSelf: "center" }}>
                <Text numberOfLines={3} ellipsizeMode='tail' style={[styles.titleStyle, { textAlign: "center" }]}>Woo Medya Dijital Reklamcı</Text>
                <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.subtitleStyle, { textAlign: "center" }]}>www.woomedya.com.tr</Text>

            </View>
        </TouchableOpacity>
    }

    render() {
        return <View style={styles.container}>
            {this.renderNoText()}
            <View style={styles.flex}>
                <View style={styles.headerContainer}>
                    <View style={{ flexDirection: "row", }}>

                        <View style={styles.imageContainerHeader}>
                            <Image
                                resizeMode="contain"
                                source={opts.logo}
                                style={styles.imageStyle}
                            />
                        </View>
                        <View style={{ flexDirection: "column", flex: 1, alignSelf: "center" }}>
                            <Text numberOfLines={3} ellipsizeMode='tail' style={[styles.titleStyle, { textAlign: "center" }]}> {DeviceInfo.getApplicationName()}</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.subtitleStyle, { textAlign: "center" }]}>Ver :{DeviceInfo.getVersion()}</Text>

                        </View>
                    </View>

                    <View style={styles.textContainer}>
                        <Text ellipsizeMode='tail' style={styles.subTextStyle}>{this.state.description} </Text>
                    </View>
                </View>
                <FlatList
                    contentContainerStyle={{ padding: 5, }}
                    numColumns={1}
                    keyExtractor={this.itemKey}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    data={this.state.notificationsList}
                    initialNumToRender={4}
                    renderItem={this.renderCategory}
                    style={styles.analist}
                    ListFooterComponent={this.footerComponent}
                />

            </View>


        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flex: {
        flex: 1,
        paddingTop: 10,
    },
    headerContainer: {
        marginHorizontal: 10,
        justifyContent: "space-between",
        padding: 10,
        paddingBottom: 20,
        borderWidth: 0.75,
        borderColor: opts.color.LIGHT_PRIMARY,
        backgroundColor: "#fff",
        overflow: "hidden"
    },
    imageContainerHeader: {
        padding: 2,
        height: 120,
        width: 120,
        overflow: "hidden",
        backgroundColor: "#fff",
        backgroundColor: opts.color.PRIMARY
    },

    textContainer: {
        top: 10
    },
    imageStyle: {
        height: "100%"
    },
    imageStyleFooter: {
        height: 75,
        width: 75,
        alignSelf: "center",
        overflow: "hidden"
    },
    titleStyle: {
        color: '#000000',
        paddingBottom: 5,
        fontSize: 20,
    },
    subtitleStyle: {
        color: "#000000",
        opacity: 0.5,
        fontSize: 14,
        lineHeight: 16
    },
    subTextStyle: {
        fontSize: 14,
    },
    subTextStyleMin: {
        fontSize: 10,
    },
    analist: {
        height: 'auto'
    },

    itemlist: {
        marginTop: -10,
        height: 'auto'
    }
});