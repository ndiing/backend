const { default: fetch, Store } = require("../../lib/fetch");
const path = require("path");

class Service {
    constructor(options = {}) {
        const { userDataDir = "./data/name", profileDirectory = "default" } = options;
        const file = path.join(userDataDir, profileDirectory + ".min.json");
        this.store = new Store(file);
    }
    
    fetch(resource, options = {}) {
        return fetch(resource, {
            store: this.store,
            redirect: "manual",
            ...options,
            headers: { ...options.headers },
        });
    }
    
    async get(payload = {}) {
        try {
            const response = await this.fetch("http://google.com");
            const text = await response.text();
            return text;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service;
