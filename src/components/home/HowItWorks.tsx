import {
  MapPin,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Browse Meals",
    description:
      "Explore hundreds of delicious meals from the best local restaurants and home cooks in your area.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Add to Cart & Checkout",
    description:
      "Select your favorite meals, add them to your cart, and complete your order in just a few clicks.",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Track Your Order",
    description:
      "Follow your order in real-time from the kitchen to your doorstep. Always know where your food is.",
  },
  {
    number: "04",
    icon: UtensilsCrossed,
    title: "Enjoy Delicious Food!",
    description:
      "Sit back, relax, and enjoy fresh, hot meals delivered right to your door. Bon appétit!",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            How It Works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Order your favorite food in 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connector line between steps (hidden on last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-linear-to-r from-orange-200 to-orange-100 dark:from-orange-900 dark:to-orange-950 z-0" />
                )}

                {/* Icon Circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/50 border-2 border-orange-200 dark:border-orange-800 flex items-center justify-center mb-4 group-hover:border-orange-400 transition-colors">
                  <Icon className="w-8 h-8 text-orange-500 dark:text-orange-400" />

                  {/* Step Number Badge */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
