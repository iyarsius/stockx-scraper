export type IClientCurrencyCode = "EUR" | "USD" | "AUD" | "CHF" | "CAD" | "GBP" | "HKD" | "JPY";
export type IClientCountryCode = "AL" | "DZ" | "AS" | "AD" | "AG" | "AR" | "AU" | "AT" | "BS" | "BH" | "BB" | "BE" | "BZ" | "BM" | "BA" | "BW" | "BR" | "BG" | "CA" | "KY" | "CL" | "CN" | "CO" | "CR" | "HR" | "CY" | "CZ" | "DK" | "DM" | "DO" | "EC" | "SV" | "EE" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "GE" | "DE" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU" | "GT" | "GG" | "HN" | "HK" | "HU" | "IS" | "IN" | "ID" | "IE" | "IL" | "IT" | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KW" | "LV" | "LS" | "LI" | "LT" | "LU" | "MO" | "MW" | "MY" | "MT" | "MQ" | "MU" | "MX" | "MC" | "MA" | "MZ" | "NL" | "NC" | "NZ" | "NI" | "MP" | "NO" | "OM" | "PW" | "PA" | "PE" | "PH" | "PL" | "PT" | "PR" | "QA" | "RE" | "RO" | "SA" | "SN" | "RS" | "SC" | "SG" | "SK" | "SI" | "ZA" | "KR" | "ES" | "KN" | "LC" | "SE" | "CH" | "TW" | "TH" | "TC" | "AE" | "GB" | "US" | "UY" | "VI" | "VA" | "VE" | "VN";
export type IClientLanguageCode = "EN" | "DE" | "FR" | "ES" | "IT" | "NL" | "PL" | "PT" | "RU" | "TR" | "ZH" | "JA" | "KO" | "AR" | "HE" | "HI" | "ID" | "MS" | "TH" | "VI";

export interface IClientOptions {
    currencyCode: IClientCurrencyCode;
    countryCode: IClientCountryCode;
    languageCode: IClientLanguageCode;
    proxys?: string[];
    cookie?: string;
}

export interface ISearchOptions {
    filtersVersion?: number;
    page?: {
        index: number;
        limit: number;
    };
    query: string;
    sort?: {
        id: "featured",
        order: "DESC" | "ASC",
    };
    staticRanking?: {
        enabled: boolean;
    }
}