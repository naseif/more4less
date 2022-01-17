import { writeFileSync } from 'fs';
import { IOutput, ISearchResult } from '../../Interfaces/index';

export class JSONOutput implements IOutput {
    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    outputData(searchResults: ISearchResult[]): void {
        writeFileSync(this.filePath, JSON.stringify(searchResults), 'utf8');
    }
}
