import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Translations {
  en: Record<string, string>;
  ar: Record<string, string>;
}

const translations: Translations = {
  en: {
    appTitle: "Deema's Kitchen",
    appSubtitle: "Snap it. Cook it. Love it! 🌸",
    heroTitle: "Turn Your Ingredients Into Delicious Meals",
    heroSubtitle: "Snap a photo of your ingredients and let AI create amazing recipes instantly. Reduce food waste and discover new flavors! ✨",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    photoTip1: "📸 Take a clear photo of your ingredients",
    photoTip2: "💡 Make sure they're well-lit and visible",
    dietaryPreferences: "🌱 Any dietary preferences? (Optional)",
    generateRecipes: "Generate Recipes",
    analyzing: "Analyzing your ingredients...",
    detectedIngredients: "Detected Ingredients",
    myRecipes: "Your Amazing Recipes ✨",
    newPhoto: "New Photo",
    backToRecipes: "Back to Recipes",
    cookingTime: "Cooking Time",
    instructions: "Instructions",
    startCooking: "Start Cooking with Me",
    nutritionEstimate: "Nutritional Estimate",
    shoppingList: "Shopping List",
    searchPlaceholder: "Search for recipes by name...",
    noResults: "No recipes found. Try a different search term!",
    favorites: "Favorites",
    cookingTimer: "Cooking Timer",
    cookingGuide: "Cooking Guide",
    shareApp: "Share App",
    stepByStep: "Step by step with",
    stepOf: "Step",
    of: "of",
    completed: "completed",
    startTimer: "Start Timer",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    nextStep: "Next Step",
    finishCooking: "Finish Cooking",
    addNewItem: "Add new item...",
    totalItems: "Total items:",
    listCompleted: "🎉 Shopping list completed!",
    discoverRecipes: "🍽️ Discover 25+ recipes from different cultures",
    searchHint: "Search in Arabic or English • Kabsa, Mandi, Biryani, Tacos, Pasta and more",
    footerText: "Save food, save money, protect the planet 🌍",
    madeWith: "Made with 💗 by",
    instantRecognition: "Instant Recognition",
    instantRecognitionDesc: "AI identifies all your ingredients in seconds",
    creativeRecipes: "Creative Recipes",
    creativeRecipesDesc: "Get 3 unique recipe ideas every time",
    reduceWaste: "Reduce Waste",
    reduceWasteDesc: "Cook with what you have, save money & planet",
    addNewRecipe: "Add New Recipe",
    dishPhoto: "Dish Photo (Optional)",
    dishName: "Dish Name *",
    dishDescription: "Dish Description",
    preparationTime: "Preparation Time",
    difficultyLevel: "Difficulty Level",
    dishProperties: "Dish Properties",
    ingredients: "Ingredients * (one per line)",
    preparationMethod: "Preparation Method * (one step per line)",
    saving: "Saving...",
    addRecipe: "Add Recipe",
    fillRequired: "Please fill in all required fields",
    recipeAddFailed: "Failed to add recipe",
    recipeAddSuccess: "✨ Recipe added successfully!",
    choosePhoto: "Choose Photo",
    dishNamePlaceholder: "Example: Lebanese Fattoush",
    dishDescPlaceholder: "Brief description of the dish...",
    timePlaceholder: "Example: 30 minutes",
    ingredientsPlaceholder: "Example:\n2 tomatoes\nChopped lettuce\n1 tablespoon olive oil\nSalt and black pepper",
    instructionsPlaceholder: "Example:\nWash vegetables thoroughly\nChop tomatoes and lettuce\nMix ingredients in a bowl\nAdd oil and salt\nServe cold",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten-Free",
    healthy: "Healthy",
    quickEasy: "Quick & Easy"
  },
  ar: {
    appTitle: "مطبخ ديمة",
    appSubtitle: "صور، اطبخ، أحب! 🌸",
    heroTitle: "حولي مكوناتك إلى وجبات لذيذة",
    heroSubtitle: "صوري مكوناتك ودعي الذكاء الاصطناعي يبدع وصفات رائعة فوراً. قللي هدر الطعام واكتشفي نكهات جديدة! ✨",
    takePhoto: "التقط صورة",
    uploadPhoto: "ارفع صورة",
    photoTip1: "📸 التقط صورة واضحة لمكوناتك",
    photoTip2: "💡 تأكد من أنها مضاءة جيداً ومرئية",
    dietaryPreferences: "🌱 أي تفضيلات غذائية؟ (اختياري)",
    generateRecipes: "اصنع الوصفات",
    analyzing: "جاري تحليل مكوناتك...",
    detectedIngredients: "المكونات المكتشفة",
    myRecipes: "وصفاتك المميزة ✨",
    newPhoto: "صورة جديدة",
    backToRecipes: "العودة للوصفات",
    cookingTime: "وقت الطبخ",
    instructions: "التعليمات",
    startCooking: "ابدأ الطبخ معي",
    nutritionEstimate: "القيم الغذائية التقديرية",
    shoppingList: "قائمة التسوق",
    searchPlaceholder: "ابحث عن الوصفات بالاسم...",
    noResults: "لم يتم العثور على وصفات. جرب كلمة بحث أخرى!",
    favorites: "المفضلة",
    cookingTimer: "مؤقت الطبخ",
    cookingGuide: "دليل الطبخ",
    shareApp: "شارك التطبيق",
    stepByStep: "خطوة بخطوة مع",
    stepOf: "الخطوة",
    of: "من",
    completed: "مكتمل",
    startTimer: "بدء المؤقت",
    pause: "إيقاف",
    resume: "استئناف",
    reset: "إعادة تعيين",
    nextStep: "الخطوة التالية",
    finishCooking: "إنهاء الطبخ",
    addNewItem: "إضافة عنصر جديد...",
    totalItems: "إجمالي العناصر:",
    listCompleted: "🎉 تم إكمال قائمة التسوق!",
    discoverRecipes: "🍽️ اكتشف أكثر من 25 وصفة من مختلف الثقافات",
    searchHint: "ابحث بالعربية أو الإنجليزية • كبسة، مندي، برياني، تاكوس، باستا وأكثر",
    footerText: "احفظ الطعام، وفر المال، احم الكوكب 🌍",
    madeWith: "صنع بـ 💗 من",
    instantRecognition: "تعرف فوري",
    instantRecognitionDesc: "الذكاء الاصطناعي يتعرف على جميع مكوناتك في ثوانٍ",
    creativeRecipes: "وصفات إبداعية",
    creativeRecipesDesc: "احصل على 3 أفكار وصفات فريدة في كل مرة",
    reduceWaste: "قلل الهدر",
    reduceWasteDesc: "اطبخ بما لديك، وفر المال والكوكب",
    addNewRecipe: "إضافة وصفة جديدة",
    dishPhoto: "صورة الطبق (اختياري)",
    dishName: "اسم الطبق *",
    dishDescription: "وصف الطبق",
    preparationTime: "وقت التحضير",
    difficultyLevel: "مستوى الصعوبة",
    dishProperties: "خصائص الطبق",
    ingredients: "المقادير * (كل مقدار في سطر)",
    preparationMethod: "طريقة التحضير * (كل خطوة في سطر)",
    saving: "جاري الحفظ...",
    addRecipe: "إضافة الوصفة",
    fillRequired: "يرجى ملء جميع الحقول المطلوبة",
    recipeAddFailed: "فشل في إضافة الوصفة",
    recipeAddSuccess: "✨ تم إضافة الوصفة بنجاح!",
    choosePhoto: "اختر صورة",
    dishNamePlaceholder: "مثال: فتوش لبناني",
    dishDescPlaceholder: "وصف مختصر عن الطبق...",
    timePlaceholder: "مثال: 30 دقيقة",
    ingredientsPlaceholder: "مثال:\n2 حبة طماطم\nخس مقطع\nملعقة كبيرة زيت زيتون\nملح وفلفل أسود",
    instructionsPlaceholder: "مثال:\nاغسل الخضار جيداً\nقطع الطماطم والخس\nاخلط المقادير في وعاء\nأضف الزيت والملح\nقدم الطبق بارداً",
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
    vegetarian: "نباتي",
    vegan: "خالي من المنتجات الحيوانية",
    glutenFree: "خالي من الجلوتين",
    healthy: "صحي",
    quickEasy: "سريع وسهل"
  }
};

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && ['en', 'ar'].includes(saved) ? saved : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
