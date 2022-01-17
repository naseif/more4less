import { ISearchEngine, ISearchResult } from '../../Interfaces/index';
import { SearchEngineBase } from './SearchEngineBase';

export class SearchEngineList implements ISearchEngine {
    searchEngines: ISearchEngine[];

    constructor(searchEngines: ISearchEngine[]) {
        this.searchEngines = searchEngines;
    }

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
