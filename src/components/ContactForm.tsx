"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CONTACT_REASONS } from "@/lib/lists";

type Props = {
  variant?: "home" | "contact";
};

export function ContactForm({ variant = "home" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const requiredOk =
    variant === "contact"
      ? Boolean(name.trim() && email.trim() && message.trim())
      : Boolean(name.trim() && email.trim());

  if (sent) {
    return (
      <div className="gov-card rounded p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Thank you for reaching out. Our team will get back to you within 1–2 business days.
        </p>
      </div>
    );
  }

  const fieldClass =
    "w-full bg-background border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  const form = (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (requiredOk) setSent(true);
      }}
    >
      {variant === "contact" && (
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Reason for Contacting Us</label>
          <select className={`${fieldClass} bg-card`} value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select a reason</option>
            {CONTACT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground block mb-1">Full Name *</label>
        <input
          className={fieldClass}
          placeholder={variant === "contact" ? "Fill out your name" : "Your full name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground block mb-1">Email Address *</label>
        <input
          type="email"
          className={fieldClass}
          placeholder={variant === "contact" ? "Fill out your email address" : "your@email.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {variant === "home" && (
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Reason for Contact</label>
          <select className={`${fieldClass} bg-card`} value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select a reason (optional)</option>
            {CONTACT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-foreground block mb-1">
          Message{variant === "contact" ? " *" : ""}
        </label>
        <textarea
          rows={variant === "contact" ? 5 : 4}
          className={`${fieldClass} resize-none`}
          placeholder={variant === "contact" ? "What is your message?" : "How can we help you?"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={!requiredOk}
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded transition-all ${
          requiredOk ? "gov-btn-primary" : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {variant === "contact" ? "Send Your Message" : "Send Message"}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );

  if (variant === "contact") {
    return <div className="gov-card rounded p-5 md:p-6 space-y-4">{form}</div>;
  }

  return form;
}
