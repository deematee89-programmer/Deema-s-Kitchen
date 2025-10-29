import { useState } from "react";
import { Plus } from "lucide-react";
import AddRecipeModal from "./AddRecipeModal";

interface FloatingActionButtonsProps {
  onRecipeAdded?: () => void;
}

export default function FloatingActionButtons({ onRecipeAdded }: FloatingActionButtonsProps) {
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main FAB - Add Recipe */}
      <button
        onClick={() => setShowAddRecipe(true)}
        className="w-16 h-16 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transform transition-all duration-300"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Recipe Modal */}
      <AddRecipeModal
        isOpen={showAddRecipe}
        onClose={() => setShowAddRecipe(false)}
        onRecipeAdded={() => {
          if (onRecipeAdded) onRecipeAdded();
        }}
      />
    </div>
  );
}
