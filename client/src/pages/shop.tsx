import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
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
      } else {
        setFilters(prev => ({ ...prev, categoryId: undefined })); // Reset if not found
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
        return 0;
    }
  });

  return (
    <>
      <Helmet>
        <title>Shop Products</title>
      </Helmet>
      <Header />
      <main>
        <h1 className="text-2xl">Products</h1>
        {isLoading ? (
          <p>Loading products...</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found under this category.</p>
        )}
      </main>
      <Footer />
    </>
  );
}