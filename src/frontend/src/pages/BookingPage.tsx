import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useCreateBooking, useFindCompatibleBatteries, useGetServiceAreas } from '../hooks/useQueries';
import { ServiceType } from '../backend';
import { Calendar, MapPin, Battery, Zap, Loader2, Navigation, AlertCircle, Search } from 'lucide-react';

export default function BookingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');

  // Booking form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [emirate, setEmirate] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.batteryReplacement);
  const [selectedBattery, setSelectedBattery] = useState('');

  // GPS state
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // Battery finder state
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const createBooking = useCreateBooking();
  const { data: serviceAreas = [] } = useGetServiceAreas();
  
  // Use the compatible batteries hook
  const { 
    data: compatibleBatteries = [], 
    isLoading: isSearchingBatteries,
    isFetched: hasSearchResults
  } = useFindCompatibleBatteries(carMake, carModel, carYear);

  // Reverse geocoding function using OpenStreetMap Nominatim API
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const addr = data.address;
        const street = addr.road || addr.suburb || addr.neighbourhood || '';
        const cityName = addr.city || addr.town || addr.village || addr.state || '';
        const emirateName = addr.state || addr.region || '';
        
        setAddress(street || data.display_name);
        setCity(cityName);
        setEmirate(emirateName);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.error('Could not fetch address details. Please enter manually.');
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    setLocationPermissionDenied(false);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        setLatitude(lat);
        setLongitude(lon);
        setIsLoadingLocation(false);
        
        toast.success('Location detected successfully!');
        
        // Fetch address details
        await reverseGeocode(lat, lon);
      },
      (error) => {
        setIsLoadingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enter your location manually.');
            setLocationPermissionDenied(true);
            toast.error('Location permission denied. Please enter manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            toast.error('Location unavailable. Please enter manually.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An unknown error occurred.');
            toast.error('Could not get location. Please enter manually.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email || !address || !city || !emirate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const bookingId = await createBooking.mutateAsync({
        customerId: `CUST-${Date.now()}`,
        serviceType,
        batteryId: selectedBattery || undefined,
        location: {
          address,
          city,
          emirate,
          latitude: latitude || 25.2048,
          longitude: longitude || 55.2708,
        },
      });

      toast.success('Booking created successfully!', {
        description: `Booking ID: ${bookingId}. Our technician will contact you shortly.`,
      });

      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('');
      setEmirate('');
      setLatitude(null);
      setLongitude(null);
      setSelectedBattery('');

      setTimeout(() => {
        navigate({ to: '/' });
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleBatterySearch = () => {
    if (!carMake || !carModel || !carYear) {
      toast.error('Please fill in all vehicle details');
      return;
    }

    setHasSearched(true);
  };

  // Show results message after search completes
  useEffect(() => {
    if (hasSearched && hasSearchResults && !isSearchingBatteries) {
      if (compatibleBatteries.length > 0) {
        toast.success('Battery search completed!', {
          description: `Found ${compatibleBatteries.length} compatible ${compatibleBatteries.length === 1 ? 'battery' : 'batteries'} for your ${carMake} ${carModel} ${carYear}`,
        });
      }
    }
  }, [hasSearched, hasSearchResults, isSearchingBatteries, compatibleBatteries.length, carMake, carModel, carYear]);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Book Your Service</h1>
            <p className="text-xl text-muted-foreground">Fast, reliable battery service at your location</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="booking">
                <Calendar className="mr-2 h-4 w-4" />
                Book Service
              </TabsTrigger>
              <TabsTrigger value="finder">
                <Battery className="mr-2 h-4 w-4" />
                Battery Finder
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Service Booking Form</CardTitle>
                  <CardDescription>Fill in your details and we'll dispatch a technician to your location</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+971 50 123 4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    {/* GPS Location Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Location</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={isLoadingLocation}
                        >
                          {isLoadingLocation ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Detecting...
                            </>
                          ) : (
                            <>
                              <Navigation className="mr-2 h-4 w-4" />
                              Use My Location
                            </>
                          )}
                        </Button>
                      </div>

                      {locationError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{locationError}</AlertDescription>
                        </Alert>
                      )}

                      {latitude && longitude && (
                        <Alert>
                          <MapPin className="h-4 w-4" />
                          <AlertDescription>
                            Location detected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Building name, street name"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Dubai"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="emirate">Emirate *</Label>
                        <Select value={emirate} onValueChange={setEmirate} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select emirate" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceAreas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Select
                        value={serviceType}
                        onValueChange={(value) => setServiceType(value as ServiceType)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceType.batteryReplacement}>Battery Replacement</SelectItem>
                          <SelectItem value={ServiceType.jumpStart}>Jump Start Service</SelectItem>
                          <SelectItem value={ServiceType.roadsideAssistance}>Roadside Assistance</SelectItem>
                          <SelectItem value={ServiceType.fleetManagement}>Fleet Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {serviceType === ServiceType.batteryReplacement && compatibleBatteries.length > 0 && (
                      <div>
                        <Label htmlFor="battery">Select Battery (Optional)</Label>
                        <Select value={selectedBattery} onValueChange={setSelectedBattery}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a battery or let technician recommend" />
                          </SelectTrigger>
                          <SelectContent>
                            {compatibleBatteries.map((battery) => (
                              <SelectItem key={battery.id} value={battery.id}>
                                {battery.brand} {battery.model} - {Number(battery.capacity)}Ah - AED {Number(battery.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? 'Creating Booking...' : 'Book Service Now'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finder">
              <Card>
                <CardHeader>
                  <CardTitle>Battery Finder Tool</CardTitle>
                  <CardDescription>Find the perfect battery for your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="make">Car Make *</Label>
                        <Input
                          id="make"
                          value={carMake}
                          onChange={(e) => setCarMake(e.target.value)}
                          placeholder="e.g., Toyota"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Car Model *</Label>
                        <Input
                          id="model"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          placeholder="e.g., Camry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year *</Label>
                        <Input
                          id="year"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          placeholder="e.g., 2020"
                          type="number"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleBatterySearch}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={isSearchingBatteries || !carMake || !carModel || !carYear}
                    >
                      {isSearchingBatteries ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Find Compatible Batteries
                        </>
                      )}
                    </Button>

                    {/* Show results after search */}
                    {hasSearched && hasSearchResults && !isSearchingBatteries && (
                      <>
                        {compatibleBatteries.length > 0 ? (
                          <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">
                              Compatible Batteries ({compatibleBatteries.length})
                            </h3>
                            <div className="grid gap-4">
                              {compatibleBatteries.map((battery) => (
                                <Card key={battery.id}>
                                  <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                      <div className="flex gap-4 flex-1">
                                        <img
                                          src="/assets/generated/car-battery-product.dim_400x400.jpg"
                                          alt={`${battery.brand} ${battery.model}`}
                                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                                          loading="lazy"
                                        />
                                        <div className="flex-1">
                                          <h4 className="font-semibold">
                                            {battery.brand} {battery.model}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            Capacity: {Number(battery.capacity)}Ah
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            Warranty: {Number(battery.warrantyMonths)} months
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            Stock: {Number(battery.stock)} units
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right sm:text-left w-full sm:w-auto">
                                        <p className="text-2xl font-bold text-amber-600">AED {Number(battery.price)}</p>
                                        <Button
                                          size="sm"
                                          className="mt-2 w-full sm:w-auto"
                                          onClick={() => {
                                            setSelectedBattery(battery.id);
                                            setActiveTab('booking');
                                            toast.success('Battery selected! Complete the booking form.');
                                          }}
                                        >
                                          Select & Book
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              No batteries found for {carMake} {carModel} {carYear}. Please try different search criteria or contact us for assistance.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
