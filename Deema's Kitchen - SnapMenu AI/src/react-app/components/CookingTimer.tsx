import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, ChefHat } from "lucide-react";

interface CookingTimerProps {
  recipe: {
    title: string;
    cooking_time: string;
    instructions: string[];
  };
  onComplete: () => void;
}

export default function CookingTimer({ recipe, onComplete }: CookingTimerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalCookingTime] = useState(() => {
    const timeStr = recipe.cooking_time.toLowerCase();
    const minutes = parseInt(timeStr.match(/(\d+)/)?.[1] || "30");
    return minutes * 60; // Convert to seconds
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (currentStep < recipe.instructions.length - 1) {
              // Play notification sound
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeETSH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBSl+zPLaizsIGGS57OihUAwLS6ffz2IMDkOYz+vHaisFLXfM+tiLQAoUXrLp66hVFApGnt/zv2seETSH0fPTgjMIH2y/8+aZSQ0PVqzl7rJeGAhFlN3zvmweETWM1POUgDIIFmiD6eCUTQwCUZfl7K1gGQhGmNjyx3ErBSp9yPLajTsIGWi96+KeUAwLS6ffz2ENCUS4z+vHaisFLXfM+tiLQAoUXrLp66hVFApGnt/zv2oeETSH0fPTgjMIH2y/8+aZSQ0PVqzl7rJeGAhGmNTzv2weETWM1POUgDIIFmiA6OGUTAwDUJbl7K1gGQhElN7zxnkqBSh7yfLajjwIG2i66+KTSA0LSKPezWEOCUGzyOvMdC0Eh2y+8+KTRAcfW6vi7K1dGAgMSZLd7bJcGAg7hdj0xnwrBCZ5yfPbkTsJFmqD6+KTSA0LSKPezWEOCUGzyOvMdC0Eh2y+8+KTRAGE2PCUgjMIH2y/8+aZSQ0PVqzl7rJeGAhGmNj0yn0sBC17wOG0XhEKSqfezGQOCEGyyOvNdS0Eh2u88+SSRA0PVqzl7rJeGAhGmNjzyn0sBC17v/Dfn04KRbLa7qZXFQpGmur0yYAxByNvqvHckUMKEF61K60');
              audio.play().catch(() => {}); // Ignore errors in case audio fails
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentStep, recipe.instructions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startStepTimer = () => {
    // Estimate time per step
    const timePerStep = Math.floor(totalCookingTime / recipe.instructions.length);
    setTimeLeft(timePerStep);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
      setIsRunning(false);
      setTimeLeft(0);
    } else {
      onComplete();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCurrentStep(0);
  };

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] p-6 text-white">
        <div className="flex items-center gap-3">
          <ChefHat className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">وقت الطبخ</h3>
            <p className="text-pink-100">خطوة بخطوة مع {recipe.title}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6 border-b border-pink-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            الخطوة {currentStep + 1} من {recipe.instructions.length}
          </span>
          <span className="text-sm font-medium text-[#B47C86]">
            {Math.round(progress)}% مكتمل
          </span>
        </div>
        <div className="w-full bg-pink-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FFC7D0] to-[#B47C86] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 leading-relaxed text-lg">
                {recipe.instructions[currentStep]}
              </p>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-2xl px-6 py-4">
            <Clock className="w-6 h-6 text-[#B47C86]" />
            <span className="text-3xl font-bold text-gray-800 font-mono">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {timeLeft === 0 ? (
            <button
              onClick={startStepTimer}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <Play className="w-5 h-5" />
              بدء المؤقت
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'إيقاف' : 'استئناف'}
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 bg-white border-2 border-[#FFC7D0] text-[#B47C86] px-6 py-3 rounded-xl hover:bg-pink-50 transition-all duration-200 font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            إعادة تعيين
          </button>

          <button
            onClick={nextStep}
            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
          >
            {currentStep < recipe.instructions.length - 1 ? 'الخطوة التالية' : 'إنهاء الطبخ'}
          </button>
        </div>
      </div>
    </div>
  );
}
