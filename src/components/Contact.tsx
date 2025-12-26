"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  const phoneNumber = "9845374999";
  const whatsappMessage = "Hi Camara, I would like to enquire about your photography/videography services.";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="contact" className="py-24 bg-black relative">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 lg:border-r border-white/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-blue-500 font-medium tracking-widest uppercase mb-4">
                  Contact Us
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Let's capture your <span className="text-blue-400">story</span>.
                </h3>
                <p className="text-blue-100/40 mb-12">
                  Ready to book your event or have questions? Get in touch with us via call or WhatsApp for a quick consultation.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-100/40 uppercase tracking-widest mb-1">Call Us</div>
                      <a href={`tel:${phoneNumber}`} className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
                        +91 {phoneNumber}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-100/40 uppercase tracking-widest mb-1">WhatsApp</div>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
                        Chat with Us
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-100/40 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-xl font-bold text-white">Bengaluru, Karnataka</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-blue-600 p-8 md:p-16 flex flex-col justify-center text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold">Quick Enquiry</h4>
                  <p className="text-blue-100/80">
                    Average response time: <span className="font-bold text-white underline">Less than 30 mins</span>
                  </p>
                </div>

                <div className="space-y-6 pt-8 border-t border-white/20">
                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 opacity-60" />
                    <span className="font-medium">Open 7 Days a Week</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 opacity-60" />
                    <span className="font-medium">camaracrew@gmail.com</span>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 h-16 rounded-2xl text-xl font-bold shadow-xl"
                    onClick={() => window.open(whatsappUrl, "_blank")}
                  >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Book via WhatsApp
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
