const UserAgent = require('user-agents');
const splitProxy = require('split-proxy')

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
    agents: (proxy) => {
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

        console.log(proxy)
        if (proxy) axiosConfig.proxy = {
            host: proxy.host,
            port: proxy.port,
            auth: { username: proxy.login, password: proxy.password }
        };

        return axiosConfig
    }
}