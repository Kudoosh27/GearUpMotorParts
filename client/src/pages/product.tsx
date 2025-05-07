import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Star, StarHalf, Minus, Plus, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Newsletter from '@/components/home/Newsletter';
import { Product as ProductType } from '@shared/schema';

export default function Product() {
  const { productSlug } = useParams();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem('cartId') || 'guest';

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: [`/api/products/${productSlug}`],
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: () => {
      if (!product) throw new Error('Product not found');
      
      return apiRequest('POST', '/api/cart', {
        cartId,
        productId: product.id,
        quantity
      });
    },
    onSuccess: () => {
      if (product) {
        toast({
          title: "Added to cart",
          description: `${quantity} × ${product.name} has been added to your cart.`,
        });
        queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle quantity change
  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-accent text-accent" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-accent/30" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-gray-100 h-[400px] animate-pulse rounded-lg"></div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
              <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => setLocation('/shop')}>Continue Shopping</Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - GearUp Auto Parts`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} for your motorcycle at GearUp Auto Parts. Quality parts with fast shipping.`} />
        <meta property="og:title" content={`${product.name} - GearUp Auto Parts`} />
        <meta property="og:description" content={product.description || `Buy ${product.name} for your motorcycle at GearUp Auto Parts. Quality parts with fast shipping.`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="text-sm mb-6 text-gray-600">
            <button onClick={() => setLocation('/')} className="hover:text-primary">Home</button>
            {' / '}
            <button onClick={() => setLocation('/shop')} className="hover:text-primary">Shop</button>
            {' / '}
            <span>{product.name}</span>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2">
              <div className="mb-2">
                {product.isBestseller && <Badge variant="default" className="mb-2 mr-2">BESTSELLER</Badge>}
                {product.isNew && <Badge variant="accent" className="mb-2">NEW</Badge>}
              </div>
              
              <h1 className="text-3xl font-bold font-montserrat mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </div>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-primary">₱{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-gray-500 line-through">₱{product.originalPrice.toFixed(2)}</span>
                )}
                {product.originalPrice && (
                  <span className="ml-2 bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                    Save ₱{(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className={`mb-4 flex items-center ${product.inStock ? 'text-success' : 'text-gray-600'}`}>
                {product.inStock ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    <span>In Stock - Ready to Ship</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Ships in 2-3 business days</span>
                  </>
                )}
              </div>
              
              <Separator className="my-6" />
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex border border-gray-300 rounded-md">
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="rounded-r-none h-10 w-10"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center h-10 w-12 border-x border-gray-300">
                      {quantity}
                    </div>
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="rounded-l-none h-10 w-10"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  size="lg" 
                  className="flex-1" 
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending || !product.inStock}
                >
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    addToCartMutation.mutate();
                    setTimeout(() => setLocation('/checkout'), 500);
                  }}
                  disabled={addToCartMutation.isPending || !product.inStock}
                >
                  Buy Now
                </Button>
              </div>
              
              {/* Product Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm">Free shipping on orders over $99</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm">1-year warranty included</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm">Genuine manufacturer parts</span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm">30-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mb-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl aliquam nunc, vitae aliquam nisl nunc vitae nisl. Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl aliquam nunc, vitae aliquam nisl nunc vitae nisl.</p>
                  <ul>
                    <li>High-quality materials for durability</li>
                    <li>Precision engineered for optimal performance</li>
                    <li>Easy installation</li>
                    <li>Compatible with most motorcycle models</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specifications" className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium">Product Details</div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">SKU:</div>
                        <div>MCPT-{product.id.toString().padStart(4, '0')}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Weight:</div>
                        <div>1.2 lbs</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Dimensions:</div>
                        <div>8" x 4" x 2"</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Material:</div>
                        <div>High-grade aluminum</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium">Compatibility</div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Fits:</div>
                        <div>Most major motorcycle brands</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Honda:</div>
                        <div>CBR, CB, CRF series</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Yamaha:</div>
                        <div>YZF, MT, FZ series</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Kawasaki:</div>
                        <div>Ninja, Z series</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-6">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex flex-col md:flex-row gap-6 md:items-center bg-gray-50 p-6 rounded-lg">
                    <div className="text-center md:border-r md:pr-6 md:w-1/4">
                      <div className="text-5xl font-bold text-gray-800 mb-2">{product.rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(product.rating)}
                      </div>
                      <div className="text-gray-600">Based on {product.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-20 text-sm">5 stars</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-accent h-full" style={{ width: '70%' }}></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600">70%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-sm">4 stars</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-accent h-full" style={{ width: '20%' }}></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600">20%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-sm">3 stars</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-accent h-full" style={{ width: '5%' }}></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600">5%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-sm">2 stars</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-accent h-full" style={{ width: '3%' }}></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600">3%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-sm">1 star</div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-accent h-full" style={{ width: '2%' }}></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-600">2%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Michael R.</div>
                        <div className="text-gray-500 text-sm">3 months ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Great product! Exactly what I needed for my CBR. Installation was easy and the quality is excellent.
                      </p>
                    </div>
                    
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Sarah J.</div>
                        <div className="text-gray-500 text-sm">1 month ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                        <Star className="h-4 w-4 text-accent/30" />
                      </div>
                      <p className="text-gray-700">
                        Good product overall. Shipping was quick and the part fits well on my MT-07. Would have given 5 stars but the installation instructions could be clearer.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">David L.</div>
                        <div className="text-gray-500 text-sm">2 weeks ago</div>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-gray-700">
                        Excellent quality and perfect fit for my Ducati Monster. Customer service was also very helpful when I had questions. Highly recommended!
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products Placeholder */}
          <div>
            <h2 className="text-2xl font-bold font-montserrat mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Would implement actual related products here */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="aspect-square bg-gray-100"></div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">Related Product {i+1}</h3>
                    <div className="flex mt-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`h-4 w-4 ${j < 4 ? 'fill-accent text-accent' : 'text-accent/30'}`} />
                      ))}
                    </div>
                    <div className="text-primary font-bold">$29.99</div>
                  </div>
                </div>
              ))}
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
