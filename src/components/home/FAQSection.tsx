"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView, type Variants } from "framer-motion";
import { HelpCircle, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const FAQ_CATEGORIES = [
  {
    label: "Courses",
    faqs: [
      {
        q: "Do I need any cooking experience to get started?",
        a: "Not at all. We have courses designed for complete beginners — from how to hold a knife safely to cooking your first meal from scratch. Filter by 'Beginner' difficulty on the courses page to find the right starting point.",
      },
      {
        q: "Can I enrol in multiple courses at the same time?",
        a: "Yes — you can add multiple courses to your cart and enrol in all of them at once. There is no limit on how many courses you can be simultaneously enrolled in.",
      },
      {
        q: "How long do I have access after enrolling?",
        a: "You get 1 year of access from the date of enrollment. Rewatch any lesson as many times as you like within that period — no session limits or streaming caps.",
      },
      {
        q: "Are the courses available on mobile devices?",
        a: "Yes — KitchenClass is fully responsive and works on phones, tablets, and desktops. Browse courses, manage enrollments, and access your dashboard from any device.",
      },
    ],
  },
  {
    label: "Enrollment",
    faqs: [
      {
        q: "Can I cancel my enrollment and get a refund?",
        a: "You can cancel while the enrollment is still in Pending status — before the instructor activates your access. Once Active, cancellation is not available. We recommend checking the course preview and description carefully before enrolling.",
      },
      {
        q: "When can I leave a review for a course?",
        a: "Reviews are available once your instructor marks your enrollment as Active. You can then review from your enrollment detail page. Only verified enrolled students can leave reviews, so every rating is genuine.",
      },
      {
        q: "What does the enrollment status mean?",
        a: "Pending means payment received but access not yet granted. Active means the instructor has granted full course access. Completed means you have finished the course. Expired means the 1-year access window has passed.",
      },
    ],
  },
  {
    label: "Instructors",
    faqs: [
      {
        q: "How do I become an instructor on KitchenClass?",
        a: "Register on the platform and select 'Instructor' during sign-up. Fill in your school or studio details — your application will be reviewed by our admin team. Once approved, you can immediately start creating and publishing courses.",
      },
      {
        q: "How are instructors vetted?",
        a: "Every instructor application is manually reviewed by our admin team. We check professional background, teaching experience, and course content quality. This approval process is what keeps our course quality consistently high.",
      },
      {
        q: "How long does instructor approval take?",
        a: "Most applications are reviewed within 24 to 48 hours. You can check your approval status at any time from your instructor dashboard.",
      },
    ],
  },
  {
    label: "General",
    faqs: [
      {
        q: "Is KitchenClass available outside Bangladesh?",
        a: "Absolutely. KitchenClass is fully online — students and instructors can join from anywhere in the world. Check individual course listings for the language the course is taught in.",
      },
      {
        q: "What if I have a problem with a course or instructor?",
        a: "Reach out via the Contact page and our support team will respond within 24 hours. For urgent issues, email support@kitchenclass.com directly.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_CATEGORIES.flatMap((c) => c.faqs);

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
        ${
          active
            ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400"
        }`}
    >
      {label}
    </motion.button>
  );
}

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const categories = ["All", ...FAQ_CATEGORIES.map((c) => c.label)];

  const visibleFaqs =
    activeCategory === "All"
      ? ALL_FAQS
      : (FAQ_CATEGORIES.find((c) => c.label === activeCategory)?.faqs ?? []);

  return (
    <section
      ref={ref}
      className="relative py-20 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
    >
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-400/5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose-400/5 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
              Got questions?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Frequently asked{" "}
            <span className="text-orange-500">questions</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Everything you need to know about learning and teaching on
            KitchenClass
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {visibleFaqs.map((faq, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                variants={itemVariants}
                className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900 transition-colors duration-200"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`faq-${i}`} className="border-none px-5">
                    <AccordionTrigger className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:no-underline hover:text-orange-500 dark:hover:text-orange-400 py-5 gap-3 transition-colors duration-200 data-[state=open]:text-orange-500 dark:data-[state=open]:text-orange-400 [&>svg]:hidden">
                      <span className="flex items-start gap-3 text-left">
                        <Plus className="w-4 h-4 shrink-0 mt-0.5 text-orange-500 transition-transform duration-200 [[data-state=open]_&]:rotate-45" />
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed pb-5 pl-7">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  Still have questions?
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Our support team usually responds within 24 hours.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-400 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:scale-[1.03]"
            >
              Contact support
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}