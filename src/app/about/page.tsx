"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Heart, Shield, Users } from "lucide-react";
const EASE = [0.22, 1, 0.36, 1] as const;

// ── Animation variants ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

// ── Team members ──────────────────────────────────────
const TEAM = [
  {
    name: "Sadiq Al Mahmud",
    role: "Founder & CEO",
    bio: "Culinary school graduate turned tech entrepreneur. Built KitchenClass to democratise access to professional cooking education.",
    initials: "SA",
    color: "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
  },
  {
    name: "Nadia Hossain",
    role: "Head of Instructor Relations",
    bio: "Former restaurant manager with a passion for connecting talented chefs with aspiring home cooks worldwide.",
    initials: "NH",
    color: "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Rahim Uddin",
    role: "Lead Product Engineer",
    bio: "Full-stack developer who believes great software should be invisible — the cooking experience should always be front and centre.",
    initials: "RU",
    color: "bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400",
  },
  {
    name: "Farida Begum",
    role: "Curriculum Director",
    bio: "Trained pastry chef and educator with 12 years of experience designing cooking programmes for all skill levels.",
    initials: "FB",
    color: "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
  },
];

// ── Values ────────────────────────────────────────────
const VALUES = [
  {
    icon: GraduationCap,
    title: "Learn Without Limits",
    body: "No deadlines, no rigid schedules. We believe great cooking should be learned at your own rhythm, revisited as many times as you need.",
  },
  {
    icon: Shield,
    title: "Quality Over Quantity",
    body: "Every instructor on KitchenClass is personally vetted by our team. We'd rather have 50 exceptional courses than 5,000 mediocre ones.",
  },
  {
    icon: Heart,
    title: "Community First",
    body: "Cooking is inherently social. We build tools that connect students with instructors and with each other — not just videos in isolation.",
  },
  {
    icon: Users,
    title: "Accessible to Everyone",
    body: "World-class culinary education shouldn't require a five-figure tuition. We keep our pricing fair so anyone can start learning.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-rose-600 dark:from-orange-900 dark:via-zinc-900 dark:to-rose-900">
        <div className="absolute inset-0 opacity-10 select-none pointer-events-none">
          <span className="absolute top-8 left-16 text-7xl">🍳</span>
          <span className="absolute bottom-8 right-20 text-6xl">👨‍🍳</span>
          <span className="absolute top-1/2 right-12 text-5xl">🎂</span>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              Our Story
            </span>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            We Believe Everyone
            <br />
            Can Cook Beautifully
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            KitchenClass was born from a simple idea — that professional
            culinary knowledge should be available to anyone with a stove and a
            curiosity to learn.
          </motion.p>
        </div>
      </section>

      {/* ── Mission / Story ───────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                How It Started
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                In 2024, our founder Sadiq spent months trying to learn
                traditional Bengali cooking after moving abroad. YouTube was
                overwhelming, cookbooks lacked context, and in-person classes
                were expensive and inflexible.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                He realised the problem wasn&apos;t a shortage of knowledge —
                it was a shortage of structure. Professional chefs had the
                expertise but no platform to share it properly. Students had
                the hunger but nowhere trustworthy to go. KitchenClass bridges
                that gap.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={1}
              className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-8 border border-orange-100 dark:border-orange-900"
            >
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Our Mission
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                To connect passionate home cooks with expert culinary
                instructors through structured, accessible, and affordable
                online courses — so anyone, anywhere, can master the art of
                cooking.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["200+", "Courses"],
                  ["50+", "Instructors"],
                  ["10k+", "Students"],
                  ["4.8★", "Avg Rating"],
                ].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {val}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              What We Stand For
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              These aren&apos;t values we put on a wall — they&apos;re
              decisions we make every day
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              The Team Behind KitchenClass
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              A small team with a big appetite for great food and great software
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center cursor-default"
              >
                <div
                  className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center mx-auto mb-4 text-xl font-bold`}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs text-orange-500 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}