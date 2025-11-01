let TRUSTED_DOMAINS_KEY = 'trusted-domains';

window.trustedDomainsService = {
    getTrustedDomains() {
        const domains = localStorage.getItem(TRUSTED_DOMAINS_KEY);
        return domains ? JSON.parse(domains) : [];
    },

    addTrustedDomain(domain) {
        const domains = this.getTrustedDomains();
        if (!domains.includes(domain)) {
            domains.push(domain);
            localStorage.setItem(TRUSTED_DOMAINS_KEY, JSON.stringify(domains));
        }
    },

    removeTrustedDomain(domain) {
        const domains = this.getTrustedDomains();
        const updatedDomains = domains.filter(d => d !== domain);
        localStorage.setItem(TRUSTED_DOMAINS_KEY, JSON.stringify(updatedDomains));
        return updatedDomains;
    }
};
