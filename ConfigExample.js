import { config, setLang } from 'react-native-wooabout';
import env from '../env';
import * as languageStore from '../store/Language';

const logo = require('../../assets/logo.png');

export default async () => {
    config({
        wooServerUrl: env.wooabout.serverUrl,
        publicKey: env.wooabout.publicKey,
        privateKey: env.wooabout.privateKey,
        logo,
        lang: languageStore.getLanguage(),
    });

    // TODO: çoklu dil varsa config ayarlarından sonra veritabanından okunup dil setLang yapılmalı.
    // TODO: eğer çoklu dil varsa bu şekilde değişimi woosocial'a bildirilmeli.
    // languageStore.default.addListener(languageStore.LANG, () => {
    //     setLang(languageStore.getLanguage());
    // });
};