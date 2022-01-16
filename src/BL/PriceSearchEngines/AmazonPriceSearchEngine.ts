import { SearchResult } from "..";
import { ISearchResult } from "../../Interfaces/index";
import { SearchEngineBase } from "./SearchEngineBase";

export class AmazonPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<ISearchResult[]> {
        const baseUrl = "https://www.amazon.de";
        const $ = await this.requestWebsite(`${baseUrl}/s?k=`, searchTerm);

        let titles: any[] = this.collectText($, ".s-title-instructions-style");
        let prices: any[] = this.collectText($, ".a-price-whole");;
        let links: any[] = this.collectLinks($, ".a-link-normal[title='product-image']", baseUrl);
        let ratings: any[] = this.collectText($, ".a-icon-alt");

        let result: ISearchResult[] = [];

        titles.forEach((title, index) => {
            result.push(new SearchResult(
                this.constructor.name,
                links[index],
                title,
                this.grabFirstPartAsNumber(ratings[index]),
                this.grabFirstPartAsNumber(prices[index])
            ));
        });

        return result;
    }
}