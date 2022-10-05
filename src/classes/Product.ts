import axios from "iyaxios";
import { join } from "path";
import { IClientCountryCode, IClientCurrencyCode, IClientLanguageCode } from "../types/Client";
import { IStockxProductOptions } from "../types/Product";
import { IStockxVariantOptions } from "../types/StockxVariant";
import { StockxClient } from "./Client";
import { StockxVariant } from "./StockxVariant";

export class StockxProduct {
    client: StockxClient;
    name: string;
    sku: string;
    description: string;
    image: string;
    url: string;
    uuid: string;
    seller: string;
    colorway: string;
    retailPrice?: number;
    releaseDate: string;
    lastSale?: number;
    salesLast72Hours?: number;
    totalSales?: number;
    sizes: StockxVariant[] = [];

    constructor(client: StockxClient, options: IStockxProductOptions) {
        this.client = client;
        Object.assign(this, options);
    };

    async fetch() {
        const graphqlClientDate = new Date().toISOString().split('T')[0].replace('-', '.');
        const entity = this.client.entityList.getEntity();

        const response = await axios.post("https://stockx.com/api/p/e", {
            operationName: "GetProduct",
            variables: {
                id: this.uuid,
                currencyCode: this.client.currencyCode,
                countryCode: this.client.countryCode
            },
            query: require(join(__dirname, "../queries/GetProduct.js"))
        }, {
            headers: {
                "accept": "*/*",
                'apollographql-client-name': 'Iron',
                'apollographql-client-version': graphqlClientDate,
                'content-type': 'application/json',
                'cookie': entity.cookie,
                'user-agent': entity.userAgent,
            },
            httpsAgent: entity.httpsAgent
        });

        const data = response.data.data.product
        if (data.productCategory !== 'sneakers') throw new Error("Invalid product, only support sneakers");

        this.lastSale = data.market.salesInformation.lastSale;
        this.salesLast72Hours = data.market.salesInformation.salesLast72Hours
        this.totalSales = data.market.deadStock.sold
        this.retailPrice = parseInt(data.traits.find(t => t.name === "Retail Price")?.value)
        this.releaseDate = data.traits.find(t => t.name === "Release Date")?.value

        this.sizes = data.variants.map(v => {
            const options = {
                sizeUS: `${v.sizeChart?.baseSize}`,
                lowestAsk: v.market.bidAskData.lowestAsk,
                highestBid: v.market.bidAskData.highestBid,
                lastSale: v.market.salesInformation.lastSale
            };

            for (const displayOption of v.sizeChart?.displayOptions) {
                const sizeValue = displayOption.size;
                if (sizeValue.includes("US")) continue;

                const ticker = sizeValue.split(" ")[0];
                const sizeType = displayOption.type;

                options[`size${ticker}`] = sizeValue.replace(`${sizeType.toUpperCase()} `, "");
            };

            return new StockxVariant(this.client, {
                ...options as IStockxVariantOptions
            })
        })
    };

    async getRelatedProducts() {
        const graphqlClientDate = new Date().toISOString().split('T')[0].replace('-', '.');
        const entity = this.client.entityList.getEntity();

        const response = await axios.post("https://stockx.com/api/p/e", {
            operationName: "FetchRelatedProducts",
            query: require(join(__dirname, "../queries/FetchRelatedProducts.js")),
            variables: {
                countryCode: this.client.countryCode,
                currencyCode: this.client.currencyCode,
                productId: this.uuid,
                type: "RELATED"
            }
        }, {
            headers: {
                "accept": "*/*",
                'apollographql-client-name': 'Iron',
                'apollographql-client-version': graphqlClientDate,
                'content-type': 'application/json',
                'cookie': entity.cookie,
                'user-agent': entity.userAgent,
            },
            httpsAgent: entity.httpsAgent
        });

        return response.data.data.product.related.edges.map(edge => new StockxProduct(this.client, {
            name: edge.node.title,
            sku: edge.node.styleId,
            description: edge.node.description,
            image: edge.node.media.thumbUrl,
            seller: edge.node.brand,
            colorway: edge.node.traits?.find(t => t.name === "Colorway")?.value,
            url: `https://stockx.com/${edge.node.urlKey}`,
            uuid: edge.node.id,
        }));
    }
};