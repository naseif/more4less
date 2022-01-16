import * as bl from "./BL/index"

const searchEngines = new bl.SearchEngineList(
    [new bl.AmazonPriceSearchEngine()]
);

(async () => {
    var searchResults = await searchEngines.search("GTX 1060");
    console.log(searchResults);
})();

// const searchResults = [
//     new bl.SearchResult("google", "Schnapper", "Ein Schnapper schnappt sich schnappich.", true, 5, 5),
//     new bl.SearchResult("google", "Pappich", "Ein Pappich pappt den schnappich.", false, 3, 50)
// ];

// //const output : interfaces.IOutput = new bl.ConsoleOutput();
// // const output: interfaces.IOutput = new bl.CsvOutput("test.csv");
// const output: interfaces.IOutput = new bl.JSONOutput("test.json");

// output.outputData(searchResults);


// (async () => {
//     const req = await fetch("https://www.amazon.de/s?k=firestick", { headers: { "User-Agent": "Mozilla/5.0 (Linux; U; Android 2.2; de-de; HTC Magic Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" } });
//     const res = await req.text();
//     writeFileSync("test.html", res, "utf8")
// })()