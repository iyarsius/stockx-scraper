import { IConfig } from "../types/StockxRequest";
import dayjs from "dayjs";
import UserAgent from "user-agents";
import splitproxy from "split-proxy"
import { HttpsProxyAgent } from "https-proxy-agent";
import axios, { Axios } from "axios";
import { StockxClient } from "./StockxClient";

export class StockxRequest extends Axios {
    constructor(public client: StockxClient) {
        super(axios.defaults);

        // rotate proxies at every request
        this.interceptors.request.use(async (axiosConfig) => {
            const config = this._createConfig()

            axiosConfig.headers["user-agent"] = config.userAgent;
            axiosConfig.headers["cookie"] = config.cookie;
            axiosConfig.httpsAgent = config.httpsAgent;

            if (axiosConfig.url === "https://stockx.com/api/p/e") {
                axiosConfig.headers["apollographql-client-version"] = "2023.01.01.01";
                axiosConfig.headers["apollographql-client-name"] = "Iron";
                axiosConfig.headers["app-platform"] = "Iron";
                axiosConfig.headers["app-version"] = "2023.01.01.01";
            }

            axiosConfig.headers["accept-language"] = this.client.languageCode.toLowerCase();
            axiosConfig.headers["accept"] = "application/json";
            axiosConfig.headers["x-stockx-device-id"] = "x";

            return axiosConfig;
        });
    };

    private _createCookie(): string {
        const data = {
            stockx_homepage: "sneakers",
            language_code: this.client.languageCode.toLowerCase(),
            stockx_selected_region: this.client.countryCode,
            stockx_preferred_market_activity: "sales",
            stockx_dismiss_modal: true,
            IR_gbd: "stockx.com",
            cookie_policy_accepted: true,
            stockx_product_visits: Math.floor(Math.random() * 10),
            stockx_default_sneakers_size: "All",
            OptanonConsent: new URLSearchParams([
                ["isGpcEnabled", "1"],
                ["datestamp", dayjs().format("ddd+MMM+DD+YYYY+HH%3Amm%3Ass+Z")],
                ["version", "6.36.0"],
                ["isIABGlobal", "false"],
                ["hosts", ""],
                ["consentId", "124f4404-36c7-437d-aeee-1b67d82251ee"],
                ["interactionCount", "1"],
                ["landingPath", "NotLandingPage"],
                ["groups", encodeURIComponent("C0001:1,C0002:1,C0005:1,C0004:1,C0003:1")]
            ]).toString(),
        }

        let cookie = "";
        for (const key in data) {
            cookie += `${key}=${data[key]}; `;
        }

        return cookie;
    }

    private _createConfig(): IConfig {
        const proxy = this.client.proxys.shift();
        this.client.proxys.push(proxy);

        const splitedProxy = proxy ? splitproxy(proxy) : undefined;

        return {
            httpsAgent: splitedProxy ? new HttpsProxyAgent({
                host: splitedProxy.host,
                port: splitedProxy.port,
                auth: splitedProxy.login && splitedProxy.password ? `${splitedProxy.login}:${splitedProxy.password}` : undefined
            }) : undefined,
            userAgent: new UserAgent().toString(),
            cookie: this.client.cookie ? this.client.cookie : this._createCookie()
        };
    }
}