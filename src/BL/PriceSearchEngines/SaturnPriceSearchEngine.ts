import { ISearchResult } from "../../Interfaces/index";
import { SearchEngineBase } from "./SearchEngineBase"

class SaturnPriceSearchEngine extends SearchEngineBase {
    search(searchTerm: string): Promise<ISearchResult[]> {
        throw new Error("Method not implemented.");
    }
}