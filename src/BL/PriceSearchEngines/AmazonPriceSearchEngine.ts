import { SearchResult } from '..';
import { ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';

export class AmazonPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.amazon.de';
        const $ = await this.requestWebsite(`${baseUrl}/s?k=`, searchTerm);

        let titles: string[] = this.collectText($, '.s-title-instructions-style');
        let prices: string[] = this.collectText($, '.a-price-whole');
        let links: string[] = this.collectLinks($, ".a-link-normal[title='product-image']", baseUrl);
        let ratings: string[] = this.collectText($, '.a-icon-alt');
        let thumbnails: any[] = [];

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
