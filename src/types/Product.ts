import { IClientCountryCode, IClientCurrencyCode, IClientLanguageCode } from "./Client";

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