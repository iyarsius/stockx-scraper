const axios = require('axios').default;
const stockxConfig = require('./functions/configStockx');
const configRequest = require('./functions/configRequest');

module.exports = {
    ProxyList: configRequest.ProxyList,
    /**
     * Returns the first item found on stockx
     * 
     * @param {String} item Name or SKU to scrape
     * @param {Object} options Optionnal settings
     * @param {String} options.currency Currency ticker
     * @param {String} options.country Country ticker
     * @param {String} options.proxy Proxy url or ProxyList
     */
    getProduct: async (item, options) => {
        if (typeof item !== "string") throw TypeError('Wrong item, please use string');
        let baseURI = `https://stockx.com/api/browse?&_search=${item}`;

        if (options?.currency !== undefined && !stockxConfig.currencys.includes(options?.currency)) throw SyntaxError(`${options.currency} is not a valid currency`);

        const currency = options?.currency ? options.currency : "USD";
        let extendURI = `&currency=${currency}`;

        if (options?.country !== undefined && !stockxConfig.countrys.includes(options?.country)) throw SyntaxError(`${options.country} is not a valid country`);

        const country = stockxConfig.countrys.includes(options?.country) ? options.country : "US";
        extendURI = extendURI + `&country=${country}`;

        let axiosOptions = configRequest.searchAndGetProduct(options?.proxy);

        try {
            const product = await axios.get(baseURI, axiosOptions).then(res => {
                const items = res.data
                const item = items.Products["0"]
                if (!item) throw Error('No product found')
                return {
                    name: item.title,
                    description: item.description.split("<br>").join("").split("\n\n").join("\n"),
                    image: item.media.imageUrl,
                    url: `https://stockx.com/${item.urlKey}`,
                    uuid: item.market.productUuid,
                    "72hvolume": item.market["salesLast72Hours"],
                    seller: item.brand[0].toUpperCase() + item.brand.slice(1)
                }
            });

            axiosOptions = configRequest.searchAndGetProduct(options?.proxy)

            baseURI = `https://stockx.com/api/products/${product.uuid}?includes=market`
            product.sizes = await axios.get(baseURI + extendURI, axiosOptions).then(res => {
                if (res.data.Product.shippingGroup !== 'sneakers') throw new Error("Invalid product, only support sneakers")
                const data = res.data;
                const variants = data.Product.children

                const sizes = [];
                const convert = stockxConfig.sizes

                for (const key in variants) {
                    const shoe = variants[key]
                    const sizeData = shoe.shoeSize;

                    const usSize = sizeData.replace(/[A-Z]/g, "")
                    let sizeConverter = convert.men.find(s => s.us === usSize)

                    if (!sizeConverter) continue;

                    let euSize = sizeConverter.eu
                    let sizeType = ""

                    if (sizeData.includes("W")) {
                        sizeConverter = convert.women.find(s => s.us === usSize)
                        const isAdidas = shoe.title.toLowerCase().includes("adidas")
                        if (isAdidas) sizeConverter = convert.adidas.gs.find(s => s.us === usSize)
                        if (!sizeConverter) continue;
                        euSize = sizeConverter.eu
                        sizeType = "W"
                    }

                    if (sizeData.includes("Y")) {
                        sizeConverter = convert.gs.find(s => s.us === usSize)
                        if (!sizeConverter) continue;
                        euSize = sizeConverter.eu
                        sizeType = "Y"
                    }

                    if (shoe.title.toLowerCase().includes("adidas")) {
                        sizeConverter = convert.adidas.men.find(s => s.us === usSize)
                        if (!sizeConverter) continue;
                        euSize = sizeConverter.eu
                        sizeType = ""
                    }

                    if (sizeData.includes("C")) {
                        sizeConverter = convert.td.find(s => s.us === usSize)
                        if (!sizeConverter) continue;
                        euSize = sizeConverter.eu
                        sizeType = "C"
                    }

                    if (sizeData.includes("K")) {
                        const isAdidas = shoe.title.toLowerCase().includes("adidas");
                        if (isAdidas) sizeConverter = convert.adidas.gs.find(s => s.us === usSize)
                        euSize = isAdidas ? sizeConverter.eu : null
                        sizeType = "K"
                    }


                    sizes.push({
                        sizeUS: usSize,
                        sizeEU: euSize,
                        sizeType: sizeType,
                        lowestAsk: shoe.market.lowestAsk,
                        highestBid: shoe.market.highestBid,
                        lastSale: shoe.market.lastSale
                    })
                }
                product.retail = res.data.Product.traits.find(t => t.key === "retail_price")?.value
                product.sku = res.data.Product.traits.find(t => t.key === "style_id")?.value
                product.colorway = res.data.Product.traits.find(t => t.key === "colorway")?.value.toUpperCase()
                product.releaseDate = res.data.Product.traits.find(t => t.key === "release_date")?.value
                product.lastSale = sizes.map(s => s.lastSale).sort()[0]

                return sizes
            })
            return product
        } catch (e) {
            console.log(e)
            if (e.code === "ECONNREFUSED") throw Error('Connection not possible')
            throw Error(e.message)
        }
    },
    /**
     * Returns entire product group (e.g: size W, size GS...)
     * 
     * @param {String} item Name or SKU
     * @param {Object} options Optionnal settings
     * @param {String} options.currency Currency ticker
     * @param {String} options.country Country ticker
     * @param {String} options.proxy Proxy url or ProxyList
     * @param {String} options.cookie Cookie used to request data
     */
    getProductGroup: async (item, options) => {
        const product = await module.exports.getProduct(item, options);

        const axiosOptions = configRequest.fetchRelatedProducts(product, options?.proxy, options?.cookie);

        const data = {
            operationName: "FetchRelatedProducts",
            query: `
            query FetchRelatedProducts($productId: String!, $countryCode: String!, $currencyCode: CurrencyCode, $type: RelatedProductsType, $marketName: String) {
                product(id: $productId) {
                    id
                    productCategory
                    related(input: {type: $type, country: $countryCode, limit: 15}) {
                          edges {
                            node {
                              id
                              urlKey
                              productCategory
                              primaryCategory
                              brand
                              name
                              description
                              model
                              listingType
                              lockBuying
                              lockSelling
                              title
                              styleId
                              market(currencyCode: $currencyCode) {
                                bidAskData(country: $countryCode, market: $marketName) {
                                  lowestAsk
                                  highestBid
                                  __typename
                            }
                            salesInformation {
                                  salesLast72Hours
                                  lastSale
                                  __typename
                            }
                            __typename
                        }
                        media {
                            smallImageUrl
                            imageUrl
                            __typename
                        }
                        __typename
                     }
                      __typename
                  }
                  __typename
               }
               __typename
            }
        }`,
            variables: {
                countryCode: options?.country ? options.country : "US",
                currencyCode: options?.currency ? options.currency : "USD",
                productId: product.uuid,
                type: "RELATED"
            }
        }

        const uri = "https://stockx.com/api/graphql";
        try {
            const relatedProducts = await axios.post(uri, data, axiosOptions).then(res => res.data.data.product.related.edges);

            const _removeFromString = (words, str) => {
                return words.reduce((result, word) => result.replace(word, ''), str)
            }
            const _baseTitle = (name) => {
                return _removeFromString([' (gs)', ' (ps)', ' (td)', ' (Kids)', '(Infant)', '(Kid)', ' (Infants)', ' (w)'], name.toLowerCase())
            }
            const _matchTitles = (title1, title2) => {
                title1 = _baseTitle(title1);
                title2 = _baseTitle(title2);
                if (title1.toLowerCase() === title2.toLowerCase()) return true
                if (title1.split('(')[1] && title2.split('(')[1]) return false
                if (title1.split(' (')[0] === title2.split(' (')[0]) return true
                return false
            }
            const group = relatedProducts.filter(p => _matchTitles(p.node.title, product.name)).map(p => {
                const node = p.node;

                return {
                    name: node.title,
                    image: node.media.imageUrl,
                    url: `https://stockx.com/${node.urlKey}`,
                    uuid: node.id,
                    seller: node.brand,
                    "72hvolume": node.market.salesInformation.salesLast72Hours,
                    sku: node.styleId,
                    lastSale: node.market.salesInformation.lastSale
                }
            })
            group.push({
                name: product.name,
                image: product.image,
                url: product.url,
                uuid: product.uuid,
                seller: product.seller,
                "72hvolume": product['72hvolume'],
                sku: product.sku,
                lastSale: product.lastSale
            })
            const result = {};

            const men = group.find(item => item.name === _removeFromString([' (GS)', ' (TD)', ' (PS)', ' (Infants)', '(Infant)', '(Kid)', ' (Kids)', ' (W)'], item.name));
            if (men) result.men = men
            const women = group.find(item => item.name === _removeFromString([' (GS)', ' (TD)', ' (PS)', ' (Infants)', '(Infant)', '(Kid)', ' (Kids)'], item.name) && item.name.includes(' (W)'));
            if (women) result.women = women
            const gs = group.find(item => item.name.includes('(GS)') || item.name.includes('(Infants)') || item.name.includes('(Infant)'));
            if (gs) result.gs = gs
            const ps = group.find(item => item.name.includes('(PS)') || item.name.includes('(Kids)') || item.name.includes('(Kid)'));
            if (ps) result.ps = ps
            const td = group.find(item => item.name.includes('(TD)'));
            if (td) result.td = td

            return result
        } catch (e) {
            throw Error(e.message)
        }
    }
}