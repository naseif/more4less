import { IFetchOptions, SearchEngineBase, SearchResult } from '..';
import { ISearchResult } from '../../Interfaces';
const { URLSearchParams } = require('url');

export class BuecherPriceSearchEngine extends SearchEngineBase {
    /**
     * Scrapes bücher.de for products based on your search query
     * @param string searchTerm
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        const postUrl = 'https://www.buecher.de/ni/search_search/quick_search/receiver_object/shop_search_quicksearch/';

        const params = new URLSearchParams();
        params.append('form[q]:', searchTerm);

        const options: IFetchOptions = {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 Edg/96.0.1054.43'
            },
            method: 'post',
            body: params
        };

        const $ = await this.requestWebsite(postUrl, options);

        let titles: any[] = this.collectText($, '.title');
        let prices: any[] = this.collectText($, '.price');
        let ratings: any[] = [];
        let thumbnails: any[] = [];
        let links: any[] = this.collectOnAttributeAndElement($, '.title', 'a', 'href');

        $('.cover')
            .find('img')
            .each((_, value) => {
                if (!$(value).attr('src')?.startsWith('data')) {
                    thumbnails.push($(value).attr('src'));
                }
            });

        const pricesFiltered = this.splitAndReplaceValue(prices, '&', 0, ',', '.');

        const result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(
                new SearchResult(
                    this.constructor.name,
                    links[index],
                    title,
                    ratings[index],
                    pricesFiltered[index],
                    thumbnails[index]
                )
            );
        });

        return result;
    }
}
