import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Battery as BatteryIcon, ShoppingCart } from "lucide-react";

export default function BatteryPriceListPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BatteryIcon className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Battery Prices
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Quality batteries at transparent prices — delivered and installed
            within 30 minutes anywhere in UAE
          </p>
        </div>

        {/* Battery Product Cards */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            data-ocid="battery_price.card"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0016-1.jpg"
                  alt="ACDelco SMF 47-7 DIN60 12V 60AH Car Battery"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Normal DIN 60 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  ACDelco SMF 47-7 DIN60 12V 60AH
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      400 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      450 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.1"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Third Battery Card - DIN 74 */}
          <Card
            data-ocid="battery_price.card.3"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0018-1.jpg"
                  alt="ACDelco SMF 27-74 DIN74 12V 74AH Car Battery - Normal DIN 74"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Normal DIN 74 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  ACDelco SMF 27-74 DIN74 12V 74AH
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      400 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      450 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.3"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fourth Battery Card - Standard DIN 60 (VARTA) */}
          <Card
            data-ocid="battery_price.card.4"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0019-1.jpg"
                  alt="VARTA Blue Dynamic D59 SMF DIN60 12V 60AH Car Battery - Standard DIN 60"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Standard DIN 60 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA SMF DIN 60 60AH D59 MF56077
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      495 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      545 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.4"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Second Battery Card - DIN 80 */}
          <Card
            data-ocid="battery_price.card.2"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0017-1.jpg"
                  alt="ACDelco SMF 65-72S 12V 75AH Car Battery - Normal DIN 80"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Normal DIN 80 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  ACDelco SMF 65-72S 12V 75AH
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      500 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      550 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.2"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sixth Battery Card - Standard DIN 74 (VARTA E11) */}
          <Card
            data-ocid="battery_price.card.6"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0021-1.jpg"
                  alt="VARTA 12V DIN74 74AH E11 MF57412 Car Battery - Standard DIN 74"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Standard DIN 74 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA 12V DIN74 74AH E11 MF57412
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      550 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      600 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.6"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seventh Battery Card - AGM 95 (VARTA G14) */}
          <Card
            data-ocid="battery_price.card.7"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0022-1.jpg"
                  alt="VARTA 12V DIN95 95AH G14 AGM L5 Car Battery - AGM 95"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  AGM 95 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA 12V DIN95 95AH G14 AGM L5
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      1000 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      1050 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.7"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Eighth Battery Card - AGM 80 (VARTA F21) */}
          <Card
            data-ocid="battery_price.card.8"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0023-1.jpg"
                  alt="VARTA 12V DIN80 80AH F21 AGM L4 Car Battery - AGM 80"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  AGM 80 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA 12V DIN80 80AH F21 AGM L4
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      850 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      900 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.8"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ninth Battery Card - AGM 70 (VARTA E39) */}
          <Card
            data-ocid="battery_price.card.9"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0024-1.jpg"
                  alt="VARTA 12V DIN70 70AH E39 AGM L3 Car Battery - AGM 70"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  AGM 70 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA 12V DIN70 70AH E39 AGM L3
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      750 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      800 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.9"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tenth Battery Card - AGM 95 (Bosch S5 A07) */}
          <Card
            data-ocid="battery_price.card.10"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0015-1.jpg"
                  alt="Bosch 12V DIN95 95AH S5 A07 AGM Car Battery - AGM 95"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  AGM 95 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Bosch 12V DIN95 95AH S5 A07 AGM
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      1000 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      1050 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.10"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fifth Battery Card - Standard DIN 80 (VARTA F17) */}
          <Card
            data-ocid="battery_price.card.5"
            className="shadow-xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden"
          >
            <CardContent className="p-0">
              {/* Battery Image */}
              <div className="relative bg-white dark:bg-gray-800">
                <img
                  src="/assets/uploads/IMG-20260304-WA0020-1.jpg"
                  alt="VARTA 12V DIN80 80AH F17 MF58039 Car Battery - Standard DIN 80"
                  className="w-full object-cover"
                />
              </div>

              {/* Pricing Info */}
              <div className="p-6 bg-white dark:bg-gray-900">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Standard DIN 80 Battery
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  VARTA 12V DIN80 80AH F17 MF58039
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Price
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      600 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Installation Fee
                    </span>
                    <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                      50 AED
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3">
                    <span className="text-gray-900 dark:text-white font-bold">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      650 AED
                    </span>
                  </div>
                </div>

                <Button
                  data-ocid="battery_price.primary_button.5"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: "/buy-now" })}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                30 min
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Delivery &amp; Installation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600 mb-1">24/7</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Emergency Service
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600 mb-1">
                1 Year
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Warranty Included
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
