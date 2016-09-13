import * as bingTranslate from 'bing-translate';
import config from './config';

const bt = bingTranslate.init({client_id: config.BING_CLIENT_ID, client_secret: config.BING_CLIENT_SECRET});

export const bingTranslatorAPI = {
    translate(text, language) {
        return new Promise((resolve, reject) => {
            bt.translate(text, 'en', language, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.translated_text);
            });
        });
    }
};
