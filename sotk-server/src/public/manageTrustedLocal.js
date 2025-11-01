function removeTrustedDomain(domain) {
    trustedDomainsService.removeTrustedDomain(domain);
    renderTrustedDomains();
}

function renderTrustedDomains() {
    const container = document.getElementById('trusted-domains-list');
    const domains = trustedDomainsService.getTrustedDomains();
    
    if (domains.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No personal trusted domains yet</p>
                <p>Trusted domains will skip the confirmation page when redirecting</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = domains.map(domain => `
        <div class="trusted-domain-item">
            <span>${domain}</span>
            <button class="remove-domain" onclick="removeTrustedDomain('${domain}')">Remove</button>
        </div>
    `).join('');
}

window.removeTrustedDomain = removeTrustedDomain;
window.renderTrustedDomains = renderTrustedDomains;
