import opts from './config';
import AboutPage from './src/components/AboutPage';
import * as langStore from './src/store/language';

const logolocal = require('./src/assets/woomedyalogo.png')
export const config = async ({ wooServerUrl, publicKey, privateKey, locales, logo, lang, applicationId, deviceId }) => {
    opts.wooServerUrl = wooServerUrl;
    opts.publicKey = publicKey;
    opts.privateKey = privateKey;
    opts.logo = logo || logolocal;
    opts.deviceId = deviceId || opts.deviceId;

    opts.lang = lang;
    langStore.setLanguage(lang);
    opts.locales = locales || {};
    opts.applicationId = applicationId;
}

export const setLang = (lang) => {
    opts.lang = lang;
    langStore.setLanguage(lang);
}

export default AboutPage;