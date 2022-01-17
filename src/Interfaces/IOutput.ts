import { ISearchResult } from './ISearchResult';

/**
 * We have different output formats
 */
export interface IOutput {
    outputData(searchResults: ISearchResult[]): void;
}
