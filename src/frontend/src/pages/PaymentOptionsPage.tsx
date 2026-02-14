import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Building2, Package, MapPin, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { getProductById } from '@/data/buyNowProducts';
import { deserializeCheckoutAddress } from '@/utils/checkoutFlow';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentOptionsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/payment-options' });
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Mobile payment state
  const [phoneNumber, setPhoneNumber] = useState('');

  const product = search.productId ? getProductById(search.productId) : undefined;
  const addressData = deserializeCheckoutAddress(search);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: CreditCard,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'Apple Pay, Google Pay, Samsung Pay',
      icon: Wallet,
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      description: 'Pay using mobile payment apps',
      icon: Smartphone,
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer or wire payment',
      icon: Building2,
    },
  ];

  // Validation for card details
  const isCardDetailsValid = () => {
    if (selectedMethod !== 'card') return true;
    return cardNumber.trim().length >= 13 && 
           cardExpiry.trim().length >= 4 && 
           cardCVV.trim().length >= 3;
  };

  // Validation for mobile payment
  const isMobilePaymentValid = () => {
    if (selectedMethod !== 'mobile') return true;
    return phoneNumber.trim().length >= 9;
  };

  const canProceed = selectedMethod && isCardDetailsValid() && isMobilePaymentValid();

  const handleProceed = () => {
    if (canProceed) {
      navigate({ to: '/payment-success' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/buy-now' })}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Options
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Choose your preferred payment method to complete your purchase
              </p>
            </div>

            {!addressData && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No delivery address confirmed. Please go back and confirm your address first.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                    <CardDescription>
                      All payment methods are secure and encrypted
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => {
                          const Icon = method.icon;
                          const isSelected = selectedMethod === method.id;
                          
                          return (
                            <div key={method.id}>
                              <Label
                                htmlFor={method.id}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                              >
                                <RadioGroupItem value={method.id} id={method.id} />
                                <div className={`p-3 rounded-lg ${
                                  isSelected
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {method.name}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {method.description}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Card Details Form */}
                {selectedMethod === 'card' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Details</CardTitle>
                      <CardDescription>
                        Enter your credit or debit card information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>
                      {!isCardDetailsValid() && cardNumber && (
                        <p className="text-sm text-destructive">
                          Please fill in all card details correctly
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Mobile Payment Form */}
                {selectedMethod === 'mobile' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Mobile Payment Details</CardTitle>
                      <CardDescription>
                        Enter your phone number for mobile payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input
                          id="phone-number"
                          placeholder="+971 50 123 4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      {!isMobilePaymentValid() && phoneNumber && (
                        <p className="text-sm text-destructive">
                          Please enter a valid phone number
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {product ? (
                      <>
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Quantity: 1
                            </p>
                          </div>
                        </div>
                        
                        <Separator />

                        {/* Delivery Address */}
                        {addressData && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                <MapPin className="h-4 w-4" />
                                Delivery Address
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                                {addressData.type === 'manual' && addressData.address}
                                {addressData.type === 'gps' && `GPS: ${addressData.latitude?.toFixed(6)}, ${addressData.longitude?.toFixed(6)}`}
                              </p>
                            </div>
                            <Separator />
                          </>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {product.priceDisplay}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Free
                            </span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                          <span className="text-2xl font-bold text-primary">
                            {product.priceDisplay}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No product selected
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Please select a product from the Buy Now page
                        </p>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleProceed}
                      disabled={!canProceed}
                      size="lg"
                      className="w-full"
                    >
                      {!selectedMethod 
                        ? 'Select a Payment Method' 
                        : !canProceed 
                        ? 'Complete Payment Details' 
                        : 'Proceed to Payment'}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Your payment information is secure and encrypted
                    </p>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need help? Contact us at{' '}
                    <a href="tel:+971559952721" className="text-primary hover:underline">
                      055 995 2721
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <a href="mailto:help@batbuddy.ae" className="text-primary hover:underline">
                      help@batbuddy.ae
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
