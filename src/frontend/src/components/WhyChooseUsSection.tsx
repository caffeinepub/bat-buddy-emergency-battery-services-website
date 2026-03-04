import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Smartphone,
} from "lucide-react";

export default function WhyChooseUsSection() {
  const whyChooseUs = [
    {
      icon: Clock,
      title: "Within 30 Minutes Arrival",
      description: "Fast response time guaranteed",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden charges",
    },
    {
      icon: Award,
      title: "Premium Brands",
      description: "Genuine batteries only",
    },
    {
      icon: Smartphone,
      title: "Apple Pay / Google Pay",
      description: "Convenient payment options",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track technician location",
    },
    {
      icon: CheckCircle2,
      title: "Free Battery Testing",
      description: "Complimentary diagnostics",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Why Choose Bat Buddy
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            The best battery service experience in UAE
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-6">
                <item.icon className="h-8 w-8 md:h-10 md:w-10 text-amber-600 mb-4" />
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
