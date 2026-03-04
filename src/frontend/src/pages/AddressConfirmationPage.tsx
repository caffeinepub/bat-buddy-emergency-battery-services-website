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
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import {
  type CheckoutAddress,
  serializeCheckoutAddress,
} from "@/utils/checkoutFlow";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MapPin,
  Navigation,
} from "lucide-react";
import { useState } from "react";

export default function AddressConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/address-confirmation" });

  const [addressType, setAddressType] = useState<"manual" | "gps" | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const productId = search.productId;

  // Use reverse geocoding hook to get address from GPS coordinates
  const {
    address: reverseGeocodedAddress,
    isLoading: isReverseGeocoding,
    error: reverseGeocodeError,
  } = useReverseGeocode(
    gpsLocation?.latitude ?? null,
    gpsLocation?.longitude ?? null,
  );

  // Handle missing productId
  if (!productId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle>No Product Selected</CardTitle>
              <CardDescription>
                Please select a battery from the Buy Now page first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: "/buy-now" })}
                className="w-full"
              >
                Go to Buy Now
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRequestLocation = () => {
    setIsLoadingGPS(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      setIsLoadingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAddressType("gps");
        setIsLoadingGPS(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "Location permission denied. Please enable location access or enter your address manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage =
            "Location information is unavailable. Please enter your address manually.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage =
            "Location request timed out. Please try again or enter your address manually.";
        }
        setGpsError(errorMessage);
        setIsLoadingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleManualAddressChange = (value: string) => {
    setManualAddress(value);
    if (value.trim()) {
      setAddressType("manual");
    } else if (!gpsLocation) {
      setAddressType(null);
    }
  };

  const handleConfirm = () => {
    let addressData: CheckoutAddress | null = null;

    if (addressType === "manual" && manualAddress.trim()) {
      addressData = {
        type: "manual",
        address: manualAddress.trim(),
      };
    } else if (addressType === "gps" && gpsLocation) {
      addressData = {
        type: "gps",
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        reverseGeocodedAddress: reverseGeocodedAddress ?? undefined,
      };
    }

    if (addressData) {
      const searchParams = serializeCheckoutAddress(productId, addressData);
      navigate({ to: "/payment-options", search: searchParams });
    }
  };

  const isConfirmDisabled =
    !addressType ||
    (addressType === "manual" && !manualAddress.trim()) ||
    (addressType === "gps" && !gpsLocation);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
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
                Confirm Your Address
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We need your location to deliver the battery and provide service
              </p>
            </div>

            <div className="space-y-6">
              {/* GPS Location Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Use Current Location
                  </CardTitle>
                  <CardDescription>
                    Allow us to access your GPS location for accurate delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleRequestLocation}
                    disabled={isLoadingGPS}
                    className="w-full"
                    size="lg"
                  >
                    {isLoadingGPS ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-5 w-5" />
                        Request Current Location
                      </>
                    )}
                  </Button>

                  {gpsError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{gpsError}</AlertDescription>
                    </Alert>
                  )}

                  {gpsLocation && (
                    <div className="space-y-3">
                      <Alert>
                        <MapPin className="h-4 w-4" />
                        <AlertDescription>
                          <div className="font-semibold mb-1">
                            GPS Location Confirmed
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Coordinates: {gpsLocation.latitude.toFixed(6)}°,{" "}
                            {gpsLocation.longitude.toFixed(6)}°
                          </div>
                        </AlertDescription>
                      </Alert>

                      {isReverseGeocoding && (
                        <Alert>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <AlertDescription>
                            Looking up address from coordinates...
                          </AlertDescription>
                        </Alert>
                      )}

                      {reverseGeocodedAddress && !isReverseGeocoding && (
                        <Alert className="bg-primary/5 border-primary/20">
                          <MapPin className="h-4 w-4 text-primary" />
                          <AlertDescription>
                            <div className="font-semibold text-primary mb-1">
                              Address Found
                            </div>
                            <div className="text-sm">
                              {reverseGeocodedAddress}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {reverseGeocodeError && !isReverseGeocoding && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {reverseGeocodeError}. Your GPS coordinates will
                            still be used for delivery.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manual Address Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Enter Address Manually
                  </CardTitle>
                  <CardDescription>
                    Provide your delivery address if you prefer not to use GPS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-address">Delivery Address</Label>
                    <Input
                      id="manual-address"
                      placeholder="Enter your full address (street, area, city, emirate)"
                      value={manualAddress}
                      onChange={(e) =>
                        handleManualAddressChange(e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Confirm Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    size="lg"
                    className="w-full"
                  >
                    Confirm Address & Continue to Payment
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    Your location information is used only for delivery purposes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
