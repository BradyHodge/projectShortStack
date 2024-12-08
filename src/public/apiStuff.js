let currentShortCode = '';

        document.getElementById('shortenForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalUrl = document.getElementById('originalUrl').value;
            
            try {
                const response = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ originalUrl })
                });

                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('results').classList.remove('hidden');
                    document.getElementById('shortUrl').value = data.shortUrl;
                    currentShortCode = data.shortCode;
                    fetchStats(data.shortCode);
                } else {
                    alert(data.error || 'Error shortening URL');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error shortening URL');
            }
        });

        async function fetchStats(shortCode) {
            try {
                const response = await fetch(`/api/stats/${shortCode}`);
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('statsSection').classList.remove('hidden');
                    document.getElementById('clickCount').textContent = data.clicks;
                    document.getElementById('createdAt').textContent = new Date(data.createdAt).toLocaleDateString();
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        }

        function copyToClipboard() {
            const shortUrlInput = document.getElementById('shortUrl');
            shortUrlInput.select();
            document.execCommand('copy');
            
            const copyButton = shortUrlInput.nextElementSibling;
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }

        setInterval(() => {
            if (currentShortCode) {
                fetchStats(currentShortCode);
            }
        }, 30000);