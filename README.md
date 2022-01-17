# more4less

A fast flexible **price search engine** for various german online shops!

## Motivation

Just wanted to practice web scraping :)

## Supported online shops:

- eBay
- Amazon
- MediaMarkt
- Saturn


## Installation

```
npm i more4less
```

## Importing


### TypeScript

```ts
import * as more4less from "more4less";

import { AmazonPriceSearchEngine, EbayPriceSearchEngine } from 'more4less'; // Individual classes
```


### JavaScript

```js
const more4less = require("more4less");

const { EbayPriceSearchEngine } = require('more4less'); // Individual classes
```

## Examples

### Search on a single shop

```ts
import * as more4less from "more4less";

const ebay = new more4less.EbayPriceSearchEngine();

(async () => {
    const getProduct = await ebay.search("alexa firestick");
    console.log(getProduct);
})();
```

### Search on all supported shops

```ts
import * as more4less from "more4less";

const searchEngines = new more4less.SearchEngineList([new more4less.EbayPriceSearchEngine(), new more4less.MediaMarktPriceSearchEngine(), new more4less.SaturnPriceSearchEngine(), new more4less.AmazonPriceSearchEngine2()]);

(async () => {
    const getProduct = await searchEngines.search("alexa firestick");
    console.log(getProduct);
})();
```

### Search on multiple shops

```ts
import * as more4less from "more4less";

const searchEngines = new more4less.SearchEngineList([new more4less.EbayPriceSearchEngine(), new more4less.AmazonPriceSearchEngine2()]);

(async () => {
    const getProduct = await searchEngines.search("alexa firestick");
    console.log(getProduct);
})();
```

### Storing the Output

There are two ways of saving the output, either as JSON or CSV

```ts
import * as more4less from "more4less";

const searchEngines = new more4less.SearchEngineList([new more4less.EbayPriceSearchEngine(), new more4less.AmazonPriceSearchEngine2()]);
const output = new more4less.JSONOutput("test.json") // path and filename

(async () => {
    const getProduct = await searchEngines.search("alexa firestick");
    output.outputData(getProduct);
})();
```

### Result template

```ts
// Each price engine provides the follwoing results:

interface ISearchResult {
    engine: string;
    link: string;
    name: string;
    rating: number;
    price: number;
    thumbnail: string;
}

```

## Contributions

Software contributions are welcome. If you are not a dev, testing and reproting bugs can also be very helpful!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.