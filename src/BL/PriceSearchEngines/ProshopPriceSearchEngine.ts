import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class ProshopPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes Proshop.de for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.proshop.de';
        const $ = await this.requestWebsite(baseUrl + '/?s=', searchTerm);

        let titles: any[] = this.collectText($, 'h2[product-display-name=""]');
        let prices: any[] = this.collectText($, '.site-currency-lg');
        let links: any[] = [];
        let thumbnails: any[] = [];

        $('li[product=""]')
            .find('a')
            .each((_: number, value: any) => {
                if ($(value).attr('href')?.startsWith('/') && !$(value).attr('href')?.includes('Demo')) {
                    links.push($(value).attr('href'));
                }
            });

        $('li[product=""]')
            .find('a > img')
            .each((_: number, value: any) => {
                if ($(value).attr('src')) {
                    thumbnails.push($(value).attr('src'));
                } else {
                    thumbnails.push($(value).data('src'));
                }
            });

        let result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    baseUrl + links.filter(this.onlyUnique)[index],
                    title,
                    0,
                    prices[index],
                    baseUrl + thumbnails[index]
                )
            );
        });

        return result;
    }
}
