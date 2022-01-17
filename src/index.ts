import * as bl from './BL/index';
import * as interfaces from "./Interfaces/index"
const searchEngines = new bl.SearchEngineList([new bl.EbayPriceSearchEngine(), new bl.AmazonPriceSearchEngine2()]);

(async () => {
    var searchResults = await searchEngines.search('firestick');
    const output: interfaces.IOutput = new bl.JSONOutput("test.json");

    output.outputData(searchResults);
    console.log(searchResults);
})();


// //const output : interfaces.IOutput = new bl.ConsoleOutput();
// // const output: interfaces.IOutput = new bl.CsvOutput("test.csv");

