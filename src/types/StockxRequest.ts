import { HttpsProxyAgent } from "https-proxy-agent";

export interface IConfig {
    httpsAgent: HttpsProxyAgent
    userAgent: string;
    cookie: string;
}