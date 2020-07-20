import opts from './config';
import AboutPage from './src/components/AboutPage';
import * as langStore from './src/store/language';

const logolocal = require('./src/assets/woomedyalogo.png')
export const config = async ({ wooServerUrl, publicKey, privateKey, locales, logo, lang, }) => {
    opts.wooServerUrl = wooServerUrl;
    opts.publicKey = publicKey;
    opts.privateKey = privateKey;
    opts.logo = logo || logolocal;

    opts.lang = lang;
    langStore.setLanguage(lang);

    opts.locales = locales || {};

    if (tokenTimeout != null)
        opts.tokenTimeout = tokenTimeout;

}

export const setLang = (lang) => {
    opts.lang = lang;
    langStore.setLanguage(lang);
}

export default AboutPage;