import * as bl from './BL/index';
import * as interfaces from './Interfaces/index';
const searchEngines = new bl.SearchEngineList([
    new bl.MediaMarktPriceSearchEngine(),
    new bl.AmazonPriceSearchEngine2(),
    new bl.EbayPriceSearchEngine(),
    new bl.SaturnPriceSearchEngine()
]);

(async () => {
    var searchResults = await searchEngines.search('firestick');
    const output = new bl.JSONOutput('test.json');
    console.log(searchResults);
})();

//const output : interfaces.IOutput = new bl.ConsoleOutput();
// const output: interfaces.IOutput = new bl.CsvOutput("test.csv");
