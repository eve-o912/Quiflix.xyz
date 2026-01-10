import { Mail, Twitter, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/quiflix-logo.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const howItWorksAnim = useScrollAnimation(0.1);
  const whyQuiflixAnim = useScrollAnimation(0.1);
  const revenueSplitAnim = useScrollAnimation(0.1);

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
        <div 
          ref={howItWorksAnim.ref}
          className={`mb-16 transition-all duration-700 ${
            howItWorksAnim.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="font-display text-2xl font-bold text-gradient-gold mb-8 text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((flow, flowIndex) => (
              <div 
                key={flow.title} 
                className="text-center transition-all duration-500"
                style={{ transitionDelay: `${flowIndex * 150}ms` }}
              >
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

        {/* Quifund CTA - For Investors & Brands */}
        <div 
          className={`mb-16 transition-all duration-700 ${
            howItWorksAnim.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <a
            href="https://quifund.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="text-center">
              <h3 className="font-display text-xl md:text-2xl font-bold text-gradient-gold mb-2">
                Investors & Brands
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                Want to fund African cinema or get visibility for your brand? Join Quifund.
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                Visit quifund.xyz →
              </span>
            </div>
          </a>
        </div>

        {/* Why Quiflix Section */}
        <div 
          ref={whyQuiflixAnim.ref}
          className={`mb-16 transition-all duration-700 ${
            whyQuiflixAnim.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="font-display text-2xl font-bold text-gradient-gold mb-8 text-center">
            Why Quiflix?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {whyQuiflixFeatures.map((feature, index) => (
              <span
                key={feature}
                className={`px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground border border-border/50 transition-all duration-500 ${
                  whyQuiflixAnim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Revenue Split */}
        <div 
          ref={revenueSplitAnim.ref}
          className={`mb-16 text-center transition-all duration-700 ${
            revenueSplitAnim.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="font-display text-xl font-bold text-gradient-gold mb-6">
            Fair Revenue Split
          </h3>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              { label: "Filmmaker", value: "70%", color: "bg-primary" },
              { label: "Distributor", value: "20%", color: "bg-accent" },
              { label: "Platform", value: "10%", color: "bg-gold-600" },
            ].map((item, index) => (
              <div 
                key={item.label} 
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/50 transition-all duration-500 ${
                  revenueSplitAnim.isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
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
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secured on <span className="text-primary font-semibold">Base</span> network. USDC Payment
            </p>
            <span className="hidden md:inline text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">
              Powered by <span className="text-primary">Base</span> & <span className="text-primary">Lisk</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
