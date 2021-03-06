import Crypto from 'woo-crypto';
import { getUTCTime } from 'woo-utilities/date';
import opts from '../../config';
import Axios from "axios";

const post = async (baseURL, url, headers, data) => {
    var instance = Axios.create({
        baseURL: baseURL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', ...headers }
    });
    var responseJson = await instance.post(url, data);

    return responseJson.data
}

const baseRequest = async (url, type, obj = {}) => {
    try {
        var token = (Crypto.encrypt(JSON.stringify({ expire: getUTCTime(opts.tokenTimeout).toString(), type }), opts.publicKey, opts.privateKey));
        var result = await post(opts.wooServerUrl, url, {
            public: opts.publicKey,
            token
        }, {
            ...obj
        });

        return result;
    } catch (error) {
        return { status: false };
    }
}

export const getItemList = async ({ lang, } = { lang: null }) => {
    var result = await baseRequest('/content/export', 'content.export', {
        tags: [lang],
        tableName: "About"
    });
    var list = result.data || [];
    return list[0].content.length ? list[0].content : [];
}
