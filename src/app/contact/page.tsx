import { Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { BRAND } from "@/lib/brand";

export default function ContactPage() {
  return (
    <>
      <section className="gov-banner py-10 md:py-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="opacity-90">Have questions or need help? We&apos;re here to assist you.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <ContactForm variant="contact" />
            </div>
            <div className="md:col-span-2 space-y-6">
            <h2 className="font-heading text-xl font-bold mb-3">Contact us | {BRAND.domain}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Have questions or need help? Contact us via our contact form. Our customer service team would be
              happy to assist you with any licensing questions, application issues, or general inquiries.
            </p>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gov-red mt-0.5" />
                <span>
                  <span className="font-medium block">Email</span>
                  <a href={`mailto:${BRAND.email}`} className="text-gov-link">
                    {BRAND.email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gov-red mt-0.5" />
                <span>
                  <span className="font-medium block">Response Time</span>
                  Within 1–2 business days
                </span>
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
