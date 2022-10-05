import { IClientOptions } from "../types/Client";
import { IEntity } from "../types/EntityList";
import dayjs from "dayjs";
import UserAgent from "user-agents";
import splitproxy from "split-proxy"
import { HttpsProxyAgent } from "https-proxy-agent";

export class EntityList {
    private entities: IEntity[];
    private index: number;
    private options: IClientOptions;

    constructor(proxies: string[] | undefined, options: IClientOptions) {
        this.options = options;
        this.entities = proxies ? proxies.map(proxy => this._createEntity(proxy)) : [ this._createEntity() ];
        this.index = 0;
    };

    private _createCookie(): string {
        const data = {
            stockx_homepage: "sneakers",
            language_code: this.options.languageCode.toLowerCase(),
            stockx_selected_region: this.options.countryCode,
            stockx_preferred_market_activity: "sales",
            stockx_dismiss_modal: true,
            IR_gbd: "stockx.com",
            cookie_policy_accepted: true,
            stockx_product_visits: Math.floor(Math.random() * 10),
            stockx_default_sneakers_size: "All",
            OptanonConsent: new URLSearchParams([
                [ "isGpcEnabled", "1" ],
                [ "datestamp", dayjs().format("ddd+MMM+DD+YYYY+HH%3Amm%3Ass+Z") ],
                [ "version", "6.36.0" ],
                [ "isIABGlobal", "false" ],
                [ "hosts", "" ],
                [ "consentId", "124f4404-36c7-437d-aeee-1b67d82251ee" ],
                [ "interactionCount", "1" ],
                [ "landingPath", "NotLandingPage" ],
                [ "groups", encodeURIComponent("C0001:1,C0002:1,C0005:1,C0004:1,C0003:1") ]
            ]).toString(),
        }
        
        let cookie = "";
        for (const key in data) {
            cookie += `${key}=${data[key]}; `;
        }

        return cookie;
    }

    private _createEntity(proxy?: string): IEntity {
        const splitedProxy = proxy ? splitproxy(proxy) : undefined;

        return {
            httpsAgent: splitedProxy ? new HttpsProxyAgent({
                host: splitedProxy.host,
                port: splitedProxy.port,
                auth: splitedProxy.login && splitedProxy.password ? `${splitedProxy.login}:${splitedProxy.password}` : undefined
            }) : undefined,
            userAgent: new UserAgent().toString(),
            cookie: this._createCookie()
        };
    }

    public getEntity(): IEntity {
        const entity = this.entities[this.index];
        this.index = (this.index + 1) % this.entities.length;
        return entity;
    }
}