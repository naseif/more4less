import { ISearchResult } from './ISearchResult';

/**
 * the output can be in different formats.
 */
export interface IOutput {
    outputData(searchResults: ISearchResult[]): void;
}
