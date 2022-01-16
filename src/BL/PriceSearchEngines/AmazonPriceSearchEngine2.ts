import { SearchResult } from "..";
import { ISearchResult } from "../../Interfaces/index";
import { SearchEngineBase } from "./SearchEngineBase";

export class AmazonPriceSearchEngine2 extends SearchEngineBase {
    async search(searchTerm: string): Promise<any> {
        const baseUrl = "https://www.amazon.de";
        const $ = await this.requestWebsite(`${baseUrl}/s?k=`, searchTerm);

        let test = $("div")
        console.log(test)
    }
}