// 采用yaml文件加载数据
async function fetchSectionsData() {
    const response = await fetch('/data/webstack.yml');
    const textData = await response.text();
    return jsyaml.load(textData); // 使用 js-yaml 解析 YML 文件
}

function generateCards(containerId, cards) {
    const container = document.querySelector(`#${containerId} .row.io-mx-n2.ajax-list-body`);
    container.innerHTML = ''; // 清空内容
    cards.forEach(card => {
        const cardHTML = `
            <div class="url-card col-6 col-sm-6 col-md-4 col-xl-5a col-xxl-6a">
                <div class="url-body default">
                    <a href="${card.url}" target="_blank" class="card no-c mb-4" data-toggle="tooltip" data-placement="bottom" title="${card.title}">
                        <div class="card-body">
                            <div class="url-content d-flex align-items-center">
                                <div class="url-img mr-2 d-flex align-items-center justify-content-center">
                                    <img class="lazy" src="assets/images/logos/${card.logo}" data-src="assets/images/logos/${card.logo}" onerror="this.src='assets/images/logos/default.webp'" alt="${card.title}">
                                </div>
                                <div class="url-info flex-fill">
                                    <div class="text-sm overflowClip_1">
                                        <strong>${card.title}</strong>
                                    </div>
                                    <p class="overflowClip_1 m-0 text-muted text-xs">${card.description}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <a href="${card.url}" class="togo text-center text-muted is-views" data-toggle="tooltip" data-placement="right" title="直达" rel="nofollow">
                        <i class="iconfont icon-goto"></i>
                    </a>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function generateSection(headerId, section, containerId) {
    const sectionHTML = `
        <div>
            <h4 id="${headerId}" class="text-gray text-lg mb-4">
                <i class="site-tag iconfont icon-tag icon-lg mr-1"></i>
                <span>${section.taxonomy}</span>
            </h4>
            <div class="d-flex flex-fill flex-tab align-items-center">
                <div class='slider_menu mini_tab ajax-list-home' sliderTab="sliderTab" data-id="${headerId}">
                    <ul class="nav nav-pills tab-auto-scrollbar menu overflow-x-auto" role="tablist">
                        ${section.list.map((term, index) => `
                            <li class="pagenumber nav-item" data-id="${headerId}-${index}">
                                <a class="nav-link ${index === 0 ? 'active' : ''}" data-toggle="pill" href="#tab-${headerId}-${index}" data-id="${headerId}-${index}">${term.term}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="flex-fill"></div>
            </div>
            <div class="tab-content mt-4">
                ${section.list.map((term, index) => `
                    <div id="tab-${headerId}-${index}" class="tab-pane ${index === 0 ? 'active' : ''}">
                        <div class="row io-mx-n2 ajax-list-body"></div>
                        <div class="loading-spinner" id="spinner-${headerId}-${index}">Loading...</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById(containerId).insertAdjacentHTML('beforeend', sectionHTML);

    section.list.forEach((term, index) => {
        if (index === 0) {
            generateCards(`tab-${headerId}-${index}`, term.links);
        }
    });

    document.querySelectorAll(`[data-id^="${headerId}-"] .nav-link`).forEach(tabLink => {
        tabLink.addEventListener('click', async event => {
            event.preventDefault();
            const targetId = tabLink.getAttribute('data-id');
            const tabPaneId = `tab-${targetId}`;
            const spinner = document.getElementById(`spinner-${targetId}`);
            
            // 取消所有选项卡的激活状态
            document.querySelectorAll(`[data-id^="${headerId}-"] .nav-link`).forEach(link => {
                link.classList.remove('active');
            });

            // 激活当前选项卡
            tabLink.classList.add('active');

            // 隐藏所有选项卡内容
            document.querySelectorAll(`[id^="tab-${headerId}-"]`).forEach(pane => {
                pane.classList.remove('active');
            });

            // 显示当前选项卡内容
            document.getElementById(tabPaneId).classList.add('active');

            // 显示加载指示器
            spinner.classList.add('active');

            // 模拟加载延迟
            setTimeout(() => {
                generateCards(tabPaneId, section.list[parseInt(targetId.split('-')[1])].links);
                spinner.classList.remove('active');
            }, 500);
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const sectionsData = await fetchSectionsData();
    document.querySelectorAll('[id^="dynamic-content-container"]').forEach(container => {
        const headerId = container.getAttribute('headerId');
        if (headerId && sectionsData.some(section => section.taxonomy === headerId)) {
            const section = sectionsData.find(section => section.taxonomy === headerId);
            generateSection(headerId, section, container.id);
        }
    });
});
