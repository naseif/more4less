import { IPriceSearchEngine, ISearchResult } from "../../Interfaces/index";
import { SearchEngineBase } from "./SearchEngineBase";

export class SearchEngineList extends SearchEngineBase {
    searchEngines: IPriceSearchEngine[];

    constructor(searchEngines : IPriceSearchEngine[]) {
        super();

        this.searchEngines = searchEngines;
    }

    async search(searchTerm: string): Promise<ISearchResult[]> {
        let result : ISearchResult[] = [];

        for(let i = 0; i < this.searchEngines.length; i++) {
            const temp = await this.searchEngines[i].search(searchTerm);

            temp.forEach(element => {
                result.push(element);
            });
        }

        return result;
    }

}