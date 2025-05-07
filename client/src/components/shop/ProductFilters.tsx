import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Filter as FilterIcon, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Category } from '@shared/schema';

interface ProductFiltersProps {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onFilterChange: (filters: any) => void;
}

export default function ProductFilters({
  categoryId,
  minPrice = 0,
  maxPrice = 500,
  inStock,
  onFilterChange
}: ProductFiltersProps) {
  // State for mobile filter panel
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    availability: true
  });
  
  // State for filter values
  const [filters, setFilters] = useState({
    categoryId,
    priceRange: [minPrice, maxPrice] as [number, number],
    inStock
  });
  
  // Get categories for filter options
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Toggle filter section
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };
  
  // Handle category change
  const handleCategoryChange = (catId: number | null) => {
    const newFilters = { 
      ...filters, 
      categoryId: catId === filters.categoryId ? undefined : catId 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    const newFilters = { 
      ...filters, 
      priceRange: [value[0], value[1]] as [number, number] 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Handle in-stock change
  const handleInStockChange = (checked: boolean) => {
    const newFilters = { 
      ...filters, 
      inStock: checked 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      categoryId: undefined,
      priceRange: [minPrice, maxPrice] as [number, number],
      inStock: undefined
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <Button 
          onClick={() => setIsFilterOpen(true)} 
          variant="outline" 
          className="w-full flex items-center justify-center"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
      
      {/* Filter panel - hidden on mobile unless open */}
      <div className={`
        fixed inset-0 z-50 bg-white p-4 overflow-auto transition-transform md:static md:block md:bg-transparent md:p-0 md:z-auto md:transform-none
        ${isFilterOpen ? 'transform-none' : 'translate-x-[-100%]'}
      `}>
        {/* Mobile header */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-medium">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Filter content */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="border-b pb-4 md:pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('category')}
            >
              <h3 className="font-medium">Categories</h3>
              {openSections.category ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {openSections.category && (
              <div className="space-y-2 mt-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={filters.categoryId === category.id}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="ml-2 cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price range */}
          <div className="border-b pb-4 md:pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('price')}
            >
              <h3 className="font-medium">Price Range</h3>
              {openSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {openSections.price && (
              <div className="mt-4">
                <Slider 
                  defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                  max={500}
                  step={10}
                  onValueChange={handlePriceChange}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="bg-gray-100 px-2 py-1 text-sm">$</span>
                    <Input 
                      type="number"
                      className="w-16 border-0 focus-visible:ring-0"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange([Number(e.target.value), filters.priceRange[1]])}
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="bg-gray-100 px-2 py-1 text-sm">$</span>
                    <Input 
                      type="number"
                      className="w-16 border-0 focus-visible:ring-0"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange([filters.priceRange[0], Number(e.target.value)])}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Availability */}
          <div className="border-b pb-4 md:pb-6">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleSection('availability')}
            >
              <h3 className="font-medium">Availability</h3>
              {openSections.availability ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {openSections.availability && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="in-stock" 
                    checked={!!filters.inStock}
                    onCheckedChange={(checked) => handleInStockChange(!!checked)}
                  />
                  <Label htmlFor="in-stock" className="ml-2 cursor-pointer">
                    In Stock Only
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          {/* Clear filters button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
          
          {/* Mobile apply button */}
          <div className="md:hidden">
            <Button 
              className="w-full"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
