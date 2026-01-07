import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section id="distributors" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Filmmaker CTA */}
          <div className="relative rounded-2xl bg-card border border-border/50 p-8 md:p-12 overflow-hidden group hover:border-primary/30 transition-all duration-500">
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Film className="w-7 h-7" />
              </div>
              
              <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                For Filmmakers
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Upload your film, set your price, and start earning. Keep 70% of every sale with automatic payouts. No upfront costs.
              </p>
              
              <Button variant="hero" size="lg" className="group/btn">
                Submit Your Film
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Distributor CTA */}
          <div className="relative rounded-2xl bg-card border border-border/50 p-8 md:p-12 overflow-hidden group hover:border-accent/30 transition-all duration-500">
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
                <Users className="w-7 h-7" />
              </div>
              
              <h3 className="font-display text-3xl font-bold text-foreground mb-4">
                For Distributors
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Get Digital Distribution Tokens, share your unique links, and earn 20% on every sale. Build your audience, grow your income.
              </p>
              
              <Button variant="goldOutline" size="lg" className="group/btn border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Apply to Distribute
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
