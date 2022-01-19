import { ISearchEngine, ISearchResult } from '../../Interfaces/index';
import * as engines from "../index"

/**
 *  Engine list to select from when initializing the Class instead 
 */

export type TSearchEngine = "Alternate" | "Amazon" | "Clevertronic" | "Ebay" | "Kaufland" | "MediaMarkt" | "Otto" | "Proshop" | "Saturn";

export class SearchEngineList implements ISearchEngine {
    /**
     * array of all search engines
     */
    searchEngines: TSearchEngine | ISearchEngine[]

    /**
     * array of the search engines you wish to iterate through
     * @param ISearchEngine[] searchEngines
     */

    constructor(searchEngines: TSearchEngine | ISearchEngine[]) {
        this.searchEngines = searchEngines;
    }

    /**
     * searches for the product through the search engines you defined
     * @param {string} searchTerm query of the product name
     * @returns
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        let result: ISearchResult[] = [];

        if (typeof this.searchEngines === "string") {
            switch (this.searchEngines) {
                case "Alternate":
                    result = await new engines.AlternatePriceSearchEngine().search(searchTerm)
                    break;
                case "Amazon":
                    result = await new engines.AmazonPriceSearchEngine2().search(searchTerm)
                    break;
                case "Clevertronic":
                    result = await new engines.ClevertronicPriceSearchEngine().search(searchTerm)
                    break;
                case "Ebay":
                    result = await new engines.EbayPriceSearchEngine().search(searchTerm)
                    break;
                case "Kaufland":
                    result = await new engines.KauflandPriceSearchEngine().search(searchTerm)
                    break;
                case "MediaMarkt":
                    result = await new engines.MediaMarktPriceSearchEngine().search(searchTerm)
                    break;
                case "Otto":
                    result = await new engines.OttoPriceSearchEngine().search(searchTerm)
                    break;

                case "Proshop":
                    result = await new engines.ProshopPriceSearchEngine().search(searchTerm)
                    break;

                case "Saturn":
                    result = await new engines.SaturnPriceSearchEngine().search(searchTerm)
                    break;

            }
        } else {
            for (const engine of this.searchEngines) {
                const temp = await engine.search(searchTerm);

                for (const searchResult of temp) {
                    result.push(searchResult);
                }
            }
        }

        return result;
    }
}
