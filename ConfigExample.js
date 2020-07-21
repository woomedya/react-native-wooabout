import { config, setLang } from 'react-native-wooabout';
import env from '../env';
import * as languageStore from '../store/Language';
// TODO: çoklu dil 
import i18n from '../locales';
const logo = require('../../assets/logo.png');
export default async () => {
    // TODO: çoklu dil 
    var i18ns = i18n();
    config({
        wooServerUrl: env.wooabout.serverUrl,
        publicKey: env.wooabout.publicKey,
        privateKey: env.wooabout.privateKey,
        logo,
        lang: languageStore.getLanguage(),
        title: i18ns.appTitle,
        applicationId: env.applicationId
    });

    // TODO: çoklu dil varsa config ayarlarından sonra veritabanından okunup dil setLang yapılmalı.
    // TODO: eğer çoklu dil varsa bu şekilde değişimi wooabout'a bildirilmeli.
    languageStore.default.addListener(languageStore.LANG, () => {
        var i18ns = i18n();
        var title = i18ns.appTitle;
        setLang(languageStore.getLanguage(), title);
    });
};