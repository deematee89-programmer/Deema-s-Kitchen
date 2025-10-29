import { useState, useEffect } from "react";
import { Search, X, Clock, ChefHat } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface Recipe {
  id: number;
  recipe_title: string;
  recipe_description: string;
  cooking_time: string;
  difficulty: string;
  dietary_tags: string;
  ingredients: string;
}

interface RecipeSearchProps {
  onRecipeSelect: (recipe: any) => void;
}

export default function RecipeSearch({ onRecipeSelect }: RecipeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const searchRecipes = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search-recipes?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.recipes || []);
          setShowResults(searchQuery.trim().length > 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchRecipes, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const selectRecipe = (recipe: Recipe) => {
    const formattedRecipe = {
      title: recipe.recipe_title,
      description: recipe.recipe_description,
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty,
      dietary_tags: JSON.parse(recipe.dietary_tags || '[]'),
      instructions: ["اتبع الخطوات المعتادة للطبخ", "يمكنك تعديل المكونات حسب الذوق", "استمتع بالطبخ!"]
    };
    onRecipeSelect(formattedRecipe);
    clearSearch();
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن الوصفات... Search recipes..."
          className="w-full pl-12 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="w-4 h-4 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-pink-200 z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => selectRecipe(recipe)}
                  className="w-full p-4 text-left hover:bg-pink-50 rounded-lg transition-colors duration-200 border-b border-pink-100 last:border-b-0"
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">
                      {recipe.recipe_title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.recipe_description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{recipe.cooking_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-3 h-3" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>{t.noResults}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
