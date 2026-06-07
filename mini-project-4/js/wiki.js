const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

const stripHtml = (html) => {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
};

const highlight = (str, keyword, className = "highlight") => {
    const hl = `<span class = "${className}" style="background-color: yellow; font-weight: bold;">${keyword}</span>`;
    return str.replace(new RegExp(keyword, 'gi'), hl);
};

const generateSearchResultHTML = (results, searchTerm) => {
    return results.map(result => {
        const title = highlight(stripHtml(result.title), searchTerm);
        const snippet = highlight(stripHtml(result.snippet), searchTerm);

        return `<article style="margin-top: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank" style="text-decoration: none; color: #1a0dab;">
        <h3 style="margin-bottom: 5px;">${title}</h3>
        </a>
        <div class="summary" style="color: #4d5156; font-size: 14px;">${snippet}...</div>
        </article>`;
    }).join('');
};

const doSearch = async (searchTerm, resultElem) => {
    if (!searchTerm) {
        resultElem.innerHTML = '';
        return;
    }

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(searchTerm)}`;

        const response = await fetch(url);
        const searchResults = await response.json();
        const searchResultHtml = generateSearchResultHTML(searchResults.query.search, searchTerm);
        resultElem.innerHTML = searchResultHtml;
    } catch (error) {
        console.log(error);
        resultElem.innerHTML = '<p class="w3-text-red">Đã có lỗi xảy ra khi tìm kiếm.</p>';
    }
};

const initWikiSearch = () => {
    const searchInputs = document.querySelectorAll('.wikiSearchTerm');
    searchInputs.forEach(input => {
        if (!input.dataset.initialized) {
            input.dataset.initialized = 'true';

            const resultElem = input.closest('.wiki-search-container').querySelector('.wikiSearchResult');

            const searchFn = debounce(async (event) => {
                await doSearch(event.target.value, resultElem);
            });

            input.addEventListener('input', searchFn);
        }
    });
};