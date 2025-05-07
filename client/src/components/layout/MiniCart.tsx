import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { CartItemWithProduct } from '@/lib/types';

export default function MiniCart() {
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem('cartId') || 'guest';

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart/${cartId}`],
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => {
      return apiRequest('DELETE', `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${cartId}`] });
    },
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="absolute right-0 w-80 bg-white shadow-lg rounded-lg z-20 hidden group-hover:block">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Your Cart</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          <p>Your cart is empty</p>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/shop">
            <Button variant="default" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 w-80 bg-white shadow-lg rounded-lg z-20 hidden group-hover:block">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Cart ({cartItems.length} items)</h3>
      </div>
      <div className="max-h-64 overflow-y-auto p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <img 
              src={item.product?.imageUrl} 
              alt={item.product?.name} 
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.product?.name}</h4>
              <p className="text-gray-600 text-xs">{item.quantity} × ₱{item.product?.price.toFixed(2)}</p>
            </div>
            <button 
              className="text-gray-500 hover:text-red-600"
              onClick={() => removeItemMutation.mutate(item.id)}
              disabled={removeItemMutation.isPending}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between mb-3">
          <span className="font-medium">Subtotal:</span>
          <span className="font-medium">₱{calculateSubtotal()}</span>
        </div>
        <div className="space-y-2">
          <Link href="/checkout">
            <Button variant="default" className="w-full">
              Checkout
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="secondary" className="w-full">
              View Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
