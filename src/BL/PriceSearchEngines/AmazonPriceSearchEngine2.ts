import { SearchEngineBase } from './SearchEngineBase';
import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';

export class AmazonPriceSearchEngine2 extends SearchEngineBase {
    /**
     * Scrapes amazon for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.amazon.de';
        const $ = await this.requestWebsite(`${baseUrl}/s?k=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = [];
        let prices: any[] = this.collectText($, '.a-price-whole');
        let links: any[] = [];
        let ratings: any[] = [];
        let thumbnails: any[] = this.collectLinks($, '.s-image', 'src');

        $('.s-title-instructions-style')
            .find('h2 > a')
            .each((_: number, value: any) => {
                titles.push($(value).text().trim());
            });

        $('span[data-component-type="s-product-image"]')
            .find('a')
            .each((_, value) => {
                links.push(baseUrl + $(value).attr('href'));
            });

        $('.a-icon-alt').each((_, value) => {
            if ($(value).text() && !$(value).text().includes('mehr')) {
                ratings.push($(value).text().trim());
            }
        });

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
