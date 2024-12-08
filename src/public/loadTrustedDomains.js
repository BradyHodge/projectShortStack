const TRUSTED_DOMAINS_KEY = 'trusted-domains';
        
        function getTrustedDomains() {
            const domains = localStorage.getItem(TRUSTED_DOMAINS_KEY);
            return domains ? JSON.parse(domains) : [];
        }

        function addTrustedDomain(domain) {
            const domains = getTrustedDomains();
            if (!domains.includes(domain)) {
                domains.push(domain);
                localStorage.setItem(TRUSTED_DOMAINS_KEY, JSON.stringify(domains));
            }
        }

        window.onload = function() {
            const params = new URLSearchParams(window.location.search);
            const destination = params.get('destination');
            const shortCode = params.get('shortCode');
            
            if (destination) {
                const decodedUrl = decodeURIComponent(destination);
                const domain = new URL(decodedUrl).hostname;
                
                if (getTrustedDomains().includes(domain)) {
                    window.location.href = `/r/${shortCode}`;
                    return;
                }

                document.getElementById('destination-url').textContent = decodedUrl;
                document.getElementById('proceed-button').href = `/r/${shortCode}`;

                const checkbox = document.getElementById('trust-domain');
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        addTrustedDomain(domain);
                    }
                });
            }
        };