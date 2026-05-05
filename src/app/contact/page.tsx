"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: EASE },
  }),
};

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@kitchenclass.com",
    href: "mailto:support@kitchenclass.com",
    color: "bg-orange-100 dark:bg-orange-950/50 text-orange-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1700 000000",
    href: "tel:+8801700000000",
    color: "bg-blue-100 dark:bg-blue-950/50 text-blue-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: "#",
    color: "bg-green-100 dark:bg-green-950/50 text-green-500",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Sat – Thu, 9am – 6pm BST",
    href: "#",
    color: "bg-purple-100 dark:bg-purple-950/50 text-purple-500",
  },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<FormState>;

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Enter a valid email";
  if (!data.subject.trim()) errors.subject = "Subject is required";
  if (!data.message.trim()) errors.message = "Message is required";
  else if (data.message.trim().length < 20)
    errors.message = "Message must be at least 20 characters";
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    // Simulate network delay — replace with real API call if needed
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-rose-600 dark:from-orange-900 dark:via-zinc-900 dark:to-rose-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
          <span className="absolute top-6 left-16 text-6xl">✉️</span>
          <span className="absolute bottom-6 right-20 text-5xl">🍳</span>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-orange-100 text-lg max-w-xl mx-auto"
          >
            Have a question about a course, need help with your account, or
            want to become an instructor? We&apos;re here to help.
          </motion.p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact details */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={0}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                Contact Information
              </h2>
              {CONTACT_DETAILS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.5}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-orange-500 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}

              {/* Social links */}
              <div className="pt-4">
                <p className="text-xs text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {[
                    { label: "Instagram", icon: "📸" },
                    { label: "YouTube", icon: "▶️" },
                    { label: "Facebook", icon: "💬" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700 flex items-center justify-center text-lg transition-colors"
                      title={s.label}
                    >
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              custom={1}
              className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <span className="text-6xl mb-4">🎉</span>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Thanks for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    variant="outline"
                    className="mt-6 rounded-full"
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field data-invalid={!!errors.name}>
                          <FieldLabel htmlFor="name">Full Name *</FieldLabel>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <FieldError errors={[{ message: errors.name }]} />
                          )}
                        </Field>
                        <Field data-invalid={!!errors.email}>
                          <FieldLabel htmlFor="email">Email *</FieldLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <FieldError errors={[{ message: errors.email }]} />
                          )}
                        </Field>
                      </div>
                      <Field data-invalid={!!errors.subject}>
                        <FieldLabel htmlFor="subject">Subject *</FieldLabel>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="e.g. Question about a course"
                          value={form.subject}
                          onChange={handleChange}
                        />
                        {errors.subject && (
                          <FieldError errors={[{ message: errors.subject }]} />
                        )}
                      </Field>
                      <Field data-invalid={!!errors.message}>
                        <FieldLabel htmlFor="message">Message *</FieldLabel>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us how we can help..."
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                        />
                        <FieldDescription>Minimum 20 characters</FieldDescription>
                        {errors.message && (
                          <FieldError errors={[{ message: errors.message }]} />
                        )}
                      </Field>
                    </FieldGroup>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-0 text-white h-11 gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}