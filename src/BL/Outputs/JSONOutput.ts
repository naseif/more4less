import { writeFileSync } from 'fs';
import { IOutput, ISearchResult } from '../../Interfaces/index';

export class JSONOutput implements IOutput {

    /**
     * the path where you wish to save the file
     */
    filePath: string;

    /**
     * 
     * @param {string} filePath 
     */
    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * outputs the data into a json file
     * @param {ISearchResult[]} searchResults 
     */
    outputData(searchResults: ISearchResult[]): void {
        writeFileSync(this.filePath, JSON.stringify(searchResults), 'utf8');
    }
}
