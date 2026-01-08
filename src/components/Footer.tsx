import { Mail, Twitter, Instagram, Youtube, Eye, DollarSign, Film, User, Share2, TrendingUp, Shield, Zap, Globe, Wallet, Users } from "lucide-react";
import logo from "@/assets/quiflix-logo.png";

const howItWorksData = [
  {
    title: "For Viewers",
    steps: ["Browse Films", "Pay with M-Pesa", "Watch Forever"],
  },
  {
    title: "For Distributors",
    steps: ["Get Approved", "Share Your Link", "Earn 20%"],
  },
  {
    title: "For Filmmakers",
    steps: ["Upload Film", "Set Your Price", "Earn 70%"],
  },
];

const whyQuiflixFeatures = [
  "Secure Access Control",
  "Instant Payouts",
  "Global Distribution",
  "No Wallet Needed",
  "Own Forever",
  "Community Driven",
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Legal: [
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", label: "YouTube" },
    { icon: <Mail className="w-5 h-5" />, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        {/* How It Works Section */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-gradient-gold mb-8 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((flow) => (
              <div key={flow.title} className="text-center">
                <h4 className="font-semibold text-foreground mb-4">{flow.title}</h4>
                <ul className="space-y-2">
                  {flow.steps.map((step, index) => (
                    <li key={step} className="text-sm text-muted-foreground">
                      <span className="text-primary font-bold mr-2">0{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Why Quiflix Section */}
        <div className="mb-16">
          <h3 className="font-display text-2xl font-bold text-gradient-gold mb-8 text-center">
            Why Quiflix?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {whyQuiflixFeatures.map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground border border-border/50"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Revenue Split */}
        <div className="mb-16 text-center">
          <h3 className="font-display text-xl font-bold text-gradient-gold mb-6">
            Fair Revenue Split
          </h3>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              { label: "Filmmaker", value: "70%", color: "bg-primary" },
              { label: "Distributor", value: "20%", color: "bg-accent" },
              { label: "Platform", value: "10%", color: "bg-gold-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/50">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-8 border-t border-border/50">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Quiflix" className="h-12 w-auto logo-transparent mb-4" />
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              The fair platform for African cinema. Own your movies, support filmmakers, earn as a distributor.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Quiflix. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-primary">Base</span> & <span className="text-primary">Lisk</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
