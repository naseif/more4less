import { ISearchEngine } from '../..';
import { ISearchResult } from '../../Interfaces';
import * as engines from '../index';

export type TSearchEngine =
    | 'Alternate'
    | 'Amazon'
    | 'Clevertronic'
    | 'Ebay'
    | 'Kaufland'
    | 'MediaMarkt'
    | 'Otto'
    | 'Proshop'
    | 'Bücher.de'
    | 'All'
    | 'Saturn';

export class SearchEngine implements ISearchEngine {
    /**
     * The desired search engine to use
     */

    protected searchEngine: TSearchEngine;

    /**
     * The desired search engine to use
     * @param TSearchEngine searchEngine
     */

    constructor(searchEngine: TSearchEngine) {
        this.searchEngine = searchEngine;
    }

    /**
     * searches for the product through the search engines you defined
     * @param string searchTerm query of the product name
     * @returns ISearchResult[]
     */

    async search(searchTerm: string): Promise<ISearchResult[]> {
        let result: ISearchResult[] = [];

        switch (this.searchEngine) {
            case 'Alternate':
                result = await new engines.AlternatePriceSearchEngine().search(searchTerm);
                break;
            case 'Amazon':
                result = await new engines.AmazonPriceSearchEngine2().search(searchTerm);
                break;
            case 'Clevertronic':
                result = await new engines.ClevertronicPriceSearchEngine().search(searchTerm);
                break;
            case 'Ebay':
                result = await new engines.EbayPriceSearchEngine().search(searchTerm);
                break;
            case 'Kaufland':
                result = await new engines.KauflandPriceSearchEngine().search(searchTerm);
                break;
            case 'MediaMarkt':
                result = await new engines.MediaMarktPriceSearchEngine().search(searchTerm);
                break;
            case 'Otto':
                result = await new engines.OttoPriceSearchEngine().search(searchTerm);
                break;

            case 'Proshop':
                result = await new engines.ProshopPriceSearchEngine().search(searchTerm);
                break;

            case 'Saturn':
                result = await new engines.SaturnPriceSearchEngine().search(searchTerm);
                break;
            case 'Bücher.de':
                result = await new engines.BuecherPriceSearchEngine().search(searchTerm);
                break;
            case 'All':
                const getAll = await Promise.all([
                    new engines.AlternatePriceSearchEngine().search(searchTerm),
                    new engines.AmazonPriceSearchEngine2().search(searchTerm),
                    new engines.ClevertronicPriceSearchEngine().search(searchTerm),
                    new engines.EbayPriceSearchEngine().search(searchTerm),
                    new engines.KauflandPriceSearchEngine().search(searchTerm),
                    new engines.MediaMarktPriceSearchEngine().search(searchTerm),
                    new engines.OttoPriceSearchEngine().search(searchTerm),
                    new engines.ProshopPriceSearchEngine().search(searchTerm),
                    new engines.SaturnPriceSearchEngine().search(searchTerm),
                    new engines.BuecherPriceSearchEngine().search(searchTerm)
                ]);
                result = getAll.flat(1);
                break;
        }
        return result;
    }
}
