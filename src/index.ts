/// <reference path="../typings/index.d.ts" />
/// <reference path="../bingTranslatorTypings.d.ts" />
import * as express from 'express';
import * as cors from 'cors';
import bodyParser = require('body-parser');
import { autoCodesAPI } from './autoCodesAPI';
const config = { port: process.env.PORT || 3000 };

if (!process.env.BING_CLIENT_ID) {
    throw new Error('You should set BING_CLIENT_ID environment variable');
}

if (!process.env.BING_CLIENT_SECRET) {
    throw new Error('You should set BING_CLIENT_SECRET environment variable');
}

const app: express.Application = express();

app.use(bodyParser.json({limit: "7mb"}));
app.use(cors());

app.get('/:carBrand/:code', async (req: express.Request, res: express.Response) => {
    const requestParams: { carBrand?: string, code?: string } = req.params;
    const requestQuerys: { language?: string } = req.query;
    try {
        const codeInfo = await autoCodesAPI.getCodeInfo({ code: requestParams.code, carBrand: requestParams.carBrand, language: requestQuerys.language });
        res.json(codeInfo);
    } catch (e) {
        switch (e.error) {
            case 'CODE_NOT_FOUND':
                return res.status(404).json({message: e.error});
            case 'ERROR_GETTING_RESPONSE':
            default:
                console.error(e);
                return res.status(500).json({message: 'INTERNAL_SERVER_ERROR'});
        }
    }
});

app.get('/carbrands', async (req: express.Request, res: express.Response) => {
    try {
        const carBrands = await autoCodesAPI.getCarBrands();
        res.json(carBrands);
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: 'INTERNAL_SERVER_ERROR'});
    }
});

app.listen(config.port, () => {
    console.info(`Listening on port: ${config.port}`);
});

export { app };
