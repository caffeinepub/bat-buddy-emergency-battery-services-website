import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  Battery,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Shield,
  Smartphone,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { Suspense, lazy } from "react";
import { SiWhatsapp } from "react-icons/si";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Lazy load non-critical sections
const ServicesSection = lazy(() => import("../components/ServicesSection"));
const WhyChooseUsSection = lazy(
  () => import("../components/WhyChooseUsSection"),
);
const ServiceAreasSection = lazy(
  () => import("../components/ServiceAreasSection"),
);

export default function HomePage() {
  const navigate = useNavigate();

  const trustPoints = [
    { icon: Shield, text: "Certified Technicians" },
    { icon: Wrench, text: "Free Installation" },
    { icon: Award, text: "On-Spot Warranty" },
    { icon: CheckCircle2, text: "No Towing Required" },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Critical, loads immediately */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                24/7 Emergency Service
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Car Battery Replacement in{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  30 Minutes
                </span>{" "}
                Anywhere in UAE
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                24/7 Emergency Service | Genuine Batteries | Up to 24 Months
                Warranty
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Button size="lg" onClick={() => navigate({ to: "/booking" })}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Battery
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+971559952721">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 border-green-500"
                  asChild
                >
                  <a
                    href="https://wa.me/971559952721"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiWhatsapp className="mr-2 h-5 w-5 text-green-600" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/IMG-20260128-WA0007.jpg"
                alt="BAT-BUDDY Technician Service"
                className="rounded-2xl shadow-2xl w-full h-auto"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Images Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/assets/IMG-20260221-WA0002-2.jpg"
              alt="Call Your BAT-BUDDY - 30 Min Express Installation, 18-24 Months Warranty, Fast 24/7 Service in UAE"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/assets/IMG-20260221-WA0001-2.jpg"
              alt="BAT-BUDDY Power Solutions - Fast, Reliable, 24/7 Service Anywhere in UAE"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Trust Line - Critical, loads immediately */}
      <section className="bg-white dark:bg-gray-800 py-6 md:py-8 border-y border-primary/20 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustPoints.map((point) => (
              <div
                key={point.text}
                className="flex items-center gap-2 md:gap-3 justify-center"
              >
                <point.icon className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <span className="font-medium text-xs md:text-base">
                  {point.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Van Showcase */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Professional Service,{" "}
            <span className="text-primary">Anywhere You Are</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our fully-equipped service vans bring the workshop to you, ensuring
            fast and reliable battery replacement on-site.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <img
            src="/assets/IMG-20260128-WA0010.jpg"
            alt="BAT-BUDDY Service Van"
            className="rounded-2xl shadow-2xl w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>

      {/* Lazy-loaded sections with loading fallback */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <WhyChooseUsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ServiceAreasSection />
      </Suspense>

      {/* CTA Section - Critical for conversions */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Need Emergency Battery Service?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            We're available 24/7 to help you get back on the road
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => navigate({ to: "/booking" })}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="tel:+971559952721">
                <Phone className="mr-2 h-5 w-5" />
                055 995 2721
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Loading skeleton for lazy-loaded sections
function SectionSkeleton() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-12 mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
