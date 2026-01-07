import { User, Film, DollarSign, Eye, Share2, TrendingUp } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface UserFlow {
  title: string;
  subtitle: string;
  steps: Step[];
  gradient: string;
}

const userFlows: UserFlow[] = [
  {
    title: "Viewers",
    subtitle: "Watch & Own",
    gradient: "from-primary/20 to-transparent",
    steps: [
      {
        icon: <Eye className="w-6 h-6" />,
        title: "Browse Films",
        description: "Explore our curated collection of African cinema",
      },
      {
        icon: <DollarSign className="w-6 h-6" />,
        title: "Pay with M-Pesa",
        description: "One-time purchase using M-Pesa or card",
      },
      {
        icon: <Film className="w-6 h-6" />,
        title: "Watch Forever",
        description: "Lifetime access on any device, anytime",
      },
    ],
  },
  {
    title: "Distributors",
    subtitle: "Sell & Earn",
    gradient: "from-accent/20 to-transparent",
    steps: [
      {
        icon: <User className="w-6 h-6" />,
        title: "Get Approved",
        description: "Apply to become a verified distributor",
      },
      {
        icon: <Share2 className="w-6 h-6" />,
        title: "Share Your Link",
        description: "Get unique links to sell film access",
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Earn 20%",
        description: "Automatic revenue split on every sale",
      },
    ],
  },
  {
    title: "Filmmakers",
    subtitle: "Upload & Profit",
    gradient: "from-gold-500/20 to-transparent",
    steps: [
      {
        icon: <Film className="w-6 h-6" />,
        title: "Upload Film",
        description: "Host on Google Drive, we handle the rest",
      },
      {
        icon: <DollarSign className="w-6 h-6" />,
        title: "Set Your Price",
        description: "Full control over pricing and splits",
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Earn 70%",
        description: "Keep majority of every sale, guaranteed",
      },
    ],
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">How It Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple for everyone. Fair revenue splits powered by blockchain technology.
          </p>
        </div>

        {/* User Flows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {userFlows.map((flow) => (
            <div
              key={flow.title}
              className="relative rounded-2xl bg-card border border-border/50 p-8 hover:border-primary/30 transition-all duration-500"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${flow.gradient} pointer-events-none`} />
              
              <div className="relative">
                {/* Header */}
                <div className="mb-8">
                  <span className="text-sm font-medium text-primary">{flow.subtitle}</span>
                  <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                    For {flow.title}
                  </h3>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                  {flow.steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        {step.icon}
                      </div>
                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary">0{index + 1}</span>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Split Visualization */}
        <div className="mt-16 text-center">
          <h3 className="font-display text-2xl font-bold mb-8">
            <span className="text-gradient-gold">Fair Revenue Split</span>
          </h3>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              { label: "Filmmaker", value: "70%", color: "bg-primary" },
              { label: "Distributor", value: "20%", color: "bg-accent" },
              { label: "Platform", value: "10%", color: "bg-gold-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
