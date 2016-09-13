declare interface Static {
    translate(textToTranslate: string, languageFrom: string, languageTo: string, callback: Function);
}

declare module 'bing-translate' {
    export function init(options: { client_id: string, client_secret: string }): Static;
}
