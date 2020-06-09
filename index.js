import opts from './config';
import AboutPage from './src/components/AboutPage';
import * as langStore from './src/store/language';

export const config = async ({ wooServerUrl, publicKey, privateKey, tokenTimeout, locales, color, logo, lang, renderNoText, renderItem }) => {
    opts.wooServerUrl = wooServerUrl;
    opts.publicKey = publicKey;
    opts.privateKey = privateKey;
    opts.logo = logo;

    opts.lang = lang;
    langStore.setLanguage(lang);

    opts.locales = locales || {};
    opts.color = color || opts.color;
    opts.renderNoText = renderNoText || null;
    opts.renderItem = renderItem || null;

    if (tokenTimeout != null)
        opts.tokenTimeout = tokenTimeout;

}

export const setLang = (lang) => {
    opts.lang = lang;
    langStore.setLanguage(lang);
}

export default AboutPage;