import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class AlternatePriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes alternate.de for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.alternate.de';
        const $ = await this.requestWebsite(`${baseUrl}/listing.xhtml?q=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = this.collectLinks($, '.productPicture', 'alt');
        let links: any[] = this.collectLinks($, '.productBox', 'href');
        let thumbnails: any[] = [];
        let prices: any[] = this.collectText($, '.price');
        let ratings: any[] = [];

        $('.productPicture').each((_, value) => {
            thumbnails.push(baseUrl + $(value).data('src'));
        });

        $('.ratingCount').each((_, value) => {
            $(value).text() ? ratings.push($(value).text().trim()) : ratings.push('(0)');
        });

        let result: ISearchResult[] = [];

        const ratingsFiltered = ratings.map((rating: string) => Number(rating.replace('(', '').replace(')', '')));
        const pricesFilterd = prices.map((price: string) => Number(price.split('€')[1].trim().replace(',', '.')));

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
