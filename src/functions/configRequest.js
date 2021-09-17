const UserAgent = require('user-agents');
const splitProxy = require('split-proxy');

// Internal function filtering proxy and proxylist
const _setProxy = (proxy) => {
    proxy = typeof proxy === "string" ? splitProxy(proxy) : proxy

    if (proxy.list) proxy = proxy.use()

    return proxy = {
        host: proxy.host,
        port: proxy.port,
        auth: { username: proxy.login, password: proxy.password }
    };
}

// Internal function converting Object to cookie string format.
const _setCookie = (cookieObject) => {
    let cookie = ""
    for (const key in cookieObject) {
        const atr = `${key}=${cookieObject[key]}; `
        cookie = cookie + atr
    }
    return cookie
}

module.exports = {
    ProxyList: class {
        /**
        * @param {Array} list List every proxy with format: http://host:port@username:password
        */
        constructor(list = []) {
            if (!list[0]) throw SyntaxError('Missing list')
            this.list = list.map(url => splitProxy(url)),
                this.current = this.list[0]
            this.use = () => {
                const used = this.list.shift();
                this.current = this.list[0];
                this.list.push(used)
                return this.current
            }
        }
    },

    // Load axios params for search and getProduct requests
    searchAndGetProduct: (proxy) => {
        const userAgent = new UserAgent();

        const axiosConfig = {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1",
                "user-agent": userAgent.toString()
            },
        }

        if (proxy) axiosConfig.proxy = _setProxy(proxy)

        return axiosConfig
    },

    // Load axios params for related products requests
    fetchRelatedProducts: (product, proxy, cookie) => {
        const userAgent = new UserAgent();

        const date = Date.now()
        const graphqlClientDate = new Date().toISOString().split('T')[0].replace('-', '.')


        const axiosConfig = {
            headers: {
                "authority": "stockx.com",
                "method": "POST",
                "path": "/api/graphql",
                "scheme": "https",
                "accept": "*/*",
                'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                'apollographql-client-name': 'Iron',
                'apollographql-client-version': graphqlClientDate,
                'content-length': 1233,
                'content-type': 'application/json',
                'cookie': cookie ? cookie : _setCookie({
                    stockx_homepage: "sneakers",
                    stockx_experiments_id: "web-985b691d-fcdd-4b2f-9323-5d0e4b64ef2d",
                    language_code: "en",
                    stockx_market_country: "FR",
                    pxcts: "1dc1cf00-169d-11ec-a806-23ebea6bef8b",
                    _pxvid: "1dc17a91-169d-11ec-8411-487746767177",
                    _px_f394gi7Fvmc43dfg_user_id: "MWZkNzQxODAtMTY5ZC0xMWVjLThhODUtOTdmMTQ5ZGEwNDhi",
                    _gcl_au: "1.1.1155215511.1631762637",
                    stockx_preferred_market_activity: "sales",
                    _fbp: "fb.1.1631762641848.156261706",
                    IR_gbd: "stockx.com",
                    _rdt_uuid: "1631762642621.940b726c-9d3f-4461-9fb8-73cb8939079c",
                    _scid: "c53b4b17-341b-4e1b-af09-58fafb14cd17",
                    __pdst: "71a8b1f74feb4b10b2ce64e71476f59a",
                    __ssid: "9dd5883029990e839d6c8acc1a36bce",
                    rskxRunCookie: 0,
                    rCookie: "1gtpryxdk18hhwsrl7o9v6pktmdcja0",
                    QuantumMetricSessionID: "79a9ea16bae889ec04156938c92a69db",
                    QuantumMetricUserID: "d45660deacc1312f0197166eac82d689",
                    stockx_dismiss_modal: true,
                    stockx_dismiss_modal_set: "2021-09-16T03%3A32%3A19.212Z",
                    stockx_dismiss_modal_expiration: "2021-09-23T03%3A32%3A19.210Z",
                    cookie_policy_accepted: true,
                    _ga: "GA1.2.1496655354.1631765801",
                    _gid: "GA1.2.1992914963.1631765801",
                    ajs_group_id: "ab_bottom_nav_pdp_android.neither%2Cab_buy_order_status_reskin_android.niether%2Cab_checkout_review_order_verbiage_android.neither%2Cab_checkout_review_purchase_verbiage_android.neither%2Cab_chk_place_order_verbage_web.true%2Cab_chk_review_order_verbage_web.true%2Cab_desktop_home_hero_section_web.control%2Cab_enable_eu_vat_collection_ios.true%2Cab_eu_vat_android.true%2Cab_ios_localized_low_inv_checkout_v3.neither%2Cab_low_inv_badge_expansion_web.true%2Cab_low_inventory_badge_copy_pdp_ios.neither%2Cab_low_inventory_expansion_v2_android.neither%2Cab_new_restock_pdp_android.true%2Cab_pirate_buy_now_web.true%2Cab_pirate_payment_reorder_web.false%2Cab_product_page_refactor_android_v5.neither%2Cab_product_page_refactor_web.true%2Cab_product_size_chart_ios.true%2Cab_rage_click_web.true%2Cab_recently_viewed_pdp_ios.neither%2Cab_refactor_selling_payment_android.neither%2Cab_sell_button_color_ios.dummy%2Cab_seller_profile_redesign_android.false%2Cab_suggested_addresses_android.neither%2Cab_test_korean_language_web.true%2Cab_vertical_picker_home_ios.dummy%2Cab_web_tfc_cnsld_aa.d1",
                    ajs_anonymous_id: "a5ae48e6-90a9-4a21-8fa1-d81851876c2a",
                    stockx_product_visits: Math.floor(Math.random() * 10),
                    stockx_session: "4fcd2fb0-4fe5-415b-b2ed-0b87a2bacbbf",
                    stockx_default_sneakers_size: "All",
                    _px3: "e8dcdc230f0121f172888264c17d3a52bc6475202111469faba7b161f303f61c:+USE1G1peUQhdUVg7zykoYBRfCNP1OZgHyu1TYfGOK/lZFcPgKPoY0qXnE0XW8rjnUd06yVPgSMM0qAIRX7+uQ==:1000:4/ieo98UoKJzF4iYZh8AN6zTq8PlR6huHCVfqx9EGZtIy707091sQUv4s4U+4D+i2HV0mIwiJRLHm2Qym6KoszoANMpyPT56QMCtQ1jOmARr4Tx76TihcgLD17KouUTsZzidCyZEBCL8nWrheAPUz21k8H7iWaaECetqJ/skTGmRcjo8Ymh0TOLBZaUyMI+saw/QF45d6c8gsneW47IJfA==",
                    riskified_recover_updated_verbiage: true,
                    ops_banner_id: "blteaa2251163e21ba6",
                    forterToken: `831776c4243947688e35e04e3f3aefc8_${date}__UDF43b_13ck`,
                    lastRskxRun: Math.floor(date - Math.random() * 5000 + 4000),
                    IR_9060: `${date}%7C0%7C${date}%7C%7C`,
                    IR_PI: `8b270713-169d-11ec-aa8d-4dc937371914%7C${date}`,
                    _px_7125205957_cs: "eyJpZCI6IjFmZDYzMDEwLTE2OWQtMTFlYy04YTg1LTk3ZjE0OWRhMDQ4YiIsInN0b3JhZ2UiOnt9LCJleHBpcmF0aW9uIjoxNjMxNzY5NjgyNzA1fQ==",
                    _dd_s: `rum=0&expire=${date}`,
                    _gat: "1",
                    _uetsid: "8a1eb150169d11ec8098390704a6935e",
                    _uetvid: "8a1f1000169d11ec92fc7bd36583c916"
                }),
                'origin': 'https://stockx.com',
                'referer': product.url,
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': 1,
                'user-agent': userAgent.toString()
            }
        }

        if (proxy) axiosConfig.proxy = _setProxy(proxy)

        return axiosConfig
    }
}