import { Footer2 } from "@/components/layout/Footer2";

const Footer = () => {
  return (
    <Footer2
      logo={{
        url: "/",
        src: "/images/logo.png", // ✅ Path to your logo in public folder
        alt: "FoodHub logo",
        title: "FoodHub",
      }}
      tagline="Delicious food, delivered to your door."
      menuItems={[
        {
          title: "About FoodHub",
          links: [
            {
              text: "FoodHub connects hungry customers with the best local food providers in your area. Order your favorite meals and get them delivered fresh and fast.",
              url: "#",
            },
          ],
        },
        {
          title: "Quick Links",
          links: [
            { text: "Home", url: "/" },
            { text: "Browse Meals", url: "/meals" },
            { text: "Providers", url: "/providers" },
            { text: "Contact", url: "#contact" },
          ],
        },
        {
          title: "Contact Us",
          links: [
            {
              text: "📧 support@foodhub.com",
              url: "mailto:support@foodhub.com",
            },
            { text: "📞 +880 1700 000000", url: "tel:+8801700000000" },
            { text: "📍 Dhaka, Bangladesh", url: "#" },
          ],
        },
      ]}
      copyright={`© ${new Date().getFullYear()} FoodHub. All rights reserved.`}
      bottomLinks={[]}
    />
  );
};

export { Footer };
