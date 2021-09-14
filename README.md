# stockx-scraper

Scrape sneakers data from stockx with dynamic parameters like proxy (static or rotating), country and currency. It also support EU sizes convesions.

# install

```js
npm i stockx-scraper
```

# use

```js
const stockx = require('stockx-scraper');

const options = {
    currency: 'EUR', // Default USD
    country: 'FR', // Default US
    proxy: 'http://host:port@username:password' // Default localhost
}

stockx.getProduct('jordan 1', options)
    .then(item => console.log(item))
    .catch(e => console.log(e))
```

Item structure:

    • name: <String> Full product name
    • description: <String> Short description (not for all items)
    • image: <String> Image directURI
    • url: <String> Product url to human interface
    • uuid: <String> Product uuid
    • lastSale: <Number> Last sale price (all sizes) in currency
    • 72hvolume: <Number> Traded volumes in last 3d in currency
    • retail: <Number> Retail price in USD
    • sku: <String> Product unique SKU
    • colorway: <String> Product colorways e.g "BLACK/WHITE"
    • releaseDate: <String> YYYY/MM/DD Release date
    • seller: Product distributor e.g Nike, Jordan, Adidas...
    • sizes: <Array> Array of sizeObject

SizeObject structure:

    • sizeUS: <String> US size
    • sizeEU: <String> Converted from US size
    • sizeType: <String> Size optionnal keywords e.g W for Woman, Y for GS...
    • lowestAsk: <Number> Lowest ask price for this size in currency
    • highestBid: <Number> Highest bid price for this size in currency
    • lastSale: <Number> Last sale price for this size in currency

# proxy-management

use a rotating proxy system

```js
const stockx = require('stockx-scraper');

// Load rotating proxy list
const proxy = new stockx.ProxyList([
    'http://host:port@username:password',
    'http://host:port@username:password',
    'http://host:port@username:password',
])

const options = {
    currency: 'EUR',
    country: 'FR',
    proxy: proxy
}

// Proxies will rotate on each request to avoid ip block
stockx.getProduct('jordan 1', options)
    .then(item => console.log(item))
    .catch(e => console.log(e))
```

Proxy rotation saved even when calling the function multiple times.