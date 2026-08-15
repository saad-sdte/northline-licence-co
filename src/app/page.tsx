import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Headphones, Landmark, Map, Radio, ShieldCheck, Zap } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PROVINCES } from "@/lib/provinces";
import { KNOWLEDGE, WHY_US } from "@/lib/copy";

const ICONS = [Landmark, Radio, Zap, ShieldCheck, Map, Headphones];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <Image src="/fishing-hero.jpg" alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl py-20">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-none">
            Your Trusted Guide to Canadian Fishing Waters
          </h1>
          <p className="text-white/90 mb-8">
            Navigate fishing regulations with confidence across Canada&apos;s most productive provinces.
            Expert consultancy, up-to-date intelligence, and personalized advisory.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/apply" className="bg-white text-foreground px-5 py-2.5 text-sm font-semibold">
              BOOK CONSULTATION
            </Link>
            <Link href="/contact" className="border border-white text-white px-5 py-2.5 text-sm font-semibold">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-center mb-2">Why Choose Us</h2>
          <p className="text-center text-muted-foreground mb-10">
            Professional advisory built on regulatory expertise and a commitment to every angler&apos;s success.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {WHY_US.map((item, i) => {
              const Icon = ICONS[i];
              return (
                <div key={item.title} className="gov-card rounded p-5">
                  <Icon className="w-6 h-6 text-gov-red mb-3" />
                  <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-center mb-2">Our Covered Provinces</h2>
          <p className="text-center text-muted-foreground mb-10">
            Expert advisory across eight of Canada&apos;s premier fishing destinations.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {PROVINCES.map((p) => (
              <div key={p.code} className="gov-card rounded p-5">
                <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 mb-3">
                  {p.code}
                </span>
                <h3 className="font-heading text-lg font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <Link href="/apply" className="text-sm text-gov-link inline-flex items-center gap-1">
                  Book Consultation <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-center mb-2">Knowledge Centre</h2>
          <p className="text-center text-muted-foreground mb-10">
            Essential information for every angler navigating Canada&apos;s fishing regulations.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {KNOWLEDGE.map((item) => (
              <div key={item.title} className="bg-card border border-border border-t-2 border-t-gov-red rounded p-5">
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gov-red text-xs font-semibold tracking-widest uppercase mb-2">About Us</p>
            <h2 className="font-heading text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Our dedicated team is committed to offering a comprehensive range of services to support fishing
              enthusiasts in their pursuits. With a deep understanding of the intricacies of fishing licences and
              regulations across various provinces in Canada, we stand as your trusted resource for all matters
              related to fishing.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "How to use your Fishing Licence",
                "Application procedures",
                "Different types of Fishing Licence",
                "Fishing regulations and laws",
                "Advantages and benefits",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-gov-red">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image src="/fishing-about.jpg" alt="Angler with catch in Canadian river" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="font-heading text-3xl font-bold text-center mb-2">Have Questions?</h2>
          <p className="text-center text-muted-foreground mb-8">
            Send us a message and we&apos;ll get back to you within 1–2 business days.
          </p>
          <ContactForm />
        </div>
      </section>

      <section className="gov-banner py-14">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-heading text-3xl font-bold mb-3">Ready to Get Expert Guidance?</h2>
          <p className="opacity-90 mb-6">
            Start your consultation today and let our advisors handle the complexity of fishing regulations for you.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-2.5 text-sm font-semibold"
          >
            BOOK CONSULTATION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
