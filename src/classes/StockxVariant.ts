import { join } from "path";
import { IFetchLevelsOptions, IStockxVariantOptions, IVariantLevel } from "../types/StockxVariant";
import { StockxClient } from "./StockxClient";

export class StockxVariant {
    uuid: string;
    sizeUS: string;
    sizeEU: string;
    sizeUK: string;
    sizeJP: string;
    sizeKR: string;
    lowestAsk: number;
    highestBid: number;
    lastSale: number;
    numberOfAsks: number;
    numberOfBids: number;

    constructor(public client: StockxClient, options: IStockxVariantOptions) {
        Object.assign(this, options);
    };

    async fetchLevels(options: IFetchLevelsOptions): Promise<IVariantLevel> {
        const response = await this.client.request.post("https://stockx.com/api/p/e", {
            operationName: "GetProductPriceLevels",
            variables: {
                productId: this.uuid,
                'market': this.client.countryCode,
                'currencyCode': this.client.currencyCode,
                'transactionType': options.side,
                'page': options.page || 1,
                'limit': options.limit || 10,
                'isVariant': true
            },
            query: require(join(__dirname, "../queries/GetProductPriceLevels.js"))
        });

        return response.data.data.variant.market.priceLevels.edges.map(e => ({
            count: e.node.count,
            price: parseInt(e.node.amount),
            isLocal: e.node.isLocal,
            type: options.side
        }));
    }
}