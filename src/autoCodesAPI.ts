import * as cheerio from 'cheerio';
import * as axios from 'axios';
import config from './config';
import { bingTranslatorAPI } from './bingTranslatorAPI';

export interface CodeInfoRequest {
    code: string;
    carBrand?: string;
    language?: string;
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const getSections = ($page: cheerio.Static): Object => {
    const sections = {};
    $page('.desc').each((index, element) => {
        const $element = $page(element);
        sections[$element.text()] = $element.next().text().trim();
    });
    return sections;
};

export const autoCodesAPI = {
    async getCodeInfo(options: CodeInfoRequest) {
        if (!options.language) {
            options.language = 'en';
        }
        if (!options.code) {
            throw { error: 'ERROR_NO_CODE' };
        }

        const resultsListResponse = await axios.get<string>(`${config.autoCarCodesUrl}/search_codes.php?q=${options.code}`);
        if (resultsListResponse.status !== 200) {
            throw { error: 'ERROR_GETTING_RESPONSE' };
        }

        const $resultsListPage = cheerio.load(resultsListResponse.data);
        if ($resultsListPage('.gs-no-results-result').length) {
            throw { error: 'CODE_NOT_FOUND' };
        }

        const $resultsList = $resultsListPage('#scroller ul li a');
        let codeDetailUrl: string = null;
        $resultsList.each((index, element) => {
            const codeArray = element.lastChild.nodeValue.trim().split(' ');
            if (!options.carBrand && codeArray[0] === options.code.toUpperCase() && !codeArray[1]) {
                const attribs: { href?: string } = element.attribs;
                codeDetailUrl = attribs.href;
                return false;
            }
            if (codeArray[0] === options.code.toUpperCase() && options.carBrand.toLocaleUpperCase() === codeArray[1]) {
                const attribs: { href?: string } = element.attribs;
                codeDetailUrl = attribs.href;
                return false;
            }
        });

        if (codeDetailUrl === null) {
            throw { error: 'CODE_NOT_FOUND' };
        }

        const codeDetailResult = await axios.get<string>(codeDetailUrl);
        if (codeDetailResult.status !== 200) {
            throw { error: 'ERROR_GETTING_RESPONSE' };
        }

        const $codeDetailPage = cheerio.load(codeDetailResult.data);
        const sections = getSections($codeDetailPage);
        const codeInfo = {
            possiblesCauses: sections['Possible causes'].replace(/\t\n\t What does this mean?/gi, ''),
            whenCodeDetected: sections['When is the code detected?'],
            possibleSymptoms: sections['Possible symptoms'],
            description: sections[`${options.code.toLocaleUpperCase()} ${options.carBrand ? capitalize(options.carBrand) + ' ' : ''}Description`]
        };
        if (options.language !== 'en' && config.BING_CLIENT_SECRET && config.BING_CLIENT_ID) {
            return {
                possiblesCauses: await bingTranslatorAPI.translate(codeInfo.possiblesCauses, options.language),
                whenCodeDetected: await bingTranslatorAPI.translate(codeInfo.whenCodeDetected, options.language),
                possibleSymptoms: await bingTranslatorAPI.translate(codeInfo.possibleSymptoms, options.language),
                description: await bingTranslatorAPI.translate(codeInfo.description, options.language)
            };
        } else {
            return codeInfo;
        }
    },
    async getCarBrands(): Promise<string[]> {
        const mainPageResponse = await axios.get<string>(config.autoCarCodesUrl);
        const $mainPage = cheerio.load(mainPageResponse.data);

        const $brandsElements = $mainPage('table').eq(0).find('.index-list');
        const carBrands = [];

        $brandsElements.each((index, element) => {
            const $element = $mainPage(element);
            if ($element.text()) {
                carBrands.push($element.text());
            }
        });

        return carBrands;
    }
};
