
import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '@shared/schema';

interface MobileMenuProps {
  categories: Category[];
  onClose: () => void;
}

export default function MobileMenu({ categories, onClose }: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (categoryId: number) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <div className="md:hidden bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-gray-200 pb-3">
            <button 
              className="flex items-center justify-between w-full py-2 text-left"
              onClick={() => toggleCategory(category.id)}
            >
              <span className="text-gray-800">{category.name}</span>
              {expandedCategory === category.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedCategory === category.id && (
              <div className="pl-4 pt-2 space-y-2">
                <Link 
                  href={`/shop/${category.slug}`} 
                  className="block py-1 font-medium text-primary transition"
                  onClick={onClose}
                >
                  View All {category.name} Products
                </Link>
              </div>
            )}
          </div>
        ))}
        
        <Link 
          href="/shop/deals" 
          className="block py-2 text-primary font-medium border-b border-gray-200"
          onClick={onClose}
        >
          Deals
        </Link>
      </div>
    </div>
  );
}
