import { Heart, Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/assets/IMG-20260128-WA0008.jpg"
                alt="BAT-BUDDY Logo"
                className="h-16 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary">
                  BAT‑BUDDY
                </span>
                <span className="text-xs text-gray-400">
                  Power When You Need It.
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              24/7 Emergency Car Battery Replacement Service across UAE.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  className="hover:text-primary transition-colors"
                >
                  Book Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Battery Replacement</li>
              <li>Jump Start Service</li>
              <li>Roadside Assistance</li>
              <li>Fleet Management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="tel:+971559952721"
                  className="hover:text-primary transition-colors"
                >
                  Phone: 055 995 2721
                </a>
              </li>
              <li>Available: 24/7</li>
            </ul>
            <div className="mt-4">
              <h5 className="font-semibold mb-2 text-sm">Email</h5>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:info@batbuddy.ae"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  info@batbuddy.ae
                </a>
                <a
                  href="mailto:bookings@batbuddy.ae"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  bookings@batbuddy.ae
                </a>
                <a
                  href="mailto:help@batbuddy.ae"
                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  help@batbuddy.ae
                </a>
              </div>
            </div>
            <div className="mt-4">
              <h5 className="font-semibold mb-2 text-sm">WhatsApp</h5>
              <a
                href="https://wa.me/971559952721"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
              >
                <SiWhatsapp className="h-4 w-4" />
                055 995 2721
              </a>
            </div>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-1">
            © 2025. Built with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{" "}
            <a
              href="https://caffeine.ai"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
