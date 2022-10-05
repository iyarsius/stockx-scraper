import { IClientCountryCode, IClientCurrencyCode, IClientOptions, IClientLanguageCode, ISearchOptions } from "../types/Client";
import { EntityList } from "./EntityList";
import axios from "iyaxios";
import { StockxProduct } from "./Product";

export class StockxClient {
    currencyCode: IClientCurrencyCode;
    countryCode: IClientCountryCode;
    languageCode: IClientLanguageCode;
    entityList: EntityList;

    constructor(options?: IClientOptions) {
        this.currencyCode = options?.currencyCode ? options?.currencyCode : "USD";
        this.countryCode = options?.countryCode ? options?.countryCode : "US";
        this.languageCode = options?.languageCode ? options?.languageCode : "EN";

        this.entityList = new EntityList(options?.proxys, {
            countryCode: this.countryCode,
            currencyCode: this.currencyCode,
            languageCode: this.languageCode
        });
    };

    async search(query: string, options?: ISearchOptions): Promise<StockxProduct[]> {
        const entity = this.entityList.getEntity();

        const url = `https://stockx.com/api/browse?_search=${encodeURIComponent(query)}}&page=${options?.page ? options.page : "1"}&resultsPerPage=${options?.productsPerPage ? options.productsPerPage : "10"}&dataType=product&facetsToRetrieve[]=browseVerticals&propsToRetrieve[][]=styleId&propsToRetrieve[][]=brand&propsToRetrieve[][]=colorway&propsToRetrieve[][]=media.thumbUrl&propsToRetrieve[][]=title&propsToRetrieve[][]=productCategory&propsToRetrieve[][]=shortDescription&propsToRetrieve[][]=urlKey`
        const response = await axios.get(url, {
            httpsAgent: entity.httpsAgent,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "cookie": entity.cookie,
                "user-agent": entity.userAgent,
            }
        });

        return response.data.Products.map(p => new StockxProduct(this, {
            name: p.title,
            sku: p.styleId,
            description: p.shortDescription,
            image: p.media.thumbUrl,
            url: "https://stockx.com/" + p.urlKey,
            uuid: p.objectID,
            seller: p.brand,
            colorway: p.colorway,
        }));
    }
}