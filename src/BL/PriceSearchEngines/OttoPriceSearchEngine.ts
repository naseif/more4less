import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class OttoPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes otto.de for products based on your search query
     * @param searchTerm
     * @returns
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.otto.de';

        const $ = await this.requestWebsite(baseUrl + '/suche/', searchTerm);

        let titles: any[] = this.collectText($, '.find_tile__name');
        let prices: any[] = [];
        let ratings: any[] = this.collectText($, '.find_tile__ratingNumber');
        let links: any[] = [];
        let thumbnails: any[] = [];

        $('.find_tile__priceWrapper').each((_: number, value: any) => {
            if ($(value).find('.find_tile__priceReduced').length > 0) {
                prices.push($(value).find('.find_tile__priceReduced').text().trim());
            } else {
                prices.push($(value).find('.find_tile__priceValue').text().trim());
            }
        });

        $('.find_tile__productImageLink').each((_: number, value: any) => {
            links.push(baseUrl + $(value).attr('href'));
        });

        $('.find_tile__productImageCarousel')
            .find('img')
            .each((_: number, value: any) => {
                thumbnails.push($(value).attr('src'));
            });

        const ratingsFiltered = ratings.map((rating: string) => Number(rating.replace('(', '').replace(')', '')));
        const pricesFilterd = prices.map((price: string) => Number(price.split('€')[1].trim().replace(',', '.')));

        let result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratingsFiltered[index],
                    pricesFilterd[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
