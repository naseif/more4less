import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';
const cheerio = require('cheerio');

export class MediaMarktPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes MediaMarkt for products based on your search query
     * @param {string} searchTerm
     * @returns {ISearchResult[]}
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.mediamarkt.de';
        const $ = await this.requestWebsite(baseUrl + '/de/search.html?query=', searchTerm);
        const resultDivs = $('div[data-test=mms-search-srp-productlist-item]');

        let titles: any[] = [];
        let links: any[] = [];
        let prices: any[] = [];
        let ratings: any[] = [];
        let thumbnails: any[] = [];

        for (let i = 0; i < resultDivs.length; i++) {
            const thisResult = resultDivs[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });
            titles.push($detail('h2[data-test=product-title]').text());
            ratings.push($detail('div[data-test=mms-customer-rating]').text());
            prices.push($detail('div[data-test=mms-unbranded-price]').text());
            links.push(baseUrl + $detail('a[data-test=mms-router-link]').attr('href'));
            thumbnails.push($detail('div[data-test=product-image]').text());
        }

        let result: ISearchResult[] = [];

        titles.forEach((title: string, index: number) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratings[index],
                    prices[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
