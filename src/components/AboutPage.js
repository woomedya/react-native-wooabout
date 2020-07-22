import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Linking, Platform } from 'react-native';
import * as itemApi from '../apis/aboutApi';
import i18n from '../locales';
import ItemCard from './ItemCard';
import NoDataText from './NoDataText';
import opts from '../../config';
import * as langStore from '../store/language';
import { Image } from "react-native-elements";
import DeviceInfo from 'react-native-device-info';
import TimeoutAvatar from './TimeoutAvatar';

const logowoo = require("../assets/woomedyalogo.png")
export default class AboutPage extends Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.defaultLang = 'en';
        this.counterIndex = 0;
        this.state = {
            i18n: i18n(),
            itemList: [],
            initial: false,
            refreshing: false,
            description: null,
            itemTitle: '',
            logoImage: ''
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

        var itemList = await this.getItemList();

        this.defaultLang = itemList[0].defaultLang;

        var description = itemList.map(x => x.items)[0].map(x => x.applicationId == opts.applicationId ? x.description : null).filter(y => y != null)[0] || '';
        var itemLang = itemList.map(x => x.items)[0].map(x => x.applicationId == opts.applicationId ? x.lang : null).filter(y => y != null) || "";
        var itemTitle = itemList.map(x => x.items)[0].map(x => x.applicationId == opts.applicationId ? x.title : null).filter(y => y != null)[0] || "";
        var descriptionLang = description[opts.lang] || description[itemLang];
        itemTitle = itemTitle[opts.lang] || itemTitle[itemLang]
        var logoImage = itemList[0].logo;
        this.setState({
            itemList,
            initial: true,
            refreshing: false,
            description: descriptionLang,
            itemTitle,
            logoImage,
        });
    }

    langChanged = () => {
        this.setState({
            i18n: i18n()
        });

    }

    getItemList = async () => {

        var lang = langStore.getLanguage();
        return await itemApi.getItemList({ lang });
    }

    openDetail = (url) => {
        if (url.trim())
            Linking.canOpenURL(url.trim()).then(supported => {
                if (supported) {
                    Linking.openURL(url.trim());
                } else {
                    console.log("Don't know how to open URI: " + url.trim());
                }
            });

    }

    turkishToUpper = (value) => {
        var string = value;
        var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
        string = string.replace(/(([iışğüçö]))/g, function (letter) { return letters[letter]; })
        return string.toUpperCase();
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
            title={item.title[opts.lang] || item.title[item.lang]}
            message={item.message[opts.lang] || item.message[item.lang]}
            image={item.image[opts.lang] || item.image[item.lang]}
            onpress={() => this.openDetail(Platform.OS == "android" ? item.link.android : item.link.ios)}
            urlDescription={this.state.i18n.item.urlDescription}
        />
    }
    renderCategory = ({ item, index }) => {

        item.items ? this.counterIndex = this.counterIndex + 1 : null;

        return item.items ? <View style={[this.counterIndex % 2 == 0 ? { backgroundColor: "#fff" } : { backgroundColor: "#f2f2f2" }]}>
            <View style={[this.counterIndex % 2 == 0 ? { backgroundColor: "#f2f2f2" } : { backgroundColor: "#fff" }, { borderTopRightRadius: 20, borderTopLeftRadius: 20, }]}>
                <View style={styles.katagoriHeader}>
                    <Text style={styles.titleStyle}>{item.title[opts.lang] ? item.title[opts.lang] : item.title[this.defaultLang]}</Text>

                </View>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    data={item.items}
                    initialNumToRender={4}
                    horizontal
                    style={styles.itemlist}
                    renderItem={this.renderItem}
                />
                {(Platform.OS == 'ios' ? item.link.ios : item.link.android) ? <TouchableOpacity style={{ padding: 22, }} onPress={() => this.openDetail(Platform.OS == 'ios' ? item.link.ios : item.link.android)}>
                    <Text style={[styles.styleTumunuGoster]}>{this.turkishToUpper(this.state.i18n.all)}</Text>
                    <Text style={[styles.styleLine]}></Text>

                </TouchableOpacity> : null}

            </View>
        </View> : null
    }

    renderNoText = () => {
        return opts.renderNoText ? opts.renderNoText(this.state.itemList.length == 0) : <NoDataText
            visible={this.state.itemList.length == 0}
            text={this.state.i18n.item.noData} />
    }

    footerComponent = () => {
        return <TouchableOpacity onPress={() => this.openDetail(this.state.i18n.webUrl)} style={styles.fooderContainer}>
            <TimeoutAvatar
                resizeMode="contain"
                source={{ uri: this.state.logoImage }}
                style={[styles.imageStyleFooter]}
            />


        </TouchableOpacity>
    }

    headerComponent = () => {
        return <View style={styles.headerContainer}>
            <View style={{ alignItems: "center" }}>

                <View style={styles.imageContainerHeader}>
                    <Image
                        resizeMode="contain"
                        source={opts.logo}
                        style={styles.imageStyle}
                    />
                </View>
                <View style={styles.headerContainerText}>
                    <Text style={[styles.titleStyle,]}> {this.state.itemTitle}</Text>
                    <Text style={[styles.subtitleStyle,]}>Ver :{DeviceInfo.getVersion()}</Text>

                </View>
            </View>

            <View style={styles.textContainer}>
                <Text ellipsizeMode='tail' style={styles.containerSubTextStyle}>{this.state.description} </Text>
            </View>

        </View>
    }

    render() {
        return <View style={styles.container}>

            <View style={styles.flex}>

                <FlatList
                    contentContainerStyle={{}}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    data={this.state.itemList}
                    initialNumToRender={4}
                    renderItem={this.renderCategory}
                    style={styles.analist}
                    ListFooterComponent={this.footerComponent}
                    ListHeaderComponent={this.headerComponent}
                />
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F4",
    },
    flex: {
        flex: 1,
        paddingTop: 10,
    },
    headerContainer: {
        justifyContent: "space-between",
        paddingHorizontal: 40,
        paddingBottom: 40,
        paddingTop: 10,
        backgroundColor: "#F4F4F4",
        overflow: "hidden"
    },
    headerContainerText: { flexDirection: "column", flex: 1, alignSelf: "center", },
    imageContainerHeader: {
        padding: 2,
        height: 100,
        width: "100%",
        overflow: "hidden",
    },

    textContainer: {
        top: 10
    },
    imageStyle: {
        height: "100%"
    },
    katagoriHeader: {
        flexDirection: "row", justifyContent: "center",
        paddingVertical: 10, paddingHorizontal: 5,
    },
    imageStyleFooter: {
        height: 75,
        width: "80%",
        overflow: "hidden",
    },
    titleStyle: {
        color: '#000000',
        fontSize: 20,
        padding: 5,
        textAlign: "center",
        fontWeight: 'bold'
    },
    subtitleStyle: {
        textAlign: "center",
        color: "#000000",
        opacity: 0.5,
        fontWeight: 'bold',
        paddingBottom: 5,
        fontSize: 14,
    },
    containerSubTextStyle: {
        fontSize: 14,
        textAlign: "center",
    },

    styleTumunuGoster: {
        fontSize: 12,
        textAlign: "center",
        color: "#afafaf",
        borderBottomColor: "#afafaf",
    },
    styleLine: {
        backgroundColor: "#c1c1c1",
        alignSelf: "center",
        textAlign: "center",
        width: 100,
        top: 3,
        height: 2,
    },
    analist: {
        height: 'auto'
    },

    itemlist: {
        marginTop: -10,
        height: 'auto'
    },
    fooderContainer: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 20,
        padding: 10,
        backgroundColor: "#fff"
    },
});