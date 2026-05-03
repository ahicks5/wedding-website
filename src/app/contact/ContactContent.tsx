"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Loader2, Mail } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-ivory pb-8 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-warm-gray">
              Get in touch
            </p>
            <h1 className="mt-3 font-serif text-4xl text-charcoal sm:text-5xl">
              Questions? We&apos;d Love to Hear From You
            </h1>
            <div className="divider-gold" />
            <p className="mt-4 font-serif text-lg italic text-charcoal-light">
              Don&apos;t hesitate to reach out with any questions about the
              wedding, travel, or anything else.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-ivory px-6 pb-24">
        <div className="mx-auto max-w-xl">
          <FadeIn delay={0.15}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-linen bg-white p-10 text-center shadow-soft"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="mt-6 font-serif text-2xl text-charcoal">
                  Message Sent!
                </h2>
                <p className="mt-3 font-sans text-sm text-charcoal-light">
                  Thank you for reaching out. We&apos;ll get back to you as
                  soon as we can!
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-lg border border-linen bg-white p-5 shadow-soft sm:p-8 md:p-10"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block font-sans text-sm font-medium text-charcoal"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-linen bg-cream px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-sm font-medium text-charcoal"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-linen bg-cream px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-sans text-sm font-medium text-charcoal"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="mt-1.5 w-full resize-none rounded-lg border border-linen bg-cream px-4 py-3 font-sans text-sm text-charcoal outline-none transition-colors placeholder:text-warm-gray/60 focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="What would you like to ask?"
                  />
                </div>

                {error && (
                  <p className="font-sans text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </FadeIn>

          {/* Direct Email */}
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="font-sans text-sm text-charcoal-light">
                Or email us directly:
              </p>
              {/* TODO: Replace with real email */}
              <a
                href="mailto:hello@lyndseyandandrew.com"
                className="mt-2 inline-flex items-center gap-2 font-sans text-sm font-medium text-sage transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4" />
                hello@lyndseyandandrew.com
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
