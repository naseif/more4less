import { IOutput, ISearchResult } from "../../Interfaces/index"
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export class CsvOutput implements IOutput {

    filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    outputData(searchResults: ISearchResult[]): void {
        const csvWriter = createCsvWriter({
            path: this.filePath,
            header: [
                { id: 'link', title: 'Link' },
                { id: 'name', title: 'Name' },
                { id: 'description', title: 'Description' },
                { id: 'availability', title: 'Availability' },
                { id: 'rating', title: 'Rating' },
                { id: 'price', title: 'Price' },
            ]
        });

        csvWriter
            .writeRecords(searchResults)
            .then(() => console.log('The CSV file was written successfully'));
    }

}