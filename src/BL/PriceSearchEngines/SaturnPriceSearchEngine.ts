import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';
const cheerio = require('cheerio');

export class SaturnPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.saturn.de';
        const $ = await this.requestWebsite(baseUrl + '/de/search.html?query=', searchTerm);
        const resultDivs = $("div[data-test=mms-search-srp-productlist-item]")

        let titles: any[] = [];
        let links: any[] = [];
        let prices: any[] = [];
        let ratings: any[] = [];

        for (let i = 0; i < resultDivs.length; i++) {
            const thisResult = resultDivs[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });
            titles.push($detail("h2[data-test=product-title]").text());
            ratings.push($detail("div[data-test=mms-customer-rating]").text());
            prices.push($detail("div[data-test=mms-unbranded-price]").text());
            links.push(baseUrl + $detail("a[data-test=mms-router-link]").attr('href'));
        }

        let result: ISearchResult[] = [];

        titles.forEach((title: string, index: number) => {
            result.push(new SearchResult(this.constructor.name, links[index], title, ratings[index], prices[index]));
        });

        return result;
    }
}
