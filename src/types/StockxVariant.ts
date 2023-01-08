export interface IStockxVariantOptions {
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
}

export interface IFetchLevelsOptions {
    side: "ASK" | "BID";
    page?: number;
    limit?: number;
};

export interface IVariantLevel {
    count: number;
    price: number;
    isLocal: boolean;
    type: "ASK" | "BID";
}