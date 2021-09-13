const axios = require('axios');
const stockxConfig = require('./functions/configStockx');
const configRequest = require('./functions/configRequest');
const splitProxy = require('split-proxy')

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

        let proxy = typeof options?.proxy === "string" ? splitProxy(options.proxy) : false

        console.log(options.proxy)
        if (options?.proxy?.list) proxy = options.proxy.use()

        let axiosOptions = configRequest.agents(proxy);

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
                lastSale: item.market.lastSale,
                "72hvolume": item.market["salesLast72Hours"],
                retail: item.retailPrice,
                sku: item.styleId,
                colorway: item.colorway.toUpperCase(),
                releaseDate: item.releaseDate,
                seller: item.brand[0].toUpperCase() + item.brand.slice(1)
            }
        });

        if (options?.proxy?.list) proxy = options.proxy.use()

        axiosOptions = configRequest.agents(proxy)

        baseURI = `https://stockx.com/api/products/${product.uuid}?includes=market`
        product.sizes = await axios.get(baseURI + extendURI, axiosOptions).then(res => {
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
                    sizeConverter = convert.adidas.find(s => s.us === usSize)
                    if (!sizeConverter) continue;
                    euSize = sizeConverter.eu
                    sizeType = ""
                }

                if (sizeData.includes("K")) {
                    euSize = "--"
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
            return sizes
        })
        return product
    } catch (e) {
        if (e.code === "ECONNREFUSED") throw Error('Connection not possible')
        throw Error(e.message)
    }
    }
}