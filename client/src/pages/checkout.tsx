import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { CreditCard, Truck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartItemWithProduct } from '@/lib/types';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem('cartId') || 'guest';
  const [orderStep, setOrderStep] = useState<'details' | 'payment' | 'complete'>('details');
  const [orderDetails, setOrderDetails] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    sameAsBilling: true,
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<number | null>(null);

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart/${cartId}`],
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) => {
      return apiRequest('POST', '/api/orders', orderData);
    },
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrderStep('complete');
      
      // Generate a new cart ID
      const newCartId = `guest-${Date.now()}`;
      localStorage.setItem('cartId', newCartId);
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
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
  const shipping = subtotal >= 4999 ? 0 : 499; // Free shipping on orders over ₱4,999
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
    
    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setOrderDetails({ ...orderDetails, [name]: checked });
  };

  // Handle radio group change
  const handleRadioChange = (name: string, value: string) => {
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    requiredFields.forEach(field => {
      if (!orderDetails[field as keyof typeof orderDetails]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (orderDetails.email && !/\S+@\S+\.\S+/.test(orderDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (orderDetails.phone && !/^[0-9]{10}$/.test(orderDetails.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Check if billing address is needed
    if (!orderDetails.sameAsBilling) {
      ['billingAddress', 'billingCity', 'billingState', 'billingPostalCode'].forEach(field => {
        if (!orderDetails[field as keyof typeof orderDetails]) {
          errors[field] = 'This field is required';
        }
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for details step
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setOrderStep('payment');
      window.scrollTo(0, 0);
    }
  };

  // Validate payment info
  const validatePayment = () => {
    const errors: Record<string, string> = {};
    
    if (orderDetails.paymentMethod === 'card') {
      // Card number validation
      if (!orderDetails.cardNumber) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^[0-9]{16}$/.test(orderDetails.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      // Expiry validation
      if (!orderDetails.cardExpiry) {
        errors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(orderDetails.cardExpiry)) {
        errors.cardExpiry = 'Please use MM/YY format';
      }
      
      // CVC validation
      if (!orderDetails.cardCvc) {
        errors.cardCvc = 'Security code is required';
      } else if (!/^[0-9]{3,4}$/.test(orderDetails.cardCvc)) {
        errors.cardCvc = 'Please enter a valid security code';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePayment()) {
      // Prepare order data
      const shippingAddress = `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} ${orderDetails.postalCode}`;
      const billingAddress = orderDetails.sameAsBilling 
        ? shippingAddress 
        : `${orderDetails.billingAddress}, ${orderDetails.billingCity}, ${orderDetails.billingState} ${orderDetails.billingPostalCode}`;
      
      // Create order items
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Create order data
      const orderData = {
        cartId,
        order: {
          email: orderDetails.email,
          total: total,
          status: 'pending',
          shippingAddress,
          billingAddress
        },
        items
      };
      
      // Submit order
      createOrderMutation.mutate(orderData);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (orderStep === 'payment') {
      setOrderStep('details');
      window.scrollTo(0, 0);
    } else {
      setLocation('/cart');
    }
  };

  // Empty cart view
  if (!isLoading && cartItems.length === 0 && orderStep !== 'complete') {
    return (
      <>
        <Helmet>
          <title>Checkout - GearUp Auto Parts</title>
          <meta name="description" content="Complete your purchase from GearUp Auto Parts" />
        </Helmet>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-montserrat mb-6">Checkout</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before checking out.</p>
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

  // Order complete view
  if (orderStep === 'complete') {
    return (
      <>
        <Helmet>
          <title>Order Confirmation - GearUp Auto Parts</title>
          <meta name="description" content="Your order has been successfully placed" />
        </Helmet>
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold font-montserrat mb-4">Order Confirmed!</h1>
            <p className="text-lg mb-2">Thank you for your purchase.</p>
            <p className="text-gray-600 mb-6">
              Your order number is: <span className="font-medium">{`#${orderId?.toString().padStart(6, '0')}`}</span>
            </p>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to <span className="font-medium">{orderDetails.email}</span> with your order details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                size="lg"
                onClick={() => setLocation('/shop')}
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setLocation('/')}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - GearUp Auto Parts</title>
        <meta name="description" content="Complete your purchase from GearUp Auto Parts" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-montserrat mb-6">Checkout</h1>
        
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto flex items-center">
            <div className={`flex-1 text-center ${orderStep === 'details' ? 'font-medium' : ''}`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${orderStep === 'details' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                1
              </div>
              <div className="text-sm">Your Details</div>
            </div>
            <div className="w-full max-w-[100px] h-1 bg-gray-200">
              <div className={`h-full bg-primary ${orderStep === 'details' ? 'w-0' : 'w-full'}`}></div>
            </div>
            <div className={`flex-1 text-center ${orderStep === 'payment' ? 'font-medium' : ''}`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${orderStep === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                2
              </div>
              <div className="text-sm">Payment</div>
            </div>
            <div className="w-full max-w-[100px] h-1 bg-gray-200">
              <div className={`h-full bg-primary ${orderStep === 'complete' ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex-1 text-center ${orderStep === 'complete' ? 'font-medium' : ''}`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${orderStep === 'complete' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>
                3
              </div>
              <div className="text-sm">Complete</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {orderStep === 'details' && (
                <form onSubmit={handleDetailsSubmit}>
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={orderDetails.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={orderDetails.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? 'border-red-500' : ''}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={orderDetails.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? 'border-red-500' : ''}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={orderDetails.address}
                        onChange={handleInputChange}
                        className={formErrors.address ? 'border-red-500' : ''}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={orderDetails.city}
                        onChange={handleInputChange}
                        className={formErrors.city ? 'border-red-500' : ''}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          value={orderDetails.state}
                          onChange={handleInputChange}
                          className={formErrors.state ? 'border-red-500' : ''}
                        />
                        {formErrors.state && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input 
                          id="postalCode" 
                          name="postalCode" 
                          value={orderDetails.postalCode}
                          onChange={handleInputChange}
                          className={formErrors.postalCode ? 'border-red-500' : ''}
                        />
                        {formErrors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={orderDetails.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? 'border-red-500' : ''}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameAsBilling" 
                        checked={orderDetails.sameAsBilling}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('sameAsBilling', checked === true)
                        }
                      />
                      <label
                        htmlFor="sameAsBilling"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Billing address is the same as shipping address
                      </label>
                    </div>
                  </div>
                  
                  {!orderDetails.sameAsBilling && (
                    <>
                      <h2 className="text-xl font-bold mb-6">Billing Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="billingAddress">Street Address</Label>
                          <Input 
                            id="billingAddress" 
                            name="billingAddress" 
                            value={orderDetails.billingAddress}
                            onChange={handleInputChange}
                            className={formErrors.billingAddress ? 'border-red-500' : ''}
                          />
                          {formErrors.billingAddress && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.billingAddress}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="billingCity">City</Label>
                          <Input 
                            id="billingCity" 
                            name="billingCity" 
                            value={orderDetails.billingCity}
                            onChange={handleInputChange}
                            className={formErrors.billingCity ? 'border-red-500' : ''}
                          />
                          {formErrors.billingCity && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.billingCity}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingState">State</Label>
                            <Input 
                              id="billingState" 
                              name="billingState" 
                              value={orderDetails.billingState}
                              onChange={handleInputChange}
                              className={formErrors.billingState ? 'border-red-500' : ''}
                            />
                            {formErrors.billingState && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.billingState}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="billingPostalCode">Postal Code</Label>
                            <Input 
                              id="billingPostalCode" 
                              name="billingPostalCode" 
                              value={orderDetails.billingPostalCode}
                              onChange={handleInputChange}
                              className={formErrors.billingPostalCode ? 'border-red-500' : ''}
                            />
                            {formErrors.billingPostalCode && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.billingPostalCode}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back to Cart
                    </Button>
                    <Button type="submit">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}
              
              {orderStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <RadioGroup
                    value={orderDetails.paymentMethod}
                    onValueChange={(value) => handleRadioChange('paymentMethod', value)}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="payment-paypal" />
                      <Label htmlFor="payment-paypal">
                        <svg className="h-6 w-6 mr-2 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.0588 6.69C19.0588 9.62 17.1488 10.99 14.5888 10.99H12.6588C12.2788 10.99 12.0588 11.25 12.0088 11.58L11.3888 16.89C11.3788 16.98 11.3388 17.07 11.2788 17.14C11.2188 17.21 11.1388 17.25 11.0488 17.25H8.09882C7.61882 17.25 7.28882 16.84 7.36882 16.37L9.70882 4.13C9.84882 3.51 10.3688 3.1 10.9988 3.1H17.0988C18.2188 3.1 19.0588 3.73 19.0588 6.69Z" fill="#002C8A"/>
                          <path d="M21.9994 9.33998C21.9994 12.63 19.9594 14.58 16.5894 14.58H15.5494C15.1394 14.58 14.8994 14.87 14.8494 15.23L14.1294 21.2C14.0994 21.48 13.8694 21.69 13.5894 21.69H10.7994C10.3894 21.69 10.0994 21.34 10.1694 20.94L10.6094 17.8C10.6094 17.8 10.6294 17.47 11.0594 17.47H11.9994C15.5294 17.47 18.1294 14.87 18.3894 11.4H17.2794C17.2794 11.4 14.7994 11.4 14.7994 14.29C14.7994 14.29 14.9094 14.58 14.0794 14.58C13.2494 14.58 12.3994 14.58 12.3994 14.58C11.9494 14.58 11.6494 14.2 11.7194 13.76L12.7494 7.11998C12.7494 7.11998 12.7494 6.75998 13.2394 6.75998H14.0794C17.4894 6.75998 19.7594 4.61998 20.0094 1.25H16.4194C15.9294 1.25 15.5394 1.58998 15.4494 2.06998L13.9494 11.54C13.9494 11.54 13.9194 12.01 14.4194 12.01C14.9194 12.01 15.6394 12.01 15.6394 12.01C16.1094 12.01 16.3994 11.69 16.4694 11.23L17.3094 6.28998C17.3494 6.09998 17.5294 5.96998 17.7294 5.96998H18.9794C21.3794 5.96998 21.9994 7.13998 21.9994 9.33998Z" fill="#009BE1"/>
                        </svg>
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {orderDetails.paymentMethod === 'card' && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="font-medium mb-4">Card Details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            name="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            value={orderDetails.cardNumber}
                            onChange={handleInputChange}
                            className={formErrors.cardNumber ? 'border-red-500' : ''}
                          />
                          {formErrors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input 
                              id="cardExpiry" 
                              name="cardExpiry" 
                              placeholder="MM/YY" 
                              value={orderDetails.cardExpiry}
                              onChange={handleInputChange}
                              className={formErrors.cardExpiry ? 'border-red-500' : ''}
                            />
                            {formErrors.cardExpiry && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.cardExpiry}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input 
                              id="cardCvc" 
                              name="cardCvc" 
                              placeholder="123" 
                              value={orderDetails.cardCvc}
                              onChange={handleInputChange}
                              className={formErrors.cardCvc ? 'border-red-500' : ''}
                            />
                            {formErrors.cardCvc && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.cardCvc}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {orderDetails.paymentMethod === 'paypal' && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6 text-center">
                      <p className="mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                      <div className="flex justify-center">
                        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.0588 6.69C19.0588 9.62 17.1488 10.99 14.5888 10.99H12.6588C12.2788 10.99 12.0588 11.25 12.0088 11.58L11.3888 16.89C11.3788 16.98 11.3388 17.07 11.2788 17.14C11.2188 17.21 11.1388 17.25 11.0488 17.25H8.09882C7.61882 17.25 7.28882 16.84 7.36882 16.37L9.70882 4.13C9.84882 3.51 10.3688 3.1 10.9988 3.1H17.0988C18.2188 3.1 19.0588 3.73 19.0588 6.69Z" fill="#002C8A"/>
                          <path d="M21.9994 9.33998C21.9994 12.63 19.9594 14.58 16.5894 14.58H15.5494C15.1394 14.58 14.8994 14.87 14.8494 15.23L14.1294 21.2C14.0994 21.48 13.8694 21.69 13.5894 21.69H10.7994C10.3894 21.69 10.0994 21.34 10.1694 20.94L10.6094 17.8C10.6094 17.8 10.6294 17.47 11.0594 17.47H11.9994C15.5294 17.47 18.1294 14.87 18.3894 11.4H17.2794C17.2794 11.4 14.7994 11.4 14.7994 14.29C14.7994 14.29 14.9094 14.58 14.0794 14.58C13.2494 14.58 12.3994 14.58 12.3994 14.58C11.9494 14.58 11.6494 14.2 11.7194 13.76L12.7494 7.11998C12.7494 7.11998 12.7494 6.75998 13.2394 6.75998H14.0794C17.4894 6.75998 19.7594 4.61998 20.0094 1.25H16.4194C15.9294 1.25 15.5394 1.58998 15.4494 2.06998L13.9494 11.54C13.9494 11.54 13.9194 12.01 14.4194 12.01C14.9194 12.01 15.6394 12.01 15.6394 12.01C16.1094 12.01 16.3994 11.69 16.4694 11.23L17.3094 6.28998C17.3494 6.09998 17.5294 5.96998 17.7294 5.96998H18.9794C21.3794 5.96998 21.9994 7.13998 21.9994 9.33998Z" fill="#009BE1"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="mb-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product?.imageUrl} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm leading-tight">{item.product?.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">₱{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-6">
                {/* Free shipping notification */}
                {subtotal < 4999 && (
                  <div className="mb-2 text-sm p-2 bg-blue-50 text-blue-700 rounded border border-blue-100">
                    Add ₱{(4999 - subtotal).toFixed(2)} more to qualify for FREE shipping!
                  </div>
                )}
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
              
              <div className="text-sm text-gray-600">
                <p className="flex items-center mb-2">
                  <Truck className="h-4 w-4 mr-2" />
                  {shipping === 0 ? (
                    <span className="text-success">Free shipping applied!</span>
                  ) : (
                    <span>Free shipping on orders over ₱4,999</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
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
