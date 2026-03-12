// العناصر الأساسية
const factsGrid = document.getElementById('factsGrid');
const searchInput = document.getElementById('searchInput');
const categoriesContainer = document.getElementById('categoriesContainer');
const darkModeBtn = document.getElementById('darkModeBtn');

// 1. عرض المعلومات
function displayFacts(facts) {
    factsGrid.innerHTML = '';
    facts.forEach(fact => {
        const card = document.createElement('div');
        card.className = 'fact-card';
        card.innerHTML = `
            <span class="fact-category">${fact.category}</span>
            <h3 class="fact-title">${fact.title}</h3>
            <p class="fact-content">${fact.content}</p>
            <div class="fact-source">
                <span><i class="fa-solid fa-book"></i> ${fact.source}</span>
                <button class="share-btn" onclick="shareFact('${fact.title}')">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>
        `;
        factsGrid.appendChild(card);
    });
}

// 2. إنشاء أزرار التصنيفات
function createCategories() {
    const categories = ['all', ...new Set(factsData.map(fact => fact.category))];
    categoriesContainer.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${cat === 'all' ? 'active' : ''}`;
        btn.textContent = cat === 'all' ? 'الكل' : cat;
        btn.dataset.category = cat;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterFacts(cat);
        });
        
        categoriesContainer.appendChild(btn);
    });
}

// 3. فلترة المعلومات
function filterFacts(category) {
    if (category === 'all') {
        displayFacts(factsData);
    } else {
        const filtered = factsData.filter(fact => fact.category === category);
        displayFacts(filtered);
    }
}

// 4. البحث
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = factsData.filter(fact => 
        fact.title.toLowerCase().includes(term) || 
        fact.content.toLowerCase().includes(term)
    );
    displayFacts(filtered);
});

// 5. الوضع الليلي
darkModeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    darkModeBtn.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// 6. مشاركة المعلومة
function shareFact(title) {
    if (navigator.share) {
        navigator.share({
            title: '100 معلومة',
            text: `هل قرأت هذه المعلومة؟ ${title}`,
            url: window.location.href
        });
    } else {
        alert('تم نسخ رابط الموقع!');
    }
}

// تشغيل الموقع
displayFacts(factsData);
createCategories();