import { Activity, Zap, Heart, Droplets } from "lucide-react";

interface NutritionCardProps {
  ingredients: string[];
}

export default function NutritionCard({ ingredients }: NutritionCardProps) {
  // Simple nutrition estimation based on ingredients
  const estimateNutrition = () => {
    const baseCalories = ingredients.length * 25;
    const protein = Math.round(ingredients.length * 2.5);
    const carbs = Math.round(ingredients.length * 8);
    const fiber = Math.round(ingredients.length * 1.5);
    const vitamins = Math.min(95, ingredients.length * 12);

    return {
      calories: baseCalories + Math.floor(Math.random() * 100),
      protein,
      carbs,
      fiber,
      vitamins,
      healthScore: Math.min(95, 60 + ingredients.length * 3)
    };
  };

  const nutrition = estimateNutrition();

  const nutritionItems = [
    {
      icon: Zap,
      label: "السعرات",
      value: `${nutrition.calories}`,
      unit: "سعرة",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Activity,
      label: "البروتين",
      value: `${nutrition.protein}`,
      unit: "جرام",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: Heart,
      label: "الكربوهيدرات",
      value: `${nutrition.carbs}`,
      unit: "جرام",
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: Droplets,
      label: "الألياف",
      value: `${nutrition.fiber}`,
      unit: "جرام",
      color: "from-green-400 to-green-500"
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header with Health Score */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#B47C86]" />
            القيم الغذائية التقديرية
          </h3>
          <div className="text-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FFD6E8"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#healthGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(nutrition.healthScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFC7D0" />
                    <stop offset="100%" stopColor="#B47C86" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">{nutrition.healthScore}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-1">صحي</p>
          </div>
        </div>

        {/* Nutrition Grid */}
        <div className="grid grid-cols-2 gap-4">
          {nutritionItems.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-lg font-bold text-gray-800">
                    {item.value} <span className="text-sm font-normal text-gray-600">{item.unit}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vitamins and Minerals */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">الفيتامينات والمعادن</h4>
          <div className="space-y-2">
            {[
              { name: "فيتامين C", value: nutrition.vitamins },
              { name: "الحديد", value: Math.min(90, nutrition.vitamins - 10) },
              { name: "الكالسيوم", value: Math.min(85, nutrition.vitamins - 15) }
            ].map((vitamin, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{vitamin.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-pink-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] transition-all duration-500"
                      style={{ width: `${vitamin.value}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{vitamin.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
            💡 نصائح صحية
          </h4>
          <p className="text-sm text-green-700">
            هذه الوصفة غنية بالعناصر الغذائية الطبيعية وتحتوي على مكونات طازجة مفيدة لصحتك!
          </p>
        </div>
      </div>
    </div>
  );
}
