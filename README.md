
# stockx-scraper v2
Scrape sneakers data using dynamic parameters like proxy (rotating support), cookie, country and currency.

It also support typescript and full sizes conversions (EU, UK, JP...)



## Install

```javascript
npm i stockx-scraper
```

## Usage

```javascript
const { StockxClient } = require("stockx-scraper");

const client = new StockxClient({
    currencyCode: "EUR" // default USD
    countryCode: "FR" // default US
    languageCode: "FR" // default EN
    proxys: [
        "http://username:pass@ip:port",
        "http://username:pass@ip:port"
        ...
    ],
    cookie: "Your cookie here" // by default module create it's own
})
```


## Methods

```javascript
const products = await client.search({
    query: "yeezy"
});

const firstResult = products[0];

// fetch variants and some data
await firstResult.fetch();

// get related products
const related = await firstResult.getRelatedProducts();

// related works like normal products
await related[0].fetch();
```

Even without calling .fetch(), a product will always contains
- name
- sku
- description
- image (url)
- url
- uuid
- seller (nike, adidas...)
- colorway