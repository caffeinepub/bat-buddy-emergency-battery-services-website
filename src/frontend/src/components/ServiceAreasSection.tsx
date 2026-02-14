import { MapPin } from 'lucide-react';

export default function ServiceAreasSection() {
  const areas = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Serving All of UAE</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
            Our mobile service units cover all major cities and emirates across the UAE. No matter where you are, we'll
            reach you within 30 minutes.
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {areas.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0" />
                <span className="text-sm md:text-base">{area}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img
            src="/assets/generated/uae-service-map.dim_600x400.png"
            alt="Bat Buddy UAE Service Coverage Map"
            className="rounded-2xl shadow-xl w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
