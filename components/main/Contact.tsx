"use client";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Loader2,
  Globe,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

const SUBJECT_SHORTCUTS = [
  { label: "Order Inquiry", value: "Order Status & Inquiry" },
  { label: "Delivery Help", value: "Delivery & Shipping Support" },
  { label: "Product Question", value: "Product Details & Customization" },
  { label: "General Feedback", value: "Feedback & Suggestions" },
];

export default function ContactPage() {
  const { t } = useSiteSettings();
  const { data: storeSettings, isLoading: storeLoading } = useStoreSettings();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShortcutClick = (subjectVal: string) => {
    setFormData((prev) => ({ ...prev, subject: subjectVal }));
    toast.info(`Subject set to "${subjectVal}"`, { duration: 1500 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending network request
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast.success("Message Sent Successfully!", {
      description: "Our customer success team will contact you within 12 hours.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const storePhone = storeSettings?.store_phone || "";
  const storeEmail = storeSettings?.store_email || "";
  const storeAddress = storeSettings?.store_address || "";
  const storeCity = storeSettings?.store_city || "";
  const whatsappNumber = storeSettings?.whatsapp_number || "";
  const facebookUrl = storeSettings?.facebook_url || "";
  const instagramUrl = storeSettings?.instagram_url || "";
  const youtubeUrl = storeSettings?.youtube_url || "";
  const contactSubtitle =
    storeSettings?.contact_subtitle ||
    "Have questions or need assistance? We're here to help. Send us a message and we'll reply as quickly as possible.";
  const contactHours = storeSettings?.contact_hours || "Saturday – Thursday: 10:00 AM – 8:00 PM";
  const contactMapEmbed = storeSettings?.contact_map_embed || "";

  const fullAddress = [storeAddress, storeCity].filter(Boolean).join(", ");

  return (
    <div className="relative overflow-hidden min-h-screen bg-background py-16 px-4 md:px-8">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3.5 py-1.5 rounded-full mb-4 inline-block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-5 bg-gradient-to-r from-foreground via-accent to-pink-500 bg-clip-text text-transparent">
            {t("nav.contact")}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {contactSubtitle}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone Card */}
          <div className="group bg-card/60 backdrop-blur-md rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Phone className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t("checkout.phone")}</h3>
            <p className="text-sm text-muted-foreground mb-3">Call us directly for instant support.</p>
            {storePhone ? (
              <a
                href={`tel:${storePhone}`}
                className="text-base font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                {storePhone}
              </a>
            ) : (
              <p className="text-muted-foreground/50 italic text-sm">Not configured</p>
            )}
          </div>

          {/* Email Card */}
          <div className="group bg-card/60 backdrop-blur-md rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t("checkout.email")}</h3>
            <p className="text-sm text-muted-foreground mb-3">Drop us an email anytime, we reply fast.</p>
            {storeEmail ? (
              <a
                href={`mailto:${storeEmail}`}
                className="text-base font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                {storeEmail}
              </a>
            ) : (
              <p className="text-muted-foreground/50 italic text-sm">Not configured</p>
            )}
          </div>

          {/* Hours Card */}
          <div className="group bg-card/60 backdrop-blur-md rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">Office Hours</h3>
            <p className="text-sm text-muted-foreground mb-3">When our experts are ready to assist.</p>
            <p className="text-sm font-semibold text-foreground/80">{contactHours}</p>
          </div>
        </div>

        {/* WhatsApp Banner */}
        {whatsappNumber && (
          <div className="relative overflow-hidden mb-12 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 animate-pulse">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-lg text-foreground">Need Instant Chat Support?</h4>
                <p className="text-sm text-muted-foreground">Our representatives are active now on WhatsApp for quick messaging.</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:scale-105"
            >
              Start WhatsApp Chat
            </a>
          </div>
        )}

        {/* Main Grid: Form & Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Form Section */}
          <div className="lg:col-span-7 bg-card/45 backdrop-blur-md rounded-2xl border border-border p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">Fill out the form below and we will get back to you.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t("checkout.name")} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="input-shop focus:ring-2 focus:ring-accent/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {t("checkout.email")} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="input-shop focus:ring-2 focus:ring-accent/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold">
                      Subject <span className="text-destructive">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this inquiry about?"
                    className="input-shop focus:ring-2 focus:ring-accent/20 mb-3"
                    required
                  />
                  {/* Subject Quick Selection Shortcuts */}
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_SHORTCUTS.map((shortcut) => (
                      <button
                        key={shortcut.value}
                        type="button"
                        onClick={() => handleShortcutClick(shortcut.value)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${formData.subject === shortcut.value
                            ? "bg-accent text-accent-foreground border-accent font-semibold"
                            : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                          }`}
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us details about your request..."
                    className="input-shop min-h-[150px] focus:ring-2 focus:ring-accent/20 resize-y"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-accent w-full py-6 font-bold rounded-xl shadow-lg hover:shadow-accent/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Map/Address & Social Handles */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Map/Address Card */}
            <div className="bg-card/45 backdrop-blur-md rounded-2xl border border-border overflow-hidden flex flex-col justify-between flex-1">
              {contactMapEmbed ? (
                <div className="h-72 w-full bg-secondary relative overflow-hidden group">
                  <iframe
                    src={contactMapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              ) : (
                <div className="h-72 w-full bg-secondary/50 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <MapPin className="h-10 w-10 opacity-30" />
                  <p className="text-sm italic">Interactive Map Not Set</p>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Our Store Address</h3>
                    {fullAddress ? (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {fullAddress}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 italic">
                        Address not configured yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid Card */}
            {(facebookUrl || instagramUrl || youtubeUrl) && (
              <div className="bg-card/45 backdrop-blur-md rounded-2xl border border-border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" /> Connect on Socials
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-4 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 text-blue-500 transition-all hover:scale-105"
                    >
                      <FaFacebook className="h-6 w-6 mb-2" />
                      <span className="text-xs font-semibold">Facebook</span>
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-4 rounded-xl bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/10 text-pink-500 transition-all hover:scale-105"
                    >
                      <FaInstagram className="h-6 w-6 mb-2" />
                      <span className="text-xs font-semibold">Instagram</span>
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center py-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 transition-all hover:scale-105"
                    >
                      <FaYoutube className="h-6 w-6 mb-2" />
                      <span className="text-xs font-semibold">YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
