import { useState } from "react";
import { X, Plus, Upload, Utensils } from "lucide-react";
import { useLanguage } from "@/react-app/hooks/useLanguage";

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded: () => void;
}

export default function AddRecipeModal({ isOpen, onClose, onRecipeAdded }: AddRecipeModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cooking_time: "",
    difficulty: "Easy",
    dietary_tags: [] as string[],
    photo_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dietaryOptions = [
    { value: "vegetarian" },
    { value: "vegan" },
    { value: "gluten-free" },
    { value: "healthy" },
    { value: "quick & easy" }
  ];

  const difficultyOptions = [
    { value: "Easy" },
    { value: "Medium" },
    { value: "Hard" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDietaryTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter(t => t !== tag)
        : [...prev.dietary_tags, tag]
    }));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        photo_url: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.ingredients || !formData.instructions) {
      alert(t.fillRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/add-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
          instructions: formData.instructions.split('\n').filter(i => i.trim())
        }),
      });

      if (!response.ok) {
        throw new Error(t.recipeAddFailed);
      }

      alert(t.recipeAddSuccess);
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        cooking_time: "",
        difficulty: "Easy",
        dietary_tags: [],
        photo_url: ""
      });
      onRecipeAdded();
      onClose();
    } catch (error: any) {
      alert(error.message || t.recipeAddFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFC7D0] to-[#B47C86] rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{t.addNewRecipe}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{t.dishPhoto}</label>
            {formData.photo_url ? (
              <div className="relative">
                <img
                  src={formData.photo_url}
                  alt="Recipe"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo_url: "" }))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <div className="flex justify-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">{t.choosePhoto}</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.dishName}</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none"
              placeholder={t.dishNamePlaceholder}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.dishDescription}</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none h-20 resize-none"
              placeholder={t.dishDescPlaceholder}
            />
          </div>

          {/* Cooking Time & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t.preparationTime}</label>
              <input
                type="text"
                value={formData.cooking_time}
                onChange={(e) => handleInputChange("cooking_time", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none"
                placeholder={t.timePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t.difficultyLevel}</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange("difficulty", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none"
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {t[option.value.toLowerCase() as keyof typeof t] || option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">{t.dishProperties}</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => {
                const key = option.value === 'gluten-free' ? 'glutenFree' : 
                           option.value === 'quick & easy' ? 'quickEasy' : 
                           option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDietaryTagToggle(option.value)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.dietary_tags.includes(option.value)
                        ? "bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t[key as keyof typeof t] || option.value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.ingredients}</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => handleInputChange("ingredients", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none h-32 resize-none"
              placeholder={t.ingredientsPlaceholder}
              required
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t.preparationMethod}</label>
            <textarea
              value={formData.instructions}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFC7D0] focus:border-transparent outline-none h-40 resize-none"
              placeholder={t.instructionsPlaceholder}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.saving}</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>{t.addRecipe}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
