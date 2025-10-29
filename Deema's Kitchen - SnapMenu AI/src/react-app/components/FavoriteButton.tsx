import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  recipeId: string;
}

export default function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      setIsFavorite(favorites.includes(recipeId));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setIsFavorite(false);
    }
  }, [recipeId]);

  const toggleFavorite = () => {
    try {
      setIsAnimating(true);
      const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');
      
      if (isFavorite) {
        const newFavorites = favorites.filter((id: string) => id !== recipeId);
        localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
        setIsFavorite(false);
      } else {
        const newFavorites = [...favorites, recipeId];
        localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
        setIsFavorite(true);
      }

      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('حدث خطأ في حفظ المفضلة');
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform ${
        isFavorite 
          ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg scale-110' 
          : 'bg-white border-2 border-pink-200 text-gray-400 hover:border-red-300 hover:text-red-400'
      } ${isAnimating ? 'animate-pulse' : ''}`}
    >
      <Heart 
        className={`w-5 h-5 transition-all duration-200 ${
          isFavorite ? 'fill-current' : ''
        }`} 
      />
    </button>
  );
}
