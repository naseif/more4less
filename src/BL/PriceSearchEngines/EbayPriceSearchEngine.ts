import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';
const cheerio = require('cheerio');

export class EbayPriceSearchEngine extends SearchEngineBase {
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

        for (let i = 0; i < divs.length; i++) {
            const thisResult = divs[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });
            if ($detail('.s-item__title').text() && $detail('.s-item__price').text()) {
                titles.push($detail('.s-item__title').text().trim());
                ratings.push($detail('.x-star-rating').text().trim());
                links.push($detail('s-item__link').attr('href'));
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
