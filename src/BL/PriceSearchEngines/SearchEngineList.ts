import { ISearchEngine, ISearchResult } from '../../Interfaces/index';

export class SearchEngineList implements ISearchEngine {
    /**
     * array of all search engines
     */
    searchEngines: ISearchEngine[];

    /**
     * array of the search engines you wish to iterate through
     * @param ISearchEngine[] searchEngines
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

        for (const engine of this.searchEngines) {
            const temp = await engine.search(searchTerm);

            for (const searchResult of temp) {
                result.push(searchResult);
            }
        }

        return result;
    }
}
