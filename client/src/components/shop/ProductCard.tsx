import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, StarHalf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem('cartId') || 'guest';
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: () => {
      return apiRequest('POST', '/api/cart', {
        cartId,
        productId: product.id,
        quantity: 1
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-accent text-accent" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-accent/30" />);
    }

    return stars;
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition relative product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover"
          />
        </Link>
        {product.isBestseller && (
          <div className="absolute top-3 left-3">
            <Badge variant="default">BESTSELLER</Badge>
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">NEW</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-xs text-gray-600 mb-1">
          {/* This would come from the category data */}
          Category
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition">{product.name}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-600 ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-gray-600 text-sm line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className={`text-sm ${product.inStock ? 'text-success' : 'text-gray-600'} flex items-center`}>
            {product.inStock ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ships in 2-3 days
              </>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className={`absolute ${isHovered ? 'bottom-0' : 'bottom-[-40px]'} left-0 right-0 bg-primary text-white py-2 px-4 text-center font-medium transition-all duration-300 quick-add`}
      >
        <Button 
          variant="ghost" 
          className="w-full h-full p-0 text-white hover:text-white hover:bg-transparent"
          onClick={() => addToCartMutation.mutate()}
          disabled={addToCartMutation.isPending || !product.inStock}
        >
          {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
