const TRUSTED_DOMAINS_KEY = 'trusted-domains';
        
        function getTrustedDomains() {
            const domains = localStorage.getItem(TRUSTED_DOMAINS_KEY);
            return domains ? JSON.parse(domains) : [];
        }

        function removeTrustedDomain(domain) {
            const domains = getTrustedDomains();
            const updatedDomains = domains.filter(d => d !== domain);
            localStorage.setItem(TRUSTED_DOMAINS_KEY, JSON.stringify(updatedDomains));
            renderTrustedDomains();
        }

        function renderTrustedDomains() {
            const container = document.getElementById('trusted-domains-list');
            const domains = getTrustedDomains();
            
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

        function openTrustedDomains() {
            renderTrustedDomains();
            document.getElementById('trusted-domains-modal').style.display = 'block';
        }

        function closeTrustedDomains() {
            document.getElementById('trusted-domains-modal').style.display = 'none';
        }
        window.onclick = function(event) {
            const modal = document.getElementById('trusted-domains-modal');
            if (event.target === modal) {
                closeTrustedDomains();
            }
        };