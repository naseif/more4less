import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class MindfactoryPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes Mindfactory for products based on your search query
     * @param string searchTerm
     * @returns
     */
    async search(searchTerm: string): Promise<any> {
        const baseUrl = 'https://www.mindfactory.de';
        const $ = await this.requestWebsite(
            `${baseUrl}/search_result.php?search_query=${encodeURIComponent(searchTerm)}`
        );

        const titles: any[] = this.collectText($, '.pname');
        const prices: any[] = this.collectText($, '.pprice');
        const ratings: any[] = [];
        const thumbnails: any[] = [];
        const links: any[] = this.collectOnAttributeAndElement($, '.pbuy', 'a', 'href');

        $('.pimg')
            .find('img')
            .each((_, value) => {
                thumbnails.push($(value).data('src'));
            });

        const pricesFiltered = prices.map((price: string): any => {
            let getPrice = price.split(';')[2];
            if (getPrice.includes('*')) {
                const getIndex = getPrice.indexOf('*');
                getPrice = getPrice.slice(0, getIndex);
            }

            if (getPrice.includes('-')) {
                const getIndex = getPrice.indexOf('-');
                getPrice = getPrice.slice(0, getIndex);
            }

            return Number(getPrice.replace(',', '.'));
        });

        const result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            return result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    0,
                    pricesFiltered[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
