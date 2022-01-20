import { SearchEngineList } from './BL/index';

export * from './BL/index';
export * from './Interfaces/index';

const app = new SearchEngineList("Otto");

(async () => {
    const search = await app.search('airpods');
    console.log(search);
})();
