/**
 * @author lingbopro
 * Online News Feature
 */

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

var news = {
    sources: [
        {
            name: 'Oriental News',
            description: 'Oriental News Headlines (using public API)',
            url: 'https://tools.mgtv100.com/external/v1/toutiao/index',
            async getData() {
                try {
                    const response = await fetch(this.url);
                    const data = await response.json();
                    if (!(data.status === 'success' && data.code === 200)) {
                        return {
                            status: 'error',
                            message: 'Response does not contain success information',
                        };
                    }
                    const list = data.data.result.data.map((value) => {
                        return {
                            title: value.title,
                            author: value.author_name,
                            category: value.category,
                            url: value.url,
                            image: value.thumbnail_pic_s,
                        };
                    });
                    return {
                        status: 'success',
                        data: list,
                    };
                } catch (error) {
                    return {
                        status: 'error',
                        error: error,
                    };
                }
            },
        },
        {
            name: 'Zhihu Daily News',
            description: 'Zhihu Daily News (using public API)',
            url: 'https://v.api.aa1.cn/api/zhihu-news/index.php?aa1=xiarou',
            async getData() {
                try {
                    const response = await fetch(this.url);
                    const data = await response.json();
                    const list = data.news.map((value) => {
                        return {
                            title: value.title,
                            hint: value.hint,
                            url: value.url,
                            image: value.image,
                        };
                    });
                    return {
                        status: 'success',
                        data: list,
                    };
                } catch (error) {
                    return {
                        status: 'error',
                        error: error,
                    };
                }
            },
        },
    ],
    setupExecuted: false,
    selectedSource: 0,
    setup() {
        if (this.setupExecuted) {
            return;
        }
        const sourcesListSelectInnerListHtml = this.sources
            .map((value, index) => {
                return `<a class="a" onclick="closenotice(); news.setSource(${index})" win12_title="${value.description}">${value.name}</a>`;
            })
            .join('\n');
        nts['widgets.news.source'].cnt = `
                <p class="tit">Switch News Source</p>
                <list class="new">
                    ${sourcesListSelectInnerListHtml}
                </list>`;
        this.refresh();
        this.setupExecuted = true;
    },
    setSource(index) {
        this.selectedSource = index;
        this.refresh();
    },
    async refresh() {
        const contentEl = document.querySelector('#widgets>.news>.content');
        const contentNewsEl = document.querySelector('#widgets>.news>.content>.news-all');
        this.setFullTip(false, true, 'Loading...');
        contentNewsEl.innerHTML = '';
        const data = await this.sources[this.selectedSource].getData();
        if (data.status !== 'success') {
            this.setFullTip(
                false,
                false,
                'Load Failed',
                'Unable to load news.\nPlease check your network settings or try changing the news source later.',
                'Details: ' + (data.error ? data.error.message : data.message ? data.message : 'Unknown')
            );
            return;
        }
        const genCardHTML = async (data, classList = '') => {
            return `
<div class="card ${classList}" style="background: url(${data.image}) right;">
    <p class="tit">${await this.parseToHTMLString(data.title)}</p>
    <a class="a" onclick="openapp(\'edge\');window.setTimeout(() => {apps.edge.newtab();apps.edge.goto('${data.url}');}, 300);">Details &gt;</a>
</div>
`;
        };
        const topNews = data.data.shift();
        const topNewsHTML = await genCardHTML(topNews, 'top-news');
        let contentNews = [''];
        for (let i = 0; i < data.data.length; i++) {
            const current = data.data[i];
            const html = await genCardHTML(current, i % 2 == 0 ? 'card-left' : 'card-right');
            contentNews.push(html);
            // Without wait there is serious lag, not sure why
            await wait(1);
        }
        let contentNewsHTML = '';
        for (let i = 0; i < contentNews.length; i += 2) {
            contentNewsHTML += `
<div class="line">${contentNews[i]}${i + 1 < contentNews.length ? contentNews[i + 1] : ''}</div>`;
            await wait(1);
        }
        contentEl.innerHTML = `
${topNewsHTML}
<div class="news-all">
${contentNewsHTML}
</div>
`;
        this.setFullTip(true);
    },
    setFullTip(hidden = true, loading = false, tit = '', desc = '', data = '') {
        let fullTipEl = document.querySelector('#widgets>.news>.full-tip');
        fullTipEl.querySelector('loading').hidden = !loading;
        fullTipEl.querySelector('.tit').innerText = tit;
        fullTipEl.querySelector('.desc').innerText = desc;
        fullTipEl.querySelector('.info').innerText = data;
        if (hidden) {
            fullTipEl.classList.add('hidden');
        } else {
            fullTipEl.classList.remove('hidden');
        }
    },
    async parseToHTMLString(str) {
        let element = document.createElement('span');
        element.innerText = str;
        return element.innerHTML;
    },
};
