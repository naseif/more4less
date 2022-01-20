import { index } from 'cheerio/lib/api/traversing';
import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class KauflandPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes Kaufland for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.kaufland.de';
        const $ = await this.requestWebsite(`${baseUrl}/item/search/?search_value=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = this.collectText($, '.product__title');
        let prices: any[] = this.collectText($, '.price');
        let ratings: any[] = this.collectText($, '.product-rating__count');
        let links: any[] = this.collectOnAttributeAndElement($, '.results--grid', 'a', 'href', baseUrl);
        let thumbnails: any[] = this.collectOnAttributeAndElement($, '.product__image-container', 'img', 'src');

        // Remove Ads from arrays

        this.spliceArray(titles, 0, 2);
        this.spliceArray(titles, titles.length - 2, 2);
        this.spliceArray(prices, 0, 2);
        this.spliceArray(prices, prices.length - 2, 2);
        this.spliceArray(thumbnails, 0, 2);
        this.spliceArray(thumbnails, thumbnails.length - 2, 2);

        const pricesFilterd = this.splitAndReplaceValue(prices, '€', 0, ',', '.');
        const converRatingsToNumber = ratings.map((rating: string) => Number(rating));

        let result: ISearchResult[] = [];

        titles.forEach((title: string, index: number) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    converRatingsToNumber[index],
                    pricesFilterd[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
