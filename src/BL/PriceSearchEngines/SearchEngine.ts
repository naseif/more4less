import { ISearchEngine } from '../..';
import * as engines from '../index';
import { SearchEngineList } from './SearchEngineList';

export type TSearchEngine =
    | 'Alternate'
    | 'Amazon'
    | 'Bücher.de'
    | 'Clevertronic'
    | 'Cyberport'
    | 'Ebay'
    | 'Kaufland'
    | 'MediaMarkt'
    | 'MediMax'
    | 'Mindfactory'
    | 'Otto'
    | 'Proshop'
    | 'Saturn'
    | 'All';

export class SearchEngineFactory {
    /**
     * searches for the product through the search engines you defined
     * @param string searchTerm query of the product name
     * @returns ISearchResult[]
     */

    GetSearchEngine(searchEngineName: TSearchEngine): ISearchEngine {
        switch (searchEngineName) {
            case 'Alternate':
                return new engines.AlternatePriceSearchEngine();
            case 'Amazon':
                return new engines.AmazonPriceSearchEngine2();

            case 'Clevertronic':
                return new engines.ClevertronicPriceSearchEngine();

            case 'Cyberport':
                return new engines.CyberportPriceSearchEngine();

            case 'Ebay':
                return new engines.EbayPriceSearchEngine();

            case 'Kaufland':
                return new engines.KauflandPriceSearchEngine();

            case 'MediaMarkt':
                return new engines.MediaMarktPriceSearchEngine();

            case 'MediMax':
                return new engines.MediMaxPriceSearchEngine();

            case 'Mindfactory':
                return new engines.MindfactoryPriceSearchEngine();

            case 'Otto':
                return new engines.OttoPriceSearchEngine();

            case 'Proshop':
                return new engines.ProshopPriceSearchEngine();

            case 'Saturn':
                return new engines.SaturnPriceSearchEngine();

            case 'Bücher.de':
                return new engines.BuecherPriceSearchEngine();

            default:
                return new SearchEngineList([
                    new engines.AlternatePriceSearchEngine(),
                    new engines.AmazonPriceSearchEngine2(),
                    new engines.ClevertronicPriceSearchEngine(),
                    new engines.EbayPriceSearchEngine(),
                    new engines.KauflandPriceSearchEngine(),
                    new engines.MediaMarktPriceSearchEngine(),
                    new engines.OttoPriceSearchEngine(),
                    new engines.ProshopPriceSearchEngine(),
                    new engines.SaturnPriceSearchEngine(),
                    new engines.BuecherPriceSearchEngine(),
                    new engines.CyberportPriceSearchEngine(),
                    new engines.MediMaxPriceSearchEngine(),
                    new engines.MindfactoryPriceSearchEngine()
                ]);
        }
    }
}
