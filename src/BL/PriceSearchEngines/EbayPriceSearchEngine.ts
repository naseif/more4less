import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';
const cheerio = require('cheerio');

export class EbayPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes eBay for products based on your search query
     * @param {string} searchTerm
     * @returns {ISearchResult[]}
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.ebay.de';
        const $ = await this.requestWebsite(baseUrl + '/sch/i.html?_from=R40&_nkw=', searchTerm);

        const divs = $('.s-item__info'); // an object containing info of each product
        const imageSection = $('.s-item__image-section');

        let titles: any[] = [];
        let links: any[] = [];
        let prices: any[] = [];
        let ratings: any[] = [];
        let thumbnails: any[] = [];

        $('.s-item__link').each(function (index, value) {
            links.push(value.attribs.href);
        });

        const deleteFirstLink = links.splice(0, 1); // the first link we get is not a valid one and it messes up the order of the links

        for (let i = 0; i < divs.length; i++) {
            const thisResult = divs[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });

            if ($detail('.s-item__title').text() && $detail('.s-item__price').text()) {
                titles.push($detail('.s-item__title').text().trim());
                ratings.push($detail('.x-star-rating').text().trim());
                prices.push($detail('.s-item__price').text().trim());
            }
        }

        for (let i = 0; i < imageSection.length; i++) {
            const thisResult = imageSection[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });

            thumbnails.push($detail('.s-item__image-img').attr('src'));
        }
        const pricesFilterd = prices.map((price: string) => Number(price.split('EUR')[1].trim().replace(',', '.')));

        let result: ISearchResult[] = [];

        titles.forEach((title: string, index: number) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    this.grabFirstPartAsNumber(ratings[index]),
                    pricesFilterd[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
