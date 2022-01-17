import { IOutput, ISearchResult } from '../../Interfaces/index';

export class ConsoleOutput implements IOutput {

    /**
     * Outputs the searched data in the console
     * @param {ISearchResult[]} searchResults 
     */

    outputData(searchResults: ISearchResult[]): void {
        searchResults.forEach((searchResult) => {
            console.log(`${searchResult.name} - ${searchResult.price}`);
        });
    }
}
