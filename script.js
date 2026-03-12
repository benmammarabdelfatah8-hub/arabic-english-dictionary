// ===== العناصر الأساسية =====
const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestionsBox');
const resultsContainer = document.getElementById('resultsContainer');
const noResults = document.getElementById('noResults');
const loading = document.getElementById('loading');
const clearSearch = document.getElementById('clearSearch');
const themeToggle = document.getElementById('themeToggle');
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesModal = document.getElementById('favoritesModal');
const closeModal = document.getElementById('closeModal');
const favoritesList = document.getElementById('favoritesList');
const favCount = document.getElementById('favCount');

// ===== المتغيرات العامة =====
let favorites = JSON.parse(localStorage.getItem('dictionary_favorites')) || [];
let searchHistory = JSON.parse(localStorage.getItem('dictionary_history')) || [];
let debounceTimer;

// ===== تهيئة الموقع =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateStats();
    loadFavorites();
    
    // عرض كلمة اليوم
    const wordOfDay = getWordOfTheDay();
    document.getElementById('todayWord').textContent = wordOfDay.arabic || wordOfDay.english;
});

// ===== الوضع الليلي =====
function initTheme() {
    const savedTheme = localStorage.getItem('dictionary_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dictionary_theme', next);
    updateThemeIcon(next);
    showToast(`تم تفعيل الوضع ${next === 'dark' ? 'الليلي' : 'النهاري'} ✨`);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ===== البحث الذكي =====
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    // إخفاء زر المسح إذا كان الحقل فارغاً
    clearSearch.classList.toggle('hidden', !query);
    
    // إخفاء الاقتراحات إذا كان الحقل فارغاً
    if (!query) {
        suggestionsBox.classList.add('hidden');
        return;
    }
    
    // Debounce لتحسين الأداء
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        performSearch(query);
        showSuggestions(query);
    }, 150);
});

clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    suggestionsBox.classList.add('hidden');
    resultsContainer.innerHTML = '';
    noResults.classList.add('hidden');
    clearSearch.classList.add('hidden');
});

// ===== عرض الاقتراحات =====
function showSuggestions(query) {
    const matches = dictionaryData.filter(item => 
        item.arabic.toLowerCase().includes(query) || 
        item.english.toLowerCase().includes(query)
    ).slice(0, 5);
    
    if (matches.length === 0) {
        suggestionsBox.classList.add('hidden');
        return;
    }
    
    suggestionsBox.innerHTML = matches.map(item => `
        <div class="suggestion-item" data-id="${item.id}">
            <div>
                <span class="suggestion-word">${item.arabic}</span>
                <span class="suggestion-meaning"> - ${item.english}</span>
            </div>
            <span class="suggestion-cat">${item.category}</span>
        </div>
    `).join('');
    
    suggestionsBox.classList.remove('hidden');
    
    // إضافة أحداث النقر على الاقتراحات
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const word = dictionaryData.find(w => w.id === id);
            searchInput.value = word.arabic || word.english;
            suggestionsBox.classList.add('hidden');
            performSearch(searchInput.value.trim().toLowerCase());
        });
    });
}

// ===== تنفيذ البحث =====
function performSearch(query) {
    if (!query) return;
    
    showLoading(true);
    suggestionsBox.classList.add('hidden');
    
    // محاكاة تأخير بسيط لتجربة أفضل
    setTimeout(() => {
        const results = dictionaryData.filter(item => 
            item.arabic.toLowerCase().includes(query) || 
            item.english.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
        
        showLoading(false);
        
        if (results.length > 0) {
            displayResults(results);
            addToHistory(query);
        } else {
            showNoResults();
        }
    }, 200);
}

// ===== عرض النتائج =====
function displayResults(words) {
    resultsContainer.innerHTML = words.map((word, index) => `
        <article class="word-card" style="animation-delay: ${index * 0.05}s">
            <div class="card-header">
                <div>
                    <h3 class="word-main">${word.arabic}</h3>
                    <span class="word-pronunciation">${word.pronunciation}</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn favorite ${favorites.includes(word.id) ? 'active' : ''}" 
                            data-id="${word.id}" title="إضافة للمفضلة">
                        <i class="fa-${favorites.includes(word.id) ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <button class="action-btn copy-btn" data-text="${word.english}" title="نسخ الترجمة">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <span class="word-category">${word.category}</span>
            <p class="word-meaning">${word.english}</p>
            
            <div class="word-example">
                <span class="example-label">مثال:</span>
                <p class="example-text">${word.example.arabic}</p>
                <p class="example-text" style="direction: ltr; text-align: left; margin-top: 4px;">${word.example.english}</p>
            </div>
            
            <div class="word-footer">
                <span>تعلم كلمة جديدة 🎓</span>
                <button class="copy-btn" data-text="${word.arabic} - ${word.english}">
                    <i class="fa-regular fa-copy"></i> نسخ الكل
                </button>
            </div>
        </article>
    `).join('');
    
    // تفعيل أزرار المفضلة والنسخ
    attachCardEvents();
}

// ===== أحداث البطاقات =====
function attachCardEvents() {
    // أزرار المفضلة
    document.querySelectorAll('.action-btn.favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
            const icon = btn.querySelector('i');
            icon.className = favorites.includes(id) ? 
                'fa-solid fa-heart' : 'fa-regular fa-heart';
            btn.classList.toggle('active');
            showToast(favorites.includes(id) ? '✅ أضيفت للمفضلة' : '🗑️ حُذفت من المفضلة');
        });
    });
    
    // أزرار النسخ
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = btn.dataset.text;
            navigator.clipboard.writeText(text).then(() => {
                showToast('📋 تم النسخ للحافظة');
            });
        });
    });
}

// ===== إدارة المفضلة =====
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('dictionary_favorites', JSON.stringify(favorites));
    updateFavCount();
    loadFavorites();
}

function loadFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:20px;">لا توجد كلمات مفضلة بعد ❤️</p>';
        return;
    }
    
    const favWords = dictionaryData.filter(w => favorites.includes(w.id));
    favoritesList.innerHTML = favWords.map(word => `
        <div class="fav-item">
            <div>
                <div class="fav-word">${word.arabic}</div>
                <div class="fav-meaning">${word.english}</div>
            </div>
            <button class="remove-fav" data-id="${word.id}" title="إزالة">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // أحداث إزالة المفضلة
    favoritesList.querySelectorAll('.remove-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
            showToast('تمت الإزالة');
        });
    });
}

favoritesBtn.addEventListener('click', () => {
    favoritesModal.classList.remove('hidden');
    loadFavorites();
});

closeModal.addEventListener('click', () => {
    favoritesModal.classList.add('hidden');
});

// إغلاق النافذة عند النقر خارجها
favoritesModal.addEventListener('click', (e) => {
    if (e.target === favoritesModal) {
        favoritesModal.classList.add('hidden');
    }
});

function updateFavCount() {
    favCount.textContent = favorites.length;
    favCount.classList.toggle('hidden', favorites.length === 0);
}

// ===== سجل البحث =====
function addToHistory(query) {
    if (!searchHistory.includes(query)) {
        searchHistory.unshift(query);
        if (searchHistory.length > 10) searchHistory.pop();
        localStorage.setItem('dictionary_history', JSON.stringify(searchHistory));
    }
}

// ===== الإحصائيات =====
function updateStats() {
    document.getElementById('wordsCount').textContent = dictionaryData.length;
    document.getElementById('categoriesCount').textContent = getUniqueCategories().length;
    updateFavCount();
}

// ===== حالات الواجهة =====
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
    resultsContainer.classList.toggle('hidden', show);
    noResults.classList.add('hidden');
}

function showNoResults() {
    resultsContainer.innerHTML = '';
    noResults.classList.remove('hidden');
}

// ===== إشعارات سريعة =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== إغلاق الاقتراحات عند النقر خارجها =====
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        suggestionsBox.classList.add('hidden');
    }
});

// ===== دعم لوحة المفاتيح =====
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        suggestionsBox.classList.add('hidden');
        searchInput.blur();
    }
});
