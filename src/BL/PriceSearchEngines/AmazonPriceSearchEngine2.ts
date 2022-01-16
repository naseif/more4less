import { SearchEngineBase } from "./SearchEngineBase";
const cheerio = require("cheerio");

export class AmazonPriceSearchEngine2 extends SearchEngineBase {
    async search(searchTerm: string): Promise<any> {
        const baseUrl = "https://www.amazon.de";
        const $ = await this.requestWebsite(`${baseUrl}/s?k=`, searchTerm);

        //writeFileSync("test.html", $, "utf8");

        let divs = $(".s-result-item")
        for (let i = 0; i < divs.length; i++) {
            const thisDiv = divs[i];
            const htmlOfThisDiv = $.html(thisDiv);
            const $detail = cheerio.load(htmlOfThisDiv, {
                xmlMode: true,
            });

            console.log("---------------------------------------------------------");
            console.log(i);
            console.log($detail(".s-title-instructions-style").text().trim());
            console.log($detail(".a-price-whole").text().trim());
            
        }
    }
}