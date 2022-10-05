import { HttpsProxyAgent } from "https-proxy-agent";
import { AxiosProxyConfig } from "iyaxios";

export interface IEntity {
    httpsAgent: HttpsProxyAgent
    userAgent: string;
    cookie: string;
}