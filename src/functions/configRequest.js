const UserAgent = require('user-agents');
const splitProxy = require('split-proxy');
const dayjs = require('dayjs')

// Internal function filtering proxy and proxylist
const _setProxy = (proxy) => {
    proxy = typeof proxy === "string" ? splitProxy(proxy) : proxy

    if (proxy.list) proxy = proxy.use()

    return proxy = {
        host: proxy.host,
        port: proxy.port,
        auth: { username: proxy.login, password: proxy.password }
    };
}

// Internal function converting Object to cookie string format.
const _setCookie = (cookieObject) => {
    let cookie = ""
    for (const key in cookieObject) {
        const atr = `${key}=${cookieObject[key]}; `
        cookie = cookie + atr
    }
    return cookie
}

module.exports = {
    ProxyList: class {
        /**
        * @param {Array} list List every proxy with format: http://host:port@username:password
        */
        constructor(list = []) {
            if (!list[0]) throw SyntaxError('Missing list')
            this.list = list.map(url => splitProxy(url)),
                this.current = this.list[0]
            this.use = () => {
                const used = this.list.shift();
                this.current = this.list[0];
                this.list.push(used)
                return this.current
            }
        }
    },

    // Load axios params for search and getProduct requests
    searchAndGetProduct: (options) => {
        const userAgent = new UserAgent();

        const axiosConfig = {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                'cookie': options?.cookie ? options.cookie : _setCookie({
                    stockx_homepage: "sneakers",
                    language_code: "en",
                    stockx_selected_region: options?.country ? options.country : "US",
                    stockx_preferred_market_activity: "sales",
                    stockx_dismiss_modal: true,
                    IR_gbd: "stockx.com",
                    cookie_policy_accepted: true,
                    stockx_product_visits: Math.floor(Math.random() * 10),
                    stockx_default_sneakers_size: "All",
                    OptanonConsent: new URLSearchParams({
                        isGpcEnabled: 1,
                        datestamp: dayjs().format("ddd+MMM+DD+YYYY+HH%3Amm%3Ass+Z"),
                        version: "6.36.0",
                        isIABGlobal: false,
                        hosts: "",
                        consentId: "124f4404-36c7-437d-aeee-1b67d82251ee",
                        interactionCount: 1,
                        landingPath: "NotLandingPage",
                        groups: encodeURIComponent("C0001:1,C0002:1,C0005:1,C0004:1,C0003:1")
                    }).toString(),
                }),
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1",
                "user-agent": userAgent.toString()
            },
        }

        if (options?.proxy) axiosConfig.proxy = _setProxy(options?.proxy)

        return axiosConfig
    },

    // Load axios params for related products requests
    graphQlOptions: (product, options) => {
        const userAgent = new UserAgent();
        const graphqlClientDate = new Date().toISOString().split('T')[0].replace('-', '.')


        const axiosConfig = {
            headers: {
                "accept": "*/*",
                'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                'apollographql-client-name': 'Iron',
                'apollographql-client-version': graphqlClientDate,
                'content-type': 'application/json',
                'cookie': options?.cookie ? options.cookie : _setCookie({
                    stockx_homepage: "sneakers",
                    language_code: "en",
                    stockx_market_country: options?.country ? options.country : "US",
                    stockx_preferred_market_activity: "sales",
                    IR_gbd: "stockx.com",
                    cookie_policy_accepted: true,
                    stockx_product_visits: Math.floor(Math.random() * 10),
                    stockx_default_sneakers_size: "All",
                }),
                'origin': 'https://stockx.com',
                'referer': product.url,
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': 1,
                'user-agent': userAgent.toString()
            }
        }

        if (options?.proxy) axiosConfig.proxy = _setProxy(options.proxy)

        return axiosConfig
    }
}