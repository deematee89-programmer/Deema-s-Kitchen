import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Sparkles, ChefHat, Leaf, X, ArrowLeft } from "lucide-react";
import RecipeCard from "@/react-app/components/RecipeCard";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import CookingTimer from "@/react-app/components/CookingTimer";
import NutritionCard from "@/react-app/components/NutritionCard";
import ShoppingList from "@/react-app/components/ShoppingList";
import FloatingActionButtons from "@/react-app/components/FloatingActionButtons";
import LanguageSelector from "@/react-app/components/LanguageSelector";
import RecipeSearch from "@/react-app/components/RecipeSearch";
import { useLanguage } from "@/react-app/hooks/useLanguage";
import type { GenerateRecipeResponse } from "@/shared/types";

export default function Home() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showCookingTimer, setShowCookingTimer] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setShowResults(false);

    try {
      const response = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_data: selectedImage,
          dietary_preference: dietaryPreference,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error_ar || error.error || "فشل في تحليل الصورة";
        throw new Error(errorMessage);
      }

      const data: GenerateRecipeResponse = await response.json();
      setIngredients(data.ingredients);
      setRecipes(data.recipes);
      setShowResults(true);
    } catch (error: any) {
      const errorMessage = error.message || "فشل في تحليل الصورة. يرجى المحاولة مرة أخرى.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setSelectedImage(null);
    setIngredients([]);
    setRecipes([]);
    setShowResults(false);
    setShowCookingTimer(false);
    setSelectedRecipe(null);
    setDietaryPreference("");
  };

  const startCooking = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowCookingTimer(true);
  };

  const handleSearchRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setRecipes([recipe]);
    setIngredients(recipe.ingredients ? recipe.ingredients.split(', ') : ['مكونات متنوعة']);
    setShowResults(true);
  };

  const completeCooking = () => {
    setShowCookingTimer(false);
    setSelectedRecipe(null);
    // Show celebration message
    alert("🎉 تم الانتهاء من الطبخ! آمل أن تكون الوصفة لذيذة!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD6E8] via-[#F5E1E9] to-[#FFC7D0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFC7D0] to-[#B47C86] rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B47C86] to-[#FFC7D0] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <p className="hidden sm:block text-sm text-gray-600 italic">
              {t.appSubtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {!showResults ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t.heroTitle}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Recipe Search */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <p className="text-lg text-gray-700 font-medium">
                  {t.discoverRecipes}
                </p>
                <p className="text-sm text-gray-600">
                  {t.searchHint}
                </p>
              </div>
              <RecipeSearch onRecipeSelect={handleSearchRecipe} />
            </div>

            {/* Upload Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-pink-100">
              {!selectedImage ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-8 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                    >
                      <Camera className="w-6 h-6" />
                      <span>{t.takePhoto}</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-3 bg-white text-[#B47C86] border-2 border-[#FFC7D0] px-8 py-4 rounded-2xl hover:bg-[#FFF0F5] transform hover:scale-105 transition-all duration-200 font-medium"
                    >
                      <Upload className="w-6 h-6" />
                      <span>{t.uploadPhoto}</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />

                  <div className="text-center text-sm text-gray-500 space-y-2">
                    <p>{t.photoTip1}</p>
                    <p>{t.photoTip2}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected ingredients"
                      className="w-full max-h-96 object-contain rounded-2xl"
                    />
                    <button
                      onClick={resetApp}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Dietary Preferences */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.dietaryPreferences}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["vegetarian", "vegan", "gluten-free", "quick & easy"].map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setDietaryPreference(pref === dietaryPreference ? "" : pref)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            dietaryPreference === pref
                              ? "bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white shadow-md"
                              : "bg-white border-2 border-pink-200 text-gray-700 hover:border-pink-300"
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={analyzePhoto}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-8 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        <span>{t.analyzing}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        <span>{t.generateRecipes}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 border border-pink-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD6E8] to-[#FFC7D0] rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-[#B47C86]" />
                </div>
                <h3 className="font-semibold text-gray-800">{t.instantRecognition}</h3>
                <p className="text-sm text-gray-600">{t.instantRecognitionDesc}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 border border-pink-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD6E8] to-[#FFC7D0] rounded-full flex items-center justify-center mx-auto">
                  <ChefHat className="w-8 h-8 text-[#B47C86]" />
                </div>
                <h3 className="font-semibold text-gray-800">{t.creativeRecipes}</h3>
                <p className="text-sm text-gray-600">{t.creativeRecipesDesc}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center space-y-3 border border-pink-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD6E8] to-[#FFC7D0] rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-8 h-8 text-[#B47C86]" />
                </div>
                <h3 className="font-semibold text-gray-800">{t.reduceWaste}</h3>
                <p className="text-sm text-gray-600">{t.reduceWasteDesc}</p>
              </div>
            </div>
          </div>
        ) : showCookingTimer && selectedRecipe ? (
          <div className="space-y-8">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowCookingTimer(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-pink-200 text-gray-700 hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.backToRecipes}</span>
              </button>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-pink-200 text-gray-700 hover:bg-white transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">{t.newPhoto}</span>
              </button>
            </div>

            {/* Cooking Timer */}
            <CookingTimer recipe={selectedRecipe} onComplete={completeCooking} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t.myRecipes}
              </h2>
              <button
                onClick={resetApp}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-pink-200 text-gray-700 hover:bg-white transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">{t.newPhoto}</span>
              </button>
            </div>

            {/* Detected Ingredients */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B47C86]" />
                {t.detectedIngredients}
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-[#FFD6E8] to-[#F5E1E9] text-gray-700 rounded-full text-sm font-medium"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <NutritionCard ingredients={ingredients} />
              </div>
              <div>
                <ShoppingList ingredients={ingredients} />
              </div>
            </div>

            {/* Recipe Cards */}
            <div className="grid gap-6">
              {recipes.map((recipe, index) => (
                <RecipeCard 
                  key={index} 
                  recipe={recipe} 
                  onStartCooking={() => startCooking(recipe)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Buttons */}
      <FloatingActionButtons onRecipeAdded={() => {
        // Refresh recipes if needed
        if (showResults) {
          // Could trigger a refresh here
        }
      }} />

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-pink-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>{t.madeWith} {t.appTitle} • {t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}
