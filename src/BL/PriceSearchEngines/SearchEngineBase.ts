import { ISearchEngine, ISearchResult } from '../../Interfaces';
const fetch = require('node-fetch');
import * as cheerio from 'cheerio';

export abstract class SearchEngineBase implements ISearchEngine {
    abstract search(searchTerm: string): Promise<ISearchResult[]>;

    protected async requestWebsite(baseUrl: string, searchQuery: string) {
        const searchQueryEncoded = encodeURIComponent(searchQuery);
        const req = await fetch(`${baseUrl}${searchQueryEncoded}`, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; U; Android 2.2; de-de; HTC Magic Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
            }
        });
        const res = await req.text();

        const $ = cheerio.load(res, {
            xmlMode: true
        });

        return $;
    }

    protected collectText($: any, selector: string) {
        let result: any[] = [];

        $(selector).each(function (index: number, value: any) {
            if ($(value).text()) {
                result.push($(value).text().trim());
            }
        });

        return result;
    }

    protected collectLinks($: any, selector: string, baseUrl: string) {
        let result: any[] = [];

        $(selector).each(function (index: number, value: any) {
            result.push(baseUrl + $(value).attr('href').trim());
        });

        return result;
    }

    protected grabFirstPartAsNumber(value: string): any {
        if (value) return Number(value.split(/\s/)[0].replace(",", "."));
    }
}
