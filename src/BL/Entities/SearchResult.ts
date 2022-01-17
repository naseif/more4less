import { ISearchResult } from '../../Interfaces/ISearchResult';

export class SearchResult implements ISearchResult {
    engine: string;
    link: string;
    name: string;
    rating: number;
    price: number;
    thumbnail: string;

    constructor(engine: string, link: string, name: string, rating: number, price: number, thumbanil: string) {
        this.engine = engine;
        this.link = link;
        this.name = name;
        this.rating = rating;
        this.price = price;
        this.thumbnail = thumbanil;
    }
}
