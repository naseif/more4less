import { IOutput, ISearchResult } from "../../Interfaces/index"

export class ConsoleOutput implements IOutput {
    outputData(searchResults: ISearchResult[]): void {

        searchResults.forEach(searchResult => {
            console.log(`${searchResult.name} ${searchResult.price}`);
        });

    }
}