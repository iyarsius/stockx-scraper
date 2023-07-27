import { HttpsProxyAgent } from "https-proxy-agent";

export interface IConfig {
    httpsAgent: HttpsProxyAgent | undefined;
    userAgent: string;
    cookie: string;
}