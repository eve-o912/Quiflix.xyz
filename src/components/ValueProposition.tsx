import { Shield, Zap, Globe, Wallet, Film, Users } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Access Control",
    description: "Your films are protected. Access tied to verified purchases only.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Payouts",
    description: "Automatic revenue splits. No waiting, no middlemen.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Distribution",
    description: "Reach audiences worldwide through your distributor network.",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "No Wallet Needed",
    description: "Pay with M-Pesa or card. Blockchain works in the background.",
  },
  {
    icon: <Film className="w-6 h-6" />,
    title: "Own Forever",
    description: "One-time purchase, lifetime access. No subscriptions.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    description: "Distributors earn by promoting films they believe in.",
  },
];

const ValueProposition = () => {
  return (
    <section id="filmmakers" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Why Quiflix?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The fair platform for African cinema. Built for filmmakers, distributors, and viewers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:bg-muted/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
