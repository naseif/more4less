import { SearchEngineBase } from './SearchEngineBase';
import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
const cheerio = require('cheerio');

export class AmazonPriceSearchEngine2 extends SearchEngineBase {
    /**
     * Scrapes amazon for products based on your search query
     * @param {string} searchTerm
     * @returns {ISearchResult[]}
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.amazon.de';
        const $ = await this.requestWebsite(`${baseUrl}/s?k=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = [];
        let prices: any[] = [];
        let links: any[] = [];
        let ratings: any[] = [];
        let thumbnails: any[] = [];

        let searchResultDivs = $('.s-result-item');

        for (let i = 0; i < searchResultDivs.length; i++) {
            const thisDiv = searchResultDivs[i];
            const htmlOfThisDiv = $.html(thisDiv);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });
            if ($detail('.s-title-instructions-style').text() && $detail('.a-price-whole').text()) {
                titles.push($detail('.s-title-instructions-style').text().trim());
                prices.push($detail('.a-price-whole').text().trim());
                links.push(baseUrl + $detail(".a-link-normal[title='product-image']").attr('href'));
                ratings.push($detail('.a-icon-alt').text().trim());
                thumbnails.push($detail('.s-image').attr('src'));
            }
        }

        let result: ISearchResult[] = [];
        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    this.grabFirstPartAsNumber(ratings[index]),
                    this.grabFirstPartAsNumber(prices[index]),
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
