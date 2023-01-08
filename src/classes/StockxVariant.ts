import { IStockxVariantOptions } from "../types/StockxVariant";
import { StockxClient } from "./StockxClient";

export class StockxVariant {
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

    constructor(client: StockxClient, options: IStockxVariantOptions) {
        Object.assign(this, options);
    };
}