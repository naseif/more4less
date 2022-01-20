import { SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';

export class CyberportPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = 'https://www.cyberport.de';
        const $ = await this.requestWebsite(`${baseUrl}/tools/search-results.html?q=${encodeURIComponent(searchTerm)}`);

        const result: ISearchResult[] = [];
        const titles: any[] = this.collectText($, '.productTitleName');
        const prices: any[] = this.collectText($, '.delivery-price');
        const ratings: any[] = this.collectText($, '.stars');
        const thumbnails: any[] = [];
        const links: any[] = this.collectOnAttributeAndElement($, '.productImage', 'a', 'href', baseUrl);

        $('.productImage')
            .find('img')
            .each((_, value) => {
                if ($(value).attr('src')?.startsWith('//')) {
                    thumbnails.push($(value).attr('src')?.replace('//', 'https://'));
                }
            });

        const pricesFilterd = this.splitAndReplaceValue(prices, '€', 1, ',', '.');

        titles.forEach((title: string, index: number) => {
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
