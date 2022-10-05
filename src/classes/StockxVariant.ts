import { IStockxVariantOptions } from "../types/StockxVariant";
import { StockxClient } from "./Client";

export class StockxVariant {
    sizeUS: string;
    sizeEU: string;
    sizeUK: string;
    sizeJP: string;
    sizeKR: string;
    lowestAsk: number;
    highestBid: number;
    lastSale: number;

    constructor(client: StockxClient, options: IStockxVariantOptions) {
        this.sizeUS = options.sizeUS;
        this.sizeEU = options.sizeEU;
        this.sizeUK = options.sizeUK;
        this.sizeJP = options.sizeJP;
        this.sizeKR = options.sizeKR;
        this.lowestAsk = options.lowestAsk;
        this.highestBid = options.highestBid;
        this.lastSale = options.lastSale;
    };
}