import { SearchEngineBase } from '..';
import { ISearchResult } from '../../Interfaces';

export class NotebooksbilligerPriceSearchEngine extends SearchEngineBase {
    async search(searchTerm: string): Promise<any> {
        const baseUrl = 'https://www.notebooksbilliger.de';
        const $ = await this.requestWebsite(`${baseUrl}/produkte/${encodeURIComponent(searchTerm)}`);
    }
}
