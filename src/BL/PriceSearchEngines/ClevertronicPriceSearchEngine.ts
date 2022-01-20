import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class ClevertronicPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes clevertronic for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.clevertronic.de';
        const $ = await this.requestWebsite(`${baseUrl}/products?s=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = this.collectText($, '.product_box_name');
        let ratings: any[] = [];
        let thumbnails: any[] = [];
        let prices: any[] = this.collectText($, '.product_box_price');
        let links: any[] = this.collectLinks($, '.js_target_link', 'href', baseUrl);

        $('.product_box_img')
            .find('img')
            .each((_, value) => {
                if ($(value).data('pagespeed-high-res-src')) {
                    thumbnails.push(baseUrl + $(value).data('pagespeed-high-res-src'));
                } else {
                    thumbnails.push(baseUrl + $(value).data('pagespeed-lazy-src'));
                }
            });
        const pricesFilterd = this.splitAndReplaceValue(prices, ' ', 1, ',', '.');

        let result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratings[index],
                    pricesFilterd[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
