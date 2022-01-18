import { ISearchEngine, ISearchResult } from '../../Interfaces';
const fetch = require('node-fetch');
import * as cheerio from 'cheerio';

export abstract class SearchEngineBase implements ISearchEngine {
    abstract search(searchTerm: string): Promise<ISearchResult[]>;

    /**
     *
     * @param {string} baseUrl baseUrl of the site to fetch
     * @param {string} searchQuery string of the product you wish to search for
     * @returns {Promise<cheerio.CheerioAPI>}
     */

    protected async requestWebsite(baseUrl: string, searchQuery: string) {
        const searchQueryEncoded = encodeURIComponent(searchQuery);
        const req = await fetch(`${baseUrl}${searchQueryEncoded}`, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edge/12.246'
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

        $(selector).each(function (_: number, value: any) {
            if ($(value).text()) {
                result.push($(value).text().trim());
            }
        });

        return result;
    }

    protected collectLinks($: any, selector: string, attr: string, baseUrl?: string) {
        let result: any[] = [];

        $(selector).each(function (_: number, value: any) {
            baseUrl ? result.push(baseUrl + $(value).attr(attr).trim()) : result.push($(value).attr(attr).trim());
        });

        return result;
    }

    protected grabFirstPartAsNumber(value: string): any {
        if (value) return Number(value.split(/\s/)[0].replace(',', '.'));
    }

    protected onlyUnique(value: any, index: any, self: string | any[]) {
        return self.indexOf(value) === index;
    }
}
