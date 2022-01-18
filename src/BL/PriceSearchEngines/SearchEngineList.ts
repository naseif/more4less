import { ISearchEngine, ISearchResult } from '../../Interfaces/index';

export class SearchEngineList implements ISearchEngine {
    /**
     * array of all search engines
     */
    searchEngines: ISearchEngine[];

    /**
     * array of the search engines you wish to iterate through
     * @param {ISearchEngine[]} searchEngines
     */

    constructor(searchEngines: ISearchEngine[]) {
        this.searchEngines = searchEngines;
    }

    /**
     * searches for the product through the search engines you defined
     * @param {string} searchTerm query of the product name
     * @returns
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        let result: ISearchResult[] = [];

        for (let i = 0; i < this.searchEngines.length; i++) {
            const temp = await this.searchEngines[i].search(searchTerm);

            temp.forEach((element) => {
                result.push(element);
            });
        }

        return result;
    }
}
