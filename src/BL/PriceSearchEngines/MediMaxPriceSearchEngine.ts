import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class MediMaxPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes MediMax for products based on your search query
     * @param string searchTerm
     * @returns ISearchResult[]
     */
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.medimax.de';
        const $ = await this.requestWebsite(`${baseUrl}/search/?text=${encodeURIComponent(searchTerm)}`);

        let titles: string[] = this.collectText($, '.cmsproductlist-name');
        let links: string[] = this.collectLinks($, '.cmsproduct-list-image-link', 'href', baseUrl);
        let prices: string[] = this.collectText($, '.cmsproductlist-price');
        let thumbnail: string[] = this.collectOnAttributeAndElement($, '.cmsproduct-list-image-link', 'img', 'src');
        let ratings: number[] = [];

        const pricesFiltered = this.splitAndReplaceValue(prices, ',', 0, '.', '.');

        const result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratings[index],
                    pricesFiltered[index],
                    thumbnail[index]
                )
            );
        });

        return result;
    }
}
