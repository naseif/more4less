import { ISearchResult } from "./ISearchResult"

/**
 * We scrape a big bunch of different web shops and maybe other systems
 * that give us prices!
 */

export interface ISearchEngine {
    search(searchTerm: string): Promise<ISearchResult[]>;
}
