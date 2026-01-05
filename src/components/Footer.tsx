"use client";

import { Logo } from "./Logo";
import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/camara.insta?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      label: "Instagram"
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/camarazone/",
      label: "Facebook"
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@camarazone",
      label: "YouTube"
    }
  ];

  return (
    <footer className="bg-white border-t border-zinc-200 pt-24 pb-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Premium photography and videography services for weddings and events. Based in Bengaluru, capturing moments to memories.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-black font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4">
              {["Hero", "About", "Services", "Portfolio", "Reviews", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-zinc-500 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-black font-bold mb-6 tracking-wider uppercase text-sm">Services</h4>
            <ul className="space-y-4">
              {[
                "Wedding Photography",
                "Candid Photography",
                "Pre-Wedding Shoots",
                "Event Photography",
                "Corporate Shoots",
              ].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-zinc-500 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

            <div>
              <h4 className="text-black font-bold mb-6 tracking-wider uppercase text-sm">Our Location</h4>
              <div className="text-zinc-900 font-black text-2xl tracking-tighter mb-4">
                Bengaluru, Karnataka
              </div>
              <div className="text-zinc-500 leading-relaxed mb-6">
                CAMARA Studio<br />
                India
              </div>
              <div className="text-zinc-500 leading-relaxed">
                <span className="text-black font-medium">Phone:</span> +91 98453 74999<br />
                <span className="text-black font-medium">Email:</span> camaracrew@gmail.com
              </div>
            </div>
        </div>

        <div className="pt-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-400 text-sm">
          <p>© {currentYear} CAMARA. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
