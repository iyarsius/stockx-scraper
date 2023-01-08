import { join } from "path";
import { IClientCountryCode, IClientCurrencyCode, IClientLanguageCode } from "../types/StockxClient";
import { IStockxProductOptions } from "../types/StockxProduct";
import { IStockxVariantOptions } from "../types/StockxVariant";
import { StockxClient } from "./StockxClient";
import { StockxVariant } from "./StockxVariant";
import { writeFileSync } from "fs";

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
        const response = await this.client.request.post("https://stockx.com/api/p/e", {
            operationName: "GetProduct",
            variables: {
                id: this.uuid,
                currencyCode: this.client.currencyCode,
                countryCode: this.client.countryCode,
                marketName: this.client.countryCode,
            },
            query: require(join(__dirname, "../queries/GetProduct.js"))
        });

        const data = response.data.data.product;

        if (data.productCategory !== 'sneakers') throw new Error("Invalid product, only support sneakers");

        this.lastSale = data.market.salesInformation.lastSale;
        this.salesLast72Hours = data.market.salesInformation.salesLast72Hours
        this.totalSales = data.market.deadStock.sold
        this.retailPrice = parseInt(data.traits.find(t => t.name === "Retail Price")?.value)
        this.releaseDate = data.traits.find(t => t.name === "Release Date")?.value

        this.sizes = data.variants.map(v => {
            const options = {
                uuid: v.id,
                sizeUS: `${v.sizeChart?.baseSize}`,
                lowestAsk: v.market.bidAskData.lowestAsk,
                highestBid: v.market.bidAskData.highestBid,
                lastSale: v.market.salesInformation.lastSale,
                numberOfAsks: v.market.bidAskData.numberOfAsks,
                numberOfBids: v.market.bidAskData.numberOfBids,
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

    async getRelatedProducts(): Promise<StockxProduct[]> {
        const response = await this.client.request.post("https://stockx.com/api/p/e", {
            operationName: "FetchRelatedProducts",
            query: require(join(__dirname, "../queries/FetchRelatedProducts.js")),
            variables: {
                countryCode: this.client.countryCode,
                currencyCode: this.client.currencyCode,
                productId: this.uuid,
                type: "RELATED"
            }
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