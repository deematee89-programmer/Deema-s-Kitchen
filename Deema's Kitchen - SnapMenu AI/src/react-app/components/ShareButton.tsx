import { Share2 } from "lucide-react";

interface ShareButtonProps {
  recipe: {
    title: string;
    description: string;
  };
}

export default function ShareButton({ recipe }: ShareButtonProps) {
  const shareRecipe = async () => {
    const shareText = `🍳 وصفة رائعة من مطبخ ديمة!\n\n"${recipe.title}"\n\n${recipe.description}\n\nجربوا التطبيق الآن!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipe.title} - مطبخ ديمة`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        // Fallback to copying to clipboard
        fallbackShare(shareText, shareUrl);
      }
    } else {
      fallbackShare(shareText, shareUrl);
    }
  };

  const fallbackShare = (text: string, url: string) => {
    const fullText = `${text}\n\n${url}`;
    navigator.clipboard.writeText(fullText).then(() => {
      alert('تم نسخ الوصفة! شاركها مع أصدقائك 📱');
    }).catch(() => {
      // If clipboard API fails, show the text in an alert
      alert(`انسخ هذا النص وشاركه:\n\n${fullText}`);
    });
  };

  return (
    <button
      onClick={shareRecipe}
      className="w-10 h-10 rounded-full bg-white border-2 border-pink-200 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-all duration-200 transform hover:scale-110"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );
}
