// ========== APP LOGIC ==========
var currentCategory = 'all';
var selectedItems = [];

function init() { 
    renderCategoryGrid(); 
    renderResults(faqData); 
    document.getElementById('searchInput').addEventListener('input', performSearch); 
}

function renderCategoryGrid() {
    var container = document.getElementById('categoryGrid');
    var html = '';
    
    categoryOrder.forEach(function(cat) {
        if (cat === 'all') {
            html += '<div class="cat-card active" onclick="filterCategory(\'all\')"><span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="#A8C8B8" opacity="0.6"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="#B8D4E3" opacity="0.6"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="#D5CFE1" opacity="0.6"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="#F2DFE0" opacity="0.6"/><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#7A6B5D" stroke-width="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#7A6B5D" stroke-width="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#7A6B5D" stroke-width="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#7A6B5D" stroke-width="1.2"/></svg></span><div class="name">전체</div><div class="count">' + faqData.length + '개</div></div>';
        } else {
            var count = faqData.filter(item => item.category === cat).length;
            html += '<div class="cat-card" onclick="filterCategory(\'' + cat + '\')"><span class="icon">' + categoryIcons[cat] + '</span><div class="name">' + categoryNames[cat] + '</div><div class="count">' + count + '개</div></div>';
        }
    });
    container.innerHTML = html;
}

function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.cat-card').forEach(function(card) { card.classList.remove('active'); });
    event.target.closest('.cat-card').classList.add('active');
    var title = category === 'all' ? '전체 항목' : categoryNames[category];
    document.getElementById('currentCatTitle').innerHTML = title;
    
    var floatingContainer = document.getElementById('floatingBtnContainer');
    if (category === 'charting') {
        floatingContainer.classList.add('show');
    } else {
        floatingContainer.classList.remove('show');
        selectedItems = [];
        updateCopyCount();
    }
    
    performSearch();
}

// 초성 검색 관련
var CHO_SUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function getChosung(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i) - 44032;
        if (code >= 0 && code <= 11171) {
            result += CHO_SUNG[Math.floor(code / 588)];
        } else {
            result += str[i];
        }
    }
    return result;
}

function isAllChosung(str) {
    for (var i = 0; i < str.length; i++) {
        if (!CHO_SUNG.includes(str[i]) && str[i] !== ' ') return false;
    }
    return true;
}

function performSearch() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();
    var results = faqData.filter(function(item) {
        var matchCategory = currentCategory === 'all' || item.category === currentCategory;
        if (!searchTerm) return matchCategory;
        
        var normalMatch = item.question.toLowerCase().includes(searchTerm) || item.answer.toLowerCase().includes(searchTerm);
        var chosungMatch = isAllChosung(searchTerm) && (getChosung(item.question).includes(searchTerm) || getChosung(item.answer).includes(searchTerm));
        
        return matchCategory && (normalMatch || chosungMatch);
    });
    renderResults(results, searchTerm);
}

// 검색어 하이라이트
function highlightText(text, term) {
    if (!term || isAllChosung(term)) return text;
    var tags = [], i = 0;
    text = text.replace(/<[^>]+>/g, function(m) { tags.push(m); return '###TAG'+(i++)+'###'; });
    text = text.replace(new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'), '<span class="search-highlight">$1</span>');
    return text.replace(/###TAG(\d+)###/g, function(m, idx) { return tags[parseInt(idx)]; });
}

function renderResults(results, searchTerm) {
    var container = document.getElementById('resultsList');
    document.getElementById('resultCount').textContent = results.length + '개 항목';
    if (results.length === 0) { 
        container.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">🔍 검색 결과가 없습니다</div>'; 
        return; 
    }
    var html = '';
    results.forEach(function(item, idx) {
        var questionContent = searchTerm ? highlightText(item.question, searchTerm) : item.question;
        var answerContent = searchTerm ? highlightText(item.answer, searchTerm) : item.answer;
        answerContent = replaceEmojisWithIcons(answerContent);
        if (item.category === 'charting') {
            answerContent = convertToCheckboxList(answerContent, idx);
        }
        html += '<div class="result-item" onclick="toggleItem(this, event)"><div class="item-header"><div class="item-icon">' + categoryIcons[item.category] + '</div><div class="item-info"><span class="item-cat">' + categoryNames[item.category] + '</span><div class="item-q">' + questionContent + '</div></div><div class="item-toggle">▼</div></div><div class="item-content"><div class="item-body">' + answerContent + '</div></div></div>';
    });
    container.innerHTML = html;
    
    if (currentCategory === 'charting') {
        restoreSelections();
    }
}

function replaceEmojisWithIcons(html) {
    Object.keys(subIcons).forEach(function(emoji) {
        var regex = new RegExp(emoji, 'g');
        html = html.replace(regex, subIcons[emoji]);
    });
    return html;
}

function convertToCheckboxList(html, questionIdx) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var lists = doc.querySelectorAll('ul');
    
    lists.forEach(function(ul, listIdx) {
        var items = ul.querySelectorAll('li');
        var newHtml = '';
        items.forEach(function(li, itemIdx) {
            var itemId = 'charting_' + questionIdx + '_' + listIdx + '_' + itemIdx;
            var text = li.textContent.trim();
            newHtml += '<div class="charting-item" data-id="' + itemId + '" data-text="' + escapeHtml(text) + '" onclick="toggleCharting(this, event)"><div class="charting-checkbox"></div><div class="charting-text">' + li.innerHTML + '</div></div>';
        });
        ul.outerHTML = '<div class="charting-list">' + newHtml + '</div>';
    });
    
    return doc.body.innerHTML;
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleItem(element, event) {
    if (event.target.closest('.charting-item')) return;
    element.classList.toggle('open');
}

function toggleCharting(element, event) {
    event.stopPropagation();
    element.classList.toggle('checked');
    
    var itemId = element.getAttribute('data-id');
    var itemText = element.getAttribute('data-text');
    
    if (element.classList.contains('checked')) {
        if (!selectedItems.find(item => item.id === itemId)) {
            selectedItems.push({ id: itemId, text: itemText });
        }
    } else {
        selectedItems = selectedItems.filter(item => item.id !== itemId);
    }
    
    updateCopyCount();
}

function restoreSelections() {
    selectedItems.forEach(function(item) {
        var el = document.querySelector('[data-id="' + item.id + '"]');
        if (el) el.classList.add('checked');
    });
}

function updateCopyCount() {
    document.getElementById('copyCount').textContent = selectedItems.length;
}

function resetSelections() {
    selectedItems = [];
    document.querySelectorAll('.charting-item.checked').forEach(function(el) {
        el.classList.remove('checked');
    });
    updateCopyCount();
    showToast('선택이 초기화되었습니다');
}

function copySelectedItems() {
    if (selectedItems.length === 0) {
        showToast('선택된 항목이 없습니다');
        return;
    }
    
    var textToCopy = selectedItems.map(item => item.text).join('\n');
    
    navigator.clipboard.writeText(textToCopy).then(function() {
        showToast(selectedItems.length + '개 항목이 복사되었습니다');
    }).catch(function(err) {
        var textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(selectedItems.length + '개 항목이 복사되었습니다');
    });
}

function showToast(message) {
    var toast = document.getElementById('copyToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2000);
}

// 글자 크기 조절
function setFontSize(size) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add('font-' + size);
    document.querySelectorAll('.font-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-size') === size);
    });
    localStorage.setItem('fontSize', size);
}

// 초기화 시 저장된 글자 크기 적용
var _init = init;
init = function() {
    _init();
    var saved = localStorage.getItem('fontSize');
    if (saved) setFontSize(saved);
};

document.addEventListener('DOMContentLoaded', init);
