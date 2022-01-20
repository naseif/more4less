import { ISearchEngine, ISearchResult } from '../../Interfaces';
const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import http from 'node:http';
import https from 'node:https';
import { Stream } from 'node:stream';

export type HTTPMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface IFetchOptions {
    /**
     * http(s).Agent instance or function that returns an instance
     */
    agent?: (_parsedURL: any) => void;

    /** 
     * request headers. format is the identical to that accepted by the Headers constructor
     */
    headers?: { 'User-Agent': string };

    /**
     * The HTTP Method of the request
     */

    method?: HTTPMethods;

    /**
     * set to `manual` to extract redirect headers, `error` to reject redirect. Default "follow"
     */

    redirect?: string;

    /**
     * maximum response body size in bytes. 0 to disable
     */
    size?: number;

    /**
     * support gzip/deflate content encoding. false to disable
     */
    compress?: boolean;

    /**
     * request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
     */

    body?: null | string | Buffer | Blob | Stream;
}

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

    protected async requestWebsite(baseUrl: string, fetchOptions?: IFetchOptions): Promise<cheerio.CheerioAPI> {
        const httpAgent = new http.Agent({
            keepAlive: true,
            maxSockets: 20
        });
        const httpsAgent = new https.Agent({
            keepAlive: true,
            maxSockets: 20
        });

        const DefaultOptions = {
            agent: (_parsedURL: any) => {
                if (_parsedURL.protocol == 'http:') {
                    return httpAgent;
                } else {
                    return httpsAgent;
                }
            },
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 Edg/96.0.1054.43'
            }
        };

        const req = await fetch(`${baseUrl}`, fetchOptions ? fetchOptions : DefaultOptions);
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
