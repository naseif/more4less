import { SearchEngineBase } from "..";
import { ISearchResult } from "../../Interfaces";

export class MediMaxPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<any> {
        const baseUrl = "https://www.medimax.de";
        const $ = await this.requestWebsite(`${baseUrl}/search/?text=${encodeURIComponent(searchTerm)}`)

        console.log(this.collectText($, ".cmsproductlist-name"))
    }
}