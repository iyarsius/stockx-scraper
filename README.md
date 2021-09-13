# stockx-scraper

Scrape sneakers data from stockx with dynamic parmeters like proxy (static or rotating), country and currency. It also support EU sizes convesions.

# install

```js
npm i stockx-scraper
```

# use

```js
const stockx = require('stockx-scraper');

const options = {
    currency: 'EUR', // default USD
    country: 'FR', // default US
    proxy: 'http://host:port@username:password'
}

stockx.getProduct('jordan 1', options)
    .then(item => console.log(item))
    .catch(e => console.log(e))
```

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
    currency: 'EUR', // default USD
    country: 'FR', // default US
    proxy: proxy
}

// proxies will rotate on each request to avoid ip block
stockx.getProduct('jordan 1', options)
    .then(item => console.log(item))
    .catch(e => console.log(e))