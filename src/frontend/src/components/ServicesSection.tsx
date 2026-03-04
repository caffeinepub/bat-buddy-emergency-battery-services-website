import { Card, CardContent } from "@/components/ui/card";
import { Battery, TrendingUp, Wrench, Zap } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Battery,
      title: "Car Battery Replacement",
      description:
        "Premium quality batteries with up to 24 months warranty. Installed on-site within 30 minutes.",
    },
    {
      icon: Zap,
      title: "Jump Start Service",
      description:
        "Quick jump start service to get you back on the road. Available 24/7 across UAE.",
    },
    {
      icon: Wrench,
      title: "Roadside Assistance",
      description:
        "Complete roadside support including battery testing, diagnostics, and emergency repairs.",
    },
    {
      icon: TrendingUp,
      title: "Fleet Battery Management",
      description:
        "Comprehensive battery management solutions for corporate fleets with scheduled maintenance.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Our Services
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Comprehensive battery solutions for every need
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Card
            key={service.title}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="pt-6">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
