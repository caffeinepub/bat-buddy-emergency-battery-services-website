import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/data/buyNowProducts";
import { useGetReceiverBankAccountDetails } from "@/hooks/useQueries";
import { deserializeCheckoutAddress } from "@/utils/checkoutFlow";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  Copy,
  CreditCard,
  MapPin,
  Navigation,
  Package,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentOptionsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/payment-options" });
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Mobile payment state
  const [phoneNumber, setPhoneNumber] = useState("");

  const product = search.productId
    ? getProductById(search.productId)
    : undefined;
  const addressData = deserializeCheckoutAddress(search);
  const { data: bankAccountDetails, isLoading: bankDetailsLoading } =
    useGetReceiverBankAccountDetails();

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay securely with your credit or debit card",
      icon: CreditCard,
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      description: "Apple Pay, Google Pay, Samsung Pay",
      icon: Wallet,
    },
    {
      id: "mobile",
      name: "Mobile Payment",
      description: "Pay using mobile payment apps",
      icon: Smartphone,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank transfer or wire payment",
      icon: Building2,
    },
  ];

  // Validation for card details
  const isCardDetailsValid = () => {
    if (selectedMethod !== "card") return true;
    return (
      cardNumber.trim().length >= 13 &&
      cardExpiry.trim().length >= 4 &&
      cardCVV.trim().length >= 3
    );
  };

  // Validation for mobile payment
  const isMobilePaymentValid = () => {
    if (selectedMethod !== "mobile") return true;
    return phoneNumber.trim().length >= 9;
  };

  const canProceed =
    selectedMethod && isCardDetailsValid() && isMobilePaymentValid();

  const handleProceed = () => {
    if (canProceed) {
      navigate({ to: "/payment-success" });
    }
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (_error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatGPSCoordinates = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? "N" : "S";
    const lngDir = lng >= 0 ? "E" : "W";
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/buy-now" })}
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
                  No delivery address confirmed. Please go back and confirm your
                  address first.
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
                    <RadioGroup
                      value={selectedMethod}
                      onValueChange={setSelectedMethod}
                    >
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
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem
                                  value={method.id}
                                  id={method.id}
                                />
                                <div
                                  className={`p-3 rounded-lg ${
                                    isSelected
                                      ? "bg-primary text-white"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                  }`}
                                >
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
                {selectedMethod === "card" && (
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
                    </CardContent>
                  </Card>
                )}

                {/* Mobile Payment Form */}
                {selectedMethod === "mobile" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Mobile Payment Details</CardTitle>
                      <CardDescription>
                        Enter your mobile number for payment
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
                    </CardContent>
                  </Card>
                )}

                {/* Bank Transfer Details */}
                {selectedMethod === "bank" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Bank Transfer Instructions
                      </CardTitle>
                      <CardDescription>
                        Transfer the total amount to the account below and
                        upload proof of payment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {bankDetailsLoading ? (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Loading bank details...
                          </p>
                        </div>
                      ) : bankAccountDetails ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              <strong>Important:</strong> Please transfer the
                              exact amount shown in your order summary to the
                              account below. After completing the transfer, keep
                              your receipt for reference.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  Bank Name
                                </div>
                                <div className="font-semibold">
                                  {bankAccountDetails.bankName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  Account Holder
                                </div>
                                <div className="font-semibold">
                                  {bankAccountDetails.accountHolderName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">
                                  Account Number
                                </div>
                                <div className="font-mono font-semibold">
                                  {bankAccountDetails.accountNumber}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleCopyToClipboard(
                                    bankAccountDetails.accountNumber,
                                    "Account Number",
                                  )
                                }
                              >
                                {copiedField === "Account Number" ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">
                                  IBAN
                                </div>
                                <div className="font-mono font-semibold uppercase break-all">
                                  {bankAccountDetails.iban}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleCopyToClipboard(
                                    bankAccountDetails.iban,
                                    "IBAN",
                                  )
                                }
                              >
                                {copiedField === "IBAN" ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">
                                  SWIFT/BIC Code
                                </div>
                                <div className="font-mono font-semibold uppercase">
                                  {bankAccountDetails.swiftBic}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleCopyToClipboard(
                                    bankAccountDetails.swiftBic,
                                    "SWIFT/BIC",
                                  )
                                }
                              >
                                {copiedField === "SWIFT/BIC" ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg mt-4">
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                              <strong>Next Steps:</strong> After completing the
                              bank transfer, please contact us at{" "}
                              <a
                                href="mailto:info@batbuddy.ae"
                                className="underline"
                              >
                                info@batbuddy.ae
                              </a>{" "}
                              or call{" "}
                              <a href="tel:+971559952721" className="underline">
                                055 995 2721
                              </a>{" "}
                              with your payment confirmation.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Bank account details are not available at the
                            moment. Please contact support or choose another
                            payment method.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {product && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Quantity: 1
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Subtotal
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {product.priceDisplay}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Delivery
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Free
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Total
                            </span>
                            <span className="font-bold text-xl text-primary">
                              {product.priceDisplay}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {addressData && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            {addressData.type === "gps" ? (
                              <Navigation className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            ) : (
                              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                                Delivery Address
                              </h4>
                              {addressData.type === "manual" &&
                                addressData.address && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                                    {addressData.address}
                                  </p>
                                )}
                              {addressData.type === "gps" && (
                                <div className="space-y-2">
                                  {addressData.reverseGeocodedAddress && (
                                    <div className="text-sm text-gray-900 dark:text-white font-medium break-words">
                                      {addressData.reverseGeocodedAddress}
                                    </div>
                                  )}
                                  {addressData.latitude !== undefined &&
                                    addressData.longitude !== undefined && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        GPS:{" "}
                                        {formatGPSCoordinates(
                                          addressData.latitude,
                                          addressData.longitude,
                                        )}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <Button
                      onClick={handleProceed}
                      disabled={!canProceed}
                      size="lg"
                      className="w-full"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Complete Purchase
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      By completing this purchase, you agree to our terms and
                      conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
