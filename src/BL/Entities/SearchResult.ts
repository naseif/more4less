import { ISearchResult } from '../../Interfaces/ISearchResult';

export class SearchResult implements ISearchResult {
    /**
     * the engine the search was made on
     */

    engine: string;

    /**
     * link to the searched product
     */
    link: string;

    /**
     * name of the product
     */
    name: string;

    /**
     * the rating of the product
     */
    rating: number;

    /**
     * price of the product
     */
    price: number;

    /**
     * thumbnail of the product
     */
    thumbnail: string;

    /**
     *
     * @param string the engine the search was made on
     * @param string link to the searched product
     * @param string name of the product
     * @param number the rating of the product
     * @param number price of the product
     * @param string thumbnail of the product
     */

    constructor(engine: string, link: string, name: string, rating: number, price: number, thumbanil: string) {
        this.engine = engine;
        this.link = link;
        this.name = name;
        this.rating = rating;
        this.price = price;
        this.thumbnail = thumbanil;
    }
}
