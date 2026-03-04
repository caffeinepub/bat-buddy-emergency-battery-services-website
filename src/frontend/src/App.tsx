import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { StrictMode, useEffect, useState } from "react";
import Layout from "./components/Layout";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AddressConfirmationPage from "./pages/AddressConfirmationPage";
import AdminDashboard from "./pages/AdminDashboard";
import BookingPage from "./pages/BookingPage";
import BuyNowPage from "./pages/BuyNowPage";
import HomePage from "./pages/HomePage";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentOptionsPage from "./pages/PaymentOptionsPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import TechnicianDashboard from "./pages/TechnicianDashboard";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: BookingPage,
});

const buyNowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/buy-now",
  component: BuyNowPage,
});

const addressConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/address-confirmation",
  component: AddressConfirmationPage,
  validateSearch: (search: Record<string, unknown>): { productId?: string } => {
    return {
      productId:
        typeof search.productId === "string" ? search.productId : undefined,
    };
  },
});

const paymentOptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-options",
  component: PaymentOptionsPage,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    productId?: string;
    addressType?: "manual" | "gps";
    address?: string;
    latitude?: string;
    longitude?: string;
  } => {
    return {
      productId:
        typeof search.productId === "string" ? search.productId : undefined,
      addressType:
        search.addressType === "manual" || search.addressType === "gps"
          ? search.addressType
          : undefined,
      address: typeof search.address === "string" ? search.address : undefined,
      latitude:
        typeof search.latitude === "string" ? search.latitude : undefined,
      longitude:
        typeof search.longitude === "string" ? search.longitude : undefined,
    };
  },
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const technicianRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/technician",
  component: TechnicianDashboard,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  bookingRoute,
  buyNowRoute,
  addressConfirmationRoute,
  paymentOptionsRoute,
  adminRoute,
  technicianRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (
      isAuthenticated &&
      !profileLoading &&
      isFetched &&
      userProfile === null
    ) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Loading Bat Buddy
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup ? <ProfileSetup /> : <RouterProvider router={router} />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
