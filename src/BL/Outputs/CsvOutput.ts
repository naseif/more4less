import { IOutput, ISearchResult } from '../../Interfaces/index';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export class CsvOutput implements IOutput {
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
     * outputs the data into CSV File
     * @param {ISearchResult[]} searchResults
     */

    outputData(searchResults: ISearchResult[]): void {
        const csvWriter = createCsvWriter({
            path: this.filePath,
            header: [
                { id: 'link', title: 'Link' },
                { id: 'name', title: 'Name' },
                { id: 'description', title: 'Description' },
                { id: 'availability', title: 'Availability' },
                { id: 'rating', title: 'Rating' },
                { id: 'price', title: 'Price' }
            ]
        });

        csvWriter.writeRecords(searchResults).then(() => console.log('The CSV file was written successfully'));
    }
}
