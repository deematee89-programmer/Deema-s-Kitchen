import { useState } from "react";
import { ShoppingCart, Check, Plus, Trash2 } from "lucide-react";

interface ShoppingListProps {
  ingredients: string[];
}

export default function ShoppingList({ ingredients }: ShoppingListProps) {
  const [shoppingList, setShoppingList] = useState<Array<{id: string, name: string, checked: boolean}>>(() => 
    ingredients.map((ingredient, index) => ({
      id: `ingredient-${index}`,
      name: ingredient,
      checked: false
    }))
  );
  const [newItem, setNewItem] = useState("");
  const [showList, setShowList] = useState(false);

  const toggleItem = (id: string) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = () => {
    if (newItem.trim()) {
      const newId = `custom-${Date.now()}`;
      setShoppingList(prev => [...prev, {
        id: newId,
        name: newItem.trim(),
        checked: false
      }]);
      setNewItem("");
    }
  };

  const removeItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const checkedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-pink-100">
        <button
          onClick={() => setShowList(!showList)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFC7D0] to-[#B47C86] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">قائمة التسوق</h3>
              <p className="text-sm text-gray-600">
                {checkedCount} من {totalCount} مكتمل
              </p>
            </div>
          </div>
          <div className="text-2xl text-gray-400">
            {showList ? '−' : '+'}
          </div>
        </button>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-pink-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Shopping List */}
      {showList && (
        <div className="p-6 space-y-4">
          {/* Add New Item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="إضافة عنصر جديد..."
              className="flex-1 px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="px-4 py-2 bg-gradient-to-r from-[#FFC7D0] to-[#B47C86] text-white rounded-xl hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Shopping Items */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  item.checked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-pink-100 hover:border-pink-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    item.checked
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {item.checked && <Check className="w-4 h-4 text-white" />}
                </button>
                
                <span className={`flex-1 transition-all duration-200 ${
                  item.checked 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-800'
                }`}>
                  {item.name}
                </span>

                {item.id.startsWith('custom-') && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          {totalCount > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-pink-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  إجمالي العناصر: {totalCount}
                </span>
                <span className="text-sm font-medium text-green-600">
                  مكتمل: {checkedCount}
                </span>
              </div>
              {progress === 100 && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  🎉 تم إكمال قائمة التسوق!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
