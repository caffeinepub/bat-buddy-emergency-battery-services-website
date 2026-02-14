import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { batteryProducts } from '@/data/buyNowProducts';

export default function BuyNowPage() {
  const navigate = useNavigate();

  const handleBuyNow = (productId: string) => {
    navigate({ to: '/address-confirmation', search: { productId } });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Buy Car Batteries
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our wide selection of premium car batteries. Fast delivery and professional installation available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {batteryProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-square bg-white dark:bg-gray-800 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {product.priceDisplay}
                  </p>
                  <Button
                    onClick={() => handleBuyNow(product.id)}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
