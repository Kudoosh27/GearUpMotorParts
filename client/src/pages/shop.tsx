import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import Newsletter from '@/components/home/Newsletter';
import { Product, Category } from '@shared/schema';

export default function Shop() {
  const [location, params] = useLocation();
  const [sortBy, setSortBy] = useState('featured');
  
  // Extract URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const categorySlug = location.split('/').pop();
  const searchQuery = searchParams.get('search') || '';
  
  // State for filters
  const [filters, setFilters] = useState({
    categoryId: undefined as number | undefined,
    priceRange: [0, 500] as [number, number],
    inStock: undefined as boolean | undefined
  });
  
  // Fetch categories to get category ID from slug
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Update category ID when slug changes
  useEffect(() => {
    if (categories.length && categorySlug && categorySlug !== 'shop') {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setFilters(prev => ({ ...prev, categoryId: category.id }));
      }
    }
  }, [categories, categorySlug]);
  
  // Fetch products with filters
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', filters, searchQuery],
    queryFn: async () => {
      let url = '/api/products?';
      const queryParams = new URLSearchParams();
      
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId.toString());
      }
      
      if (filters.inStock) {
        queryParams.append('inStock', 'true');
      }
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      return fetch(`/api/products?${queryParams.toString()}`)
        .then(res => res.json());
    },
  });
  
  
  // Filter products by price range
  const filteredProducts = products.filter(product => 
    product.price >= filters.priceRange[0] && 
    product.price <= filters.priceRange[1]
  );
  
  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        // Default to featured sorting (no change)
        return 0;
    }
  });
  
  // Get current category for title/description
  const currentCategory = categories.find(c => c.slug === categorySlug);
  
  // Page title and meta description
  const pageTitle = searchQuery 
    ? `Search results for "${searchQuery}" - GearUp Auto Parts`
    : currentCategory 
      ? `${currentCategory.name} - GearUp Auto Parts`
      : 'Shop All Products - GearUp Auto Parts';
  
  const pageDescription = currentCategory?.description || 
    'Browse our premium selection of motorcycle parts and accessories. Quality products with fast shipping and expert support.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@300;400;500&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet" />
      </Helmet>
      <Header />
      <main>
        {/* Page header */}
        <div className="bg-gray-100 py-6 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold font-montserrat">
              {searchQuery 
                ? `Search results for "${searchQuery}"`
                : currentCategory 
                  ? currentCategory.name
                  : 'All Products'}
            </h1>
            {currentCategory && <p className="text-gray-600 mt-2">{currentCategory.description}</p>}
          </div>
        </div>
        
        {/* Shop content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - side column on desktop */}
            <div className="md:w-64 flex-shrink-0">
              <ProductFilters 
                categoryId={filters.categoryId}
                minPrice={filters.priceRange[0]}
                maxPrice={filters.priceRange[1]}
                inStock={filters.inStock}
                onFilterChange={setFilters}
              />
            </div>
            
            {/* Product grid */}
            <div className="flex-1">
              {/* Sort controls */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {isLoading ? 'Loading products...' : `${sortedProducts.length} products`}
                </p>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Sort by: Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Best Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Products grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      categoryId: undefined,
                      priceRange: [0, 500],
                      inStock: undefined
                    })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
