import { useNavigate } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                  <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Payment Failed</CardTitle>
              <CardDescription>We couldn't process your payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Your payment was not successful. Please try again or contact our support team for assistance.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate({ to: '/booking' })}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Try Again
                </Button>
                <Button onClick={() => navigate({ to: '/' })} variant="outline" className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
