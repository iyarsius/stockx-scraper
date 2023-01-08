import { IClientCountryCode, IClientCurrencyCode, IClientOptions, IClientLanguageCode, ISearchOptions } from "../types/StockxClient";
import { StockxRequest } from "./StockxRequest";
import { StockxProduct } from "./StockxProduct";
import { AuthenticationClient } from "auth0";

export class StockxClient {
    currencyCode: IClientCurrencyCode;
    countryCode: IClientCountryCode;
    languageCode: IClientLanguageCode;
    cookie: string = "";
    proxys: string[] = [];
    request: StockxRequest;
    auth0: AuthenticationClient;

    constructor(options?: Partial<IClientOptions>) {
        this.currencyCode = options?.currencyCode ? options.currencyCode : "USD";
        this.countryCode = options?.countryCode ? options.countryCode : "US";
        this.languageCode = options?.languageCode ? options.languageCode : "EN";
        this.cookie = options?.cookie ? options.cookie : "";
        this.proxys = options?.proxys ? options.proxys : [];

        this.request = new StockxRequest(this);

        this.auth0 = new AuthenticationClient({
            domain: "stockx.auth0.com",
            clientId: "OVxrt4VJqTx7LIUKd661W0DuVMpcFByD",
        });
    };

    async search(options: ISearchOptions): Promise<StockxProduct[]> {
        const url = "https://stockx.com/api/p/e";
        const data = {
            operationName: "GetSearchResults",
            query: require("../queries/GetSearchResults.js"),
            variables: {
                filtersVersion: options.filtersVersion || 4,
                query: options.query,
                sort: options.sort || {
                    id: "featured",
                    order: "DESC"
                },
                page: options.page || {
                    index: 1,
                    limit: 10
                },
                staticRanking: options.staticRanking || {
                    enabled: false,
                },
            }
        };
        const response = await this.request.post(url, data)

        return response.data.data.browse.results.edges.map((e: any) => new StockxProduct(this, {
            seller: e.node.brand,
            uuid: e.node.id,
            name: e.node.primaryTitle + (e.node.secondaryTitle ? ` ${e.node.secondaryTitle}` : ""),
            description: e.node.description,
            image: e.node.media.thumbUrl,
            sku: e.node.styleId,
            url: `https://stockx.com/${e.node.urlKey}`,
            colorway: e.node.traits.find((t: any) => t.name === "Colorway")?.value,
        }));
    };
}