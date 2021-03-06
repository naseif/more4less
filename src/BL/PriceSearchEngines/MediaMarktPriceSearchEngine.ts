import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';
const cheerio = require('cheerio');

export class MediaMarktPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes MediaMarkt for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.mediamarkt.de';
        const $ = await this.requestWebsite(`${baseUrl}/de/search.html?query=${encodeURIComponent(searchTerm)}`);
        const resultDivs = $('div[data-test=mms-search-srp-productlist-item]');

        let titles: string[] = [];
        let links: string[] = [];
        let prices: number[] = [];
        let ratings: string[] = [];
        let thumbnails: string[] = [];

        $('.ScreenreaderTextSpan-sc-11hj9ix-0').each((_, value) => {
            if (!$(value).text().startsWith('UVP')) {
                prices.push(Number($(value).text().trim()));
            }
        });

        for (let i = 0; i < resultDivs.length; i++) {
            const thisResult = resultDivs[i];
            const htmlOfThisDiv = $.html(thisResult);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true
            });
            titles.push($detail('h2[data-test=product-title]').text());
            ratings.push($detail('div[data-test=mms-customer-rating]').text());
            links.push(baseUrl + $detail('a[data-test=mms-router-link]').attr('href'));
        }

        const ratingsFiltered = ratings.map((rating: string) => Number(rating.replace('(', '').replace(')', '')));
        let result: ISearchResult[] = [];

        titles.forEach((title: string, index: number) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratingsFiltered[index],
                    prices[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
