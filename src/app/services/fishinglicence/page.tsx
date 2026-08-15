"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  FileText,
  MapPinned,
  RefreshCw,
  Scale,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PROVINCES } from "@/lib/provinces";
import { FAQS, SERVICES } from "@/lib/copy";
import { BRAND } from "@/lib/brand";

const ICONS = [ClipboardCheck, Scale, FileText, CalendarDays, MapPinned, RefreshCw];

export default function ServicesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <section className="relative py-14 md:py-20 overflow-hidden">
        <Image src="/fishing-hero.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[hsl(var(--banner-bg))]/85" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-header-fg">
            Our Advisory Services
          </h1>
          <p className="text-sm md:text-base opacity-90 text-header-fg">
            Professional regulatory advisory and application assistance for fishing licences across eight
            Canadian provinces.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gov-red text-xs font-semibold tracking-widest uppercase mb-2">Featured Service</p>
            <h2 className="font-heading text-2xl font-bold mb-3">Fishing Licence Application Assistance</h2>
            <p className="text-sm text-muted-foreground mb-5">
              We offer direct application assistance for fishing licences in British Columbia, Ontario, Manitoba,
              Alberta, Saskatchewan, Quebec, Nova Scotia, and New Brunswick. Our advisors guide you step-by-step
              through each province&apos;s forms, documentation requirements, and submission process.
            </p>
            <Link
              href="/services/apply"
              className="inline-flex items-center gap-2 gov-btn-primary rounded px-5 py-2.5 text-sm font-semibold"
            >
              APPLY FOR A LICENCE <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image src="/fishing-about.jpg" alt="Angler fishing in river" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-14 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">Full Service Catalogue</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div key={s.title} className="bg-background border border-border rounded p-5 hover:shadow-md transition-shadow flex flex-col">
                  <Icon className="w-7 h-7 text-primary mb-3" />
                  <h3 className="font-heading text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{s.body}</p>
                  <ul className="text-sm space-y-1 mt-auto">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-gov-red">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-center mb-2">Provincial Licence Overview</h2>
          <p className="text-center text-muted-foreground mb-8">
            A snapshot of licensing options across our covered provinces.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {PROVINCES.map((p) => (
              <div key={p.code} className="gov-card rounded p-5">
                <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 mb-3">
                  {p.code}
                </span>
                <h3 className="font-heading text-lg font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                <p className="text-sm font-medium mb-3">{p.licenceCount} licence types</p>
                <Link href="/services/apply" className="text-sm text-gov-link inline-flex items-center gap-1">
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-card">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-8">
            Common questions about our services and the licensing process.
          </p>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={faq.question} className="border border-border rounded bg-background">
                <button
                  className="w-full text-left px-4 py-3 font-medium text-sm flex justify-between gap-3"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <h3 className="font-heading text-sm font-medium">{faq.question}</h3>
                  <span>{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="font-heading text-3xl font-bold text-center mb-2">Have Questions?</h2>
          <p className="text-center text-muted-foreground mb-8">
            Send us a message and we&apos;ll get back to you within 1–2 business days.
          </p>
          <ContactForm />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h3 className="font-heading text-lg font-semibold mb-2">Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            {BRAND.name} is an independent service that provides consultancy and resources to assist individuals
            in navigating fishing licence applications. Please note that we are not affiliated, endorsed, or in
            partnership with any government agency or regulatory body.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            For more information please refer to our{" "}
            <Link href="/terms" className="text-gov-link underline">
              Terms and Conditions
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="gov-banner py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-heading text-3xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="opacity-90 mb-6">Begin your consultation and let us handle the paperwork.</p>
          <Link
            href="/services/apply"
            className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-2.5 text-sm font-semibold"
          >
            APPLY FOR A LICENCE <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
