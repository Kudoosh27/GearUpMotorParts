import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Trash2, ChevronLeft, Plus, Minus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartItemWithProduct } from '@/lib/types';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem('cartId') || 'guest';

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart/${cartId}`],
  });

  // Update cart item mutation
  const updateCartMutation = useMutation({
    mutationFn: (data: { id: number; quantity: number }) => {
      return apiRequest('PUT', `/api/cart/${data.id}`, { quantity: data.quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Remove cart item mutation
  const removeCartMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => {
      return apiRequest('DELETE', `/api/cart/clear/${cartId}`);
    },
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not clear cart. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= 4999 ? 0 : 499;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  // Handle quantity change
  const handleQuantityChange = (item: CartItemWithProduct, amount: number) => {
    const newQuantity = Math.max(1, item.quantity + amount);
    if (newQuantity === item.quantity) return;
    
    updateCartMutation.mutate({ id: item.id, quantity: newQuantity });
  };

  // Empty cart view
  if (!isLoading && cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart - GearUp Auto Parts</title>
          <meta name="description" content="View and manage the items in your shopping cart" />
        </Helmet>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-montserrat mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              variant="default" 
              size="lg"
              onClick={() => setLocation('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart - GearUp Auto Parts</title>
        <meta name="description" content="View and manage the items in your shopping cart" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-montserrat mb-6">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-12 bg-gray-100 mb-6"></div>
                <div className="h-24 bg-gray-100 mb-4"></div>
                <div className="h-24 bg-gray-100 mb-4"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.product?.imageUrl} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <h3 className="font-medium">{item.product?.name}</h3>
                            <p className="text-sm text-gray-600">SKU: MCPT-{item.product?.id.toString().padStart(4, '0')}</p>
                          </div>
                        </TableCell>
                        <TableCell>₱{item.product?.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex border border-gray-300 rounded-md w-32">
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="rounded-r-none h-8 w-8"
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={item.quantity === 1 || updateCartMutation.isPending}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="flex items-center justify-center h-8 w-12 border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <Button 
                              variant="ghost"
                              size="icon"
                              className="rounded-l-none h-8 w-8"
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={updateCartMutation.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => removeCartMutation.mutate(item.id)}
                            disabled={removeCartMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="p-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <Button 
                    variant="ghost" 
                    className="text-primary"
                    onClick={() => setLocation('/shop')}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => clearCartMutation.mutate()}
                      disabled={clearCartMutation.isPending}
                    >
                      Clear Cart
                    </Button>
                    <Button variant="ghost" className="flex items-center">
                      <Store className="mr-2 h-4 w-4" />
                      Find in Store
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    <span>₱{shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span>₱{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mb-4"
                size="lg"
                onClick={() => setLocation('/checkout')}
                disabled={isLoading || cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">We accept:</p>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium mb-3">Have a Promo Code?</h3>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Enter code" 
                  className="flex-1 border border-r-0 border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
                />
                <Button 
                  variant="default" 
                  className="rounded-l-none"
                >
                  Apply
                </Button>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <div className="flex">
                <div className="mr-4 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure Checkout</h3>
                  <p className="text-sm text-gray-600">Your data is protected with 256-bit SSL encryption.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
