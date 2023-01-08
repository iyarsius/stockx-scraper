import { IClientCountryCode, IClientCurrencyCode, IClientLanguageCode } from "./StockxClient";

export interface IStockxProductOptions {
    name: string;
    sku: string;
    description: string;
    image: string;
    url: string;
    uuid: string;
    seller: string;
    colorway: string;
}