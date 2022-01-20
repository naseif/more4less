import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class MediMaxPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.medimax.de';
        const $ = await this.requestWebsite(`${baseUrl}/search/?text=${encodeURIComponent(searchTerm)}`);

        let titles: any[] = this.collectText($, '.cmsproductlist-name');
        let links: any[] = this.collectLinks($, '.cmsproduct-list-image-link', 'href', baseUrl);
        let prices: any[] = this.collectText($, '.cmsproductlist-price');
        let thumbnail: any[] = this.collectOnAttributeAndElement($, '.cmsproduct-list-image-link', 'img', 'src');
        let ratings: any[] = [];

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
