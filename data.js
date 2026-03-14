// قاعدة بيانات القاموس - يمكن توسعتها إلى آلاف الكلمات
const dictionaryData = [
    {
        id: 1,
        arabic: "سلام",
        english: "peace",
        pronunciation: "/salaːm/",
        category: "اسم",
        example: {
            arabic: "السلام عليكم",
            english: "Peace be upon you"
        }
    },
    {
        id: 2,
        arabic: "كتاب",
        english: "book",
        pronunciation: "/kitaːb/",
        category: "اسم",
        example: {
            arabic: "أقرأ كتاباً كل أسبوع",
            english: "I read a book every week"
        }
    },
    {
        id: 3,
        arabic: "يكتب",
        english: "writes",
        pronunciation: "/yaktub/",
        category: "فعل",
        example: {
            arabic: "هو يكتب رسالة",
            english: "He writes a letter"
        }
    },
    {
        id: 4,
        arabic: "جميل",
        english: "beautiful",
        pronunciation: "/jamiːl/",
        category: "صفة",
        example: {
            arabic: "المنظر جميل جداً",
            english: "The view is very beautiful"
        }
    },
    {
        id: 5,
        arabic: "مدرسة",
        english: "school",
        pronunciation: "/madrasa/",
        category: "اسم",
        example: {
            arabic: "أذهب إلى المدرسة يومياً",
            english: "I go to school daily"
        }
    },
    {
        id: 6,
        arabic: "مرحباً",
        english: "hello",
        pronunciation: "/həˈloʊ/",
        category: "تحية",
        example: {
            arabic: "قلت مرحباً لصديقي",
            english: "I said hello to my friend"
        }
    },
    {
        id: 7,
        arabic: "حب",
        english: "love",
        pronunciation: "/lʌv/",
        category: "اسم",
        example: {
            arabic: "الحب شعور جميل",
            english: "Love is a beautiful feeling"
        }
    },
    {
        id: 8,
        arabic: "يجري",
        english: "run",
        pronunciation: "/rʌn/",
        category: "فعل",
        example: {
            arabic: "يجري في الحديقة كل صباح",
            english: "He runs in the park every morning"
        }
    },
    {
        id: 9,
        arabic: "سريع",
        english: "quick",
        pronunciation: "/kwɪk/",
        category: "صفة",
        example: {
            arabic: "هو متعلم سريع",
            english: "He is a quick learner"
        }
    },
    {
        id: 10,
        arabic: "صديق",
        english: "friend",
        pronunciation: "/frend/",
        category: "اسم",
        example: {
            arabic: "صديقي يساعدني دائماً",
            english: "My friend always helps me"
        }
    }
    // 🎯 أضف هنا بقية الكلمات حتى تصل لعدد كبير
    // انسخ الكائن {} وغير البيانات
];

// دالة للحصول على كلمة اليوم (تتغير يومياً)
function getWordOfTheDay() {
    const today = new Date().getDate();
    return dictionaryData[today % dictionaryData.length];
}

// دالة للحصول على التصنيفات الفريدة
function getUniqueCategories() {
    return [...new Set(dictionaryData.map(item => item.category))];
}