import { Clock, ChefHat, Sparkles, Play } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";
import StarRating from "./StarRating";
import { useState } from "react";
import { useLanguage } from "@/react-app/hooks/useLanguage";

interface RecipeCardProps {
  recipe: {
    title: string;
    description: string;
    cooking_time: string;
    difficulty: string;
    dietary_tags: string[];
    instructions: string[];
  };
  onStartCooking?: () => void;
}

export default function RecipeCard({ recipe, onStartCooking }: RecipeCardProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(Math.floor(Math.random() * 2) + 4); // Random rating between 4-5
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "from-green-400 to-green-500";
      case "medium":
        return "from-yellow-400 to-orange-500";
      case "hard":
        return "from-red-400 to-red-500";
      default:
        return "from-[#FFC7D0] to-[#B47C86]";
    }
  };

  const recipeId = `recipe-${recipe.title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={rating} onRatingChange={setRating} size="sm" />
                <span className="text-sm text-gray-500">({rating}/5)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <FavoriteButton recipeId={recipeId} />
              <ShareButton recipe={recipe} />
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD6E8] to-[#F5E1E9] rounded-full">
            <Clock className="w-4 h-4 text-[#B47C86]" />
            <span className="text-sm font-medium text-gray-700">{recipe.cooking_time}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getDifficultyColor(recipe.difficulty)} rounded-full`}>
            <ChefHat className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{recipe.difficulty}</span>
          </div>
          {recipe.dietary_tags && recipe.dietary_tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-pink-200 rounded-full">
              <Sparkles className="w-4 h-4 text-[#B47C86]" />
              <span className="text-sm font-medium text-gray-700">{tag}</span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-6 h-6 bg-gradient-to-br from-[#FFC7D0] to-[#B47C86] rounded-full flex items-center justify-center text-white text-xs">
              📝
            </span>
            {t.instructions}
          </h4>
          <ol className="space-y-3">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FFD6E8] to-[#FFC7D0] rounded-full flex items-center justify-center font-semibold text-[#B47C86] text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-pink-100">
          <button
            onClick={onStartCooking}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-6 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium group"
          >
            <Play className="w-5 h-5 group-hover:animate-pulse" />
            <span>{t.startCooking}</span>
            <span className="text-pink-100">🧑‍🍳</span>
          </button>
        </div>
      </div>
    </div>
  );
}
