window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get('destination');
    const shortCode = params.get('shortCode');
    
    if (destination) {
        const decodedUrl = decodeURIComponent(destination);
        const domain = new URL(decodedUrl).hostname;
        
        if (trustedDomainsService.getTrustedDomains().includes(domain)) {
            window.location.href = `/r/${shortCode}`;
            return;
        }
        
        document.getElementById('destination-url').textContent = decodedUrl;
        document.getElementById('proceed-button').href = `/r/${shortCode}`;
        
        const checkbox = document.getElementById('trust-domain');
        checkbox.checked = trustedDomainsService.getTrustedDomains().includes(domain);
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                trustedDomainsService.addTrustedDomain(domain);
            } else {
                trustedDomainsService.removeTrustedDomain(domain);
            }
        });
    }
};
