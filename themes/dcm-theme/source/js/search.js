// 本地搜索功能（极简版，搜索结果浮动显示）
(function () {
  const searchInput = document.getElementById('search-input');
  const searchResult = document.getElementById('search-result');
  if (!searchInput || !searchResult) return;

  let searchData = [];
  const searchXmlPath = (searchInput.getAttribute('data-root') || '/') + 'search.xml';

  // 加载搜索数据
  fetch(searchXmlPath)
    .then(res => res.text())
    .then(str => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(str, 'text/xml');
      const entries = xml.getElementsByTagName('entry');
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        searchData.push({
          title: (e.getElementsByTagName('title')[0] || {}).textContent || '',
          url:   (e.getElementsByTagName('url')[0] || {}).textContent || '',
          content: (e.getElementsByTagName('content')[0] || {}).textContent || '',
        });
      }
    })
    .catch(err => console.error('搜索数据加载失败:', err));

  // 执行搜索
  function doSearch(keyword) {
    if (!keyword || keyword.trim() === '') {
      searchResult.innerHTML = '<p class="search-empty">输入关键词开始搜索</p>';
      searchResult.classList.add('active');
      return;
    }
    const kw = keyword.toLowerCase();
    const results = searchData.filter(item =>
      item.title.toLowerCase().includes(kw) ||
      item.content.toLowerCase().includes(kw)
    );
    if (results.length === 0) {
      searchResult.innerHTML = '<p class="search-empty">没有找到相关结果</p>';
      searchResult.classList.add('active');
      return;
    }
    searchResult.innerHTML = results.map(item => {
      const excerpt = item.content.substring(0, 100) + '...';
      return `<div class="search-item">
        <a href="${item.url}">${item.title}</a>
        <p class="search-excerpt">${excerpt}</p>
      </div>`;
    }).join('');
    searchResult.classList.add('active');
  }

  // 隐藏搜索结果
  function hideSearchResult() {
    searchResult.classList.remove('active');
  }

  // 回车搜索
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      doSearch(searchInput.value);
    }
  });

  // 输入即搜索（≥2 字时触发，300ms 防抖）
  let timer;
  searchInput.addEventListener('input', function () {
    clearTimeout(timer);
    if (searchInput.value.length >= 2) {
      timer = setTimeout(() => doSearch(searchInput.value), 300);
    } else if (searchInput.value.length === 0) {
      searchResult.innerHTML = '<p class="search-empty">输入关键词开始搜索</p>';
      searchResult.classList.add('active');
    }
  });

  // 点击输入框时显示搜索提示
  searchInput.addEventListener('focus', function () {
    if (searchInput.value.length === 0) {
      searchResult.innerHTML = '<p class="search-empty">输入关键词开始搜索</p>';
      searchResult.classList.add('active');
    } else if (searchInput.value.length >= 2) {
      doSearch(searchInput.value);
    }
  });

  // 点击其他地方时隐藏搜索结果
  document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResult.contains(e.target)) {
      hideSearchResult();
    }
  });
})();
