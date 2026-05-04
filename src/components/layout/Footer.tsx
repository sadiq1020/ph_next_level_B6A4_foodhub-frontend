import { Footer2 } from "@/components/layout/Footer2";

const Footer = () => {
  return (
    <Footer2
      logo={{
        url: "/",
        src: "/images/logo.png",
        alt: "KitchenClass logo",
        title: "KitchenClass",
      }}
      tagline="Learn to cook from professional chefs with expert-led courses."
      menuItems={[
        {
          title: "About KitchenClass",
          links: [
            {
              text: "KitchenClass connects aspiring cooks with professional chefs. Master culinary arts from the comfort of your home with our expert-led video courses.",
              url: "#",
            },
          ],
        },
        {
          title: "Quick Links",
          links: [
            { text: "Home", url: "/" },
            { text: "Browse Courses", url: "/courses" },
            { text: "Instructors", url: "/instructors" },
            { text: "Contact", url: "#contact" },
          ],
        },
        {
          title: "Contact Us",
          links: [
            {
              text: "📧 support@kitchenclass.com",
              url: "mailto:support@kitchenclass.com",
            },
            { text: "📞 +880 1700 000000", url: "tel:+8801700000000" },
            { text: "📍 Dhaka, Bangladesh", url: "#" },
          ],
        },
      ]}
      copyright={`© ${new Date().getFullYear()} KitchenClass. All rights reserved.`}
      bottomLinks={[]}
    />
  );
};

export { Footer };
