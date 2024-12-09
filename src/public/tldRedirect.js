(function() {
        const currentUrl = window.location.href;
    
        if (!currentUrl.includes('shortstack.cc')) {
                const path = window.location.pathname;
                const queryParams = window.location.search;
                const hashFragment = window.location.hash;
                const newUrl = 'https://shortstack.cc' + path + queryParams + hashFragment;
                window.location.href = newUrl;
    }
})();