import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function Header() {
  const navigate = useNavigate();
  const { identity, clear, login, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-primary/20 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/IMG-20260128-WA0008.jpg"
              alt="BAT-BUDDY Logo"
              className="h-12 w-auto"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl md:text-2xl font-bold text-primary">
                BAT‑BUDDY
              </span>
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Power When You Need It.
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/booking")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Book Service
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/buy-now")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/battery-prices")}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Battery Prices
            </button>
            {isAuthenticated && userProfile?.userType === "admin" && (
              <button
                type="button"
                onClick={() => handleNavigation("/admin")}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                Admin
              </button>
            )}
            {isAuthenticated && userProfile?.userType === "technician" && (
              <button
                type="button"
                onClick={() => handleNavigation("/technician")}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                Dashboard
              </button>
            )}
            <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-700 pl-4">
              <a
                href="tel:+971559952721"
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <Phone className="h-4 w-4" />
                055 995 2721
              </a>
              <div className="flex flex-col gap-1">
                <a
                  href="mailto:info@batbuddy.ae"
                  className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  info@batbuddy.ae
                </a>
                <a
                  href="mailto:bookings@batbuddy.ae"
                  className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  bookings@batbuddy.ae
                </a>
                <a
                  href="mailto:help@batbuddy.ae"
                  className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  help@batbuddy.ae
                </a>
              </div>
            </div>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
            >
              {isLoggingIn
                ? "Loading..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-primary/20 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/booking")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Book Service
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/buy-now")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/battery-prices")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              Battery Prices
            </button>
            {isAuthenticated && userProfile?.userType === "admin" && (
              <button
                type="button"
                onClick={() => handleNavigation("/admin")}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                Admin
              </button>
            )}
            {isAuthenticated && userProfile?.userType === "technician" && (
              <button
                type="button"
                onClick={() => handleNavigation("/technician")}
                className="text-left text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
              >
                Dashboard
              </button>
            )}
            <div className="border-t border-gray-300 dark:border-gray-700 pt-3 mt-2">
              <a
                href="tel:+971559952721"
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors mb-3"
              >
                <Phone className="h-4 w-4" />
                055 995 2721
              </a>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:info@batbuddy.ae"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  info@batbuddy.ae
                </a>
                <a
                  href="mailto:bookings@batbuddy.ae"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  bookings@batbuddy.ae
                </a>
                <a
                  href="mailto:help@batbuddy.ae"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  help@batbuddy.ae
                </a>
              </div>
            </div>
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
              className="w-full mt-2"
            >
              {isLoggingIn
                ? "Loading..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
