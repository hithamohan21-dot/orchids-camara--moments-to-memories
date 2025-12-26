"use client";

import { Logo } from "./Logo";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-blue-100/40 mb-8 leading-relaxed">
              Premium photography and videography services for weddings and events. Based in Bengaluru, capturing moments to memories.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-100/40 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4">
              {["Hero", "About", "Services", "Portfolio", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-blue-100/40 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Services</h4>
            <ul className="space-y-4">
              {[
                "Wedding Photography",
                "Wedding Videography",
                "Event Photography",
                "Candid Photography",
                "Pre-Wedding Shoots",
              ].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-blue-100/40 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Location</h4>
            <div className="text-blue-100/40 leading-relaxed mb-6">
              CAMARA Studio<br />
              Bengaluru, Karnataka<br />
              India
            </div>
            <div className="text-blue-100/40 leading-relaxed">
              <span className="text-white font-medium">Phone:</span> +91 98453 74999<br />
              <span className="text-white font-medium">Email:</span> camaracrew@gmail.com
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-blue-100/20 text-sm">
          <p>© {currentYear} CAMARA. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
