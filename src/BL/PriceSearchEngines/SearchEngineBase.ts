import { ISearchEngine, ISearchResult } from '../../Interfaces';
const fetch = require('node-fetch');
import * as cheerio from 'cheerio';

export abstract class SearchEngineBase implements ISearchEngine {
    abstract search(searchTerm: string): Promise<ISearchResult[]>;

    /**
     *  Fetches the website content and convert its content into text.
     * @param string baseUrl baseUrl of the site to fetch
     * @param string searchQuery string of the product you wish to search for
     * @returns Promise<cheerio.CheerioAPI>
     *
     * Example:
     * ```ts
     * const $ = await requestWebsite("https://www.amazon.de/s?k=", "airpods")
     * // => will return cheerio API Object to work with.
     *
     * $(".prices").each((_, value) => {
     *     console.log($(value).text().trim());
     * });
     * ```
     */

    protected async requestWebsite(baseUrl: string, searchQuery: string): Promise<cheerio.CheerioAPI> {
        const searchQueryEncoded = encodeURIComponent(searchQuery);
        const req = await fetch(`${baseUrl}${searchQueryEncoded}`, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
            }
        });
        const res = await req.text();
        const $ = cheerio.load(res, {
            xmlMode: true
        });
        return $;
    }

    /**
     * It iterates over all matching results based on the selector and returns an Array containg the texts.
     * @param cheerio.CheerioAPI $ cheerio.CheerioAPI
     * @param string selector HTML Selector
     * @returns string[] Array containing all matched results
     */

    protected collectText($: cheerio.CheerioAPI, selector: string): string[] {
        let result: string[] = [];

        $(selector).each(function (_: number, value: any) {
            if ($(value).text()) {
                result.push($(value).text().trim());
            }
        });

        return result;
    }

    /**
     * It iterates over the selector and returns an array containing the content of the attribute that was provided.
     * @param cheerio.CheerioAPI $ cheerio.CheerioAPI
     * @param string selector HTML Selector
     * @param string attr HTML Attribute Name
     * @param string baseUrl baseUrl of the website in case you want to get the relative urls of all products
     * @returns {string[] Array containing all matched results
     */

    protected collectLinks($: any, selector: string, attr: string, baseUrl?: string): string[] {
        let result: string[] = [];

        $(selector).each(function (_: number, value: any) {
            baseUrl ? result.push(baseUrl + $(value).attr(attr).trim()) : result.push($(value).attr(attr).trim());
        });

        return result;
    }

    /**
     * Splits a string from whitespace and replaces "," with ".". Used for some online shops.
     * @param string value
     * @returns
     */

    protected grabFirstPartAsNumber(value: string): any {
        if (value) return Number(value.split(/\s/)[0].replace(',', '.'));
    }

    /**
     * Returns only unique values from an Array. Used mostly with the filter array method as a callback function.
     * @param string value
     * @param number index
     * @param string  self
     * @returns
     */

    protected onlyUnique(value: string, index: number, self: string | any[]): boolean {
        return self.indexOf(value) === index;
    }

    /**
     * Splices an array content based on the given start and endpositions. Returns the original mutated array.
     * @param string[] array the original array you want to splice/mutate
     * @param number startPosition where to start splicing the array
     * @param number endPosition where to end splicing the array
     * @returns string[]
     *
     * Example:
     * ```ts
     * const testArray = ["one", "two", "three"]
     * spliceArray(testArray, 0, 2)
     * // => ["three"]
     *
     * spliceArray(testArray, testArray.length - 2, 2)
     * // => ["one"]
     * ```
     */

    protected spliceArray(array: string[], startPosition: number, endPosition: number): string[] {
        const splice = array.splice(startPosition, endPosition);
        return array;
    }

    /**
     * Iterates through the selector and tries to find an element or a selector in the first given selector and returns the result as an array
     * @param cheerio.CheerioAPI $
     * @param string selector HTML Selector
     * @param string elementOrSelector HTML Element or Selector
     * @param string attribute HTML Attribute
     * @param string baseUrl baseUrl of the website in case you want to get the relative urls of all products
     * @returns any[]
     *
     *
     * Example:
     * ```ts
     * collectOnAttributeAndElement($, ".results--grid", "a", "href", baseUrl)
     * // => will return an array containing all relative links in the href attribute that live in a
     * ```
     */

    protected collectOnAttributeAndElement(
        $: cheerio.CheerioAPI,
        selector: string,
        elementOrSelector: string,
        attribute: string,
        baseUrl?: string
    ): any[] {
        let result: any[] = [];
        $(selector)
            .find(elementOrSelector)
            .each((_: number, value: any) => {
                baseUrl ? result.push(baseUrl + $(value).attr(attribute)) : result.push($(value).attr(attribute));
            });

        return result;
    }

    protected collectOnAttributeAndElementWithCallback(
        $: cheerio.CheerioAPI,
        selector: string,
        elementOrSelector: string,
        callback: (_: number, value: any) => void,
        baseUrl?: string
    ) {
        $(selector).find(elementOrSelector).each(callback);
    }

    protected splitAndReplaceValue(
        array: string[],
        splitter: string,
        splitIndex: number,
        valueToReplace: string,
        replacement: string
    ): number[] {
        return array.map((value: string) =>
            Number(value.split(splitter)[splitIndex].trim().replace(valueToReplace, replacement))
        );
    }
}
