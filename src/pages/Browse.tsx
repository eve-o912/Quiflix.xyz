import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Users, Film, Star, Clock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const films = [
  {
    id: 1,
    title: "The Golden Savanna",
    genre: "Drama",
    rating: 4.8,
    duration: "2h 15m",
    price: 500,
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Nairobi Nights",
    genre: "Action",
    rating: 4.5,
    duration: "1h 58m",
    price: 450,
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Mama Africa",
    genre: "Documentary",
    rating: 4.9,
    duration: "1h 42m",
    price: 350,
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Lagos Love Story",
    genre: "Romance",
    rating: 4.6,
    duration: "2h 05m",
    price: 400,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Warrior's Return",
    genre: "Adventure",
    rating: 4.7,
    duration: "2h 20m",
    price: 550,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=600&fit=crop",
  },
  {
    id: 6,
    title: "The Healer",
    genre: "Drama",
    rating: 4.4,
    duration: "1h 55m",
    price: 380,
    image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=400&h=600&fit=crop",
  },
];

const Browse = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse <span className="text-gradient-gold">Films</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover premium African cinema. Buy once, own forever.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Become a Distributor
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get Digital Distribution Tokens and earn 20% on every sale you make.
                  </p>
                  <Button 
                    variant="goldOutline" 
                    size="sm"
                    onClick={() => window.location.href = "mailto:distributors@quiflix.com?subject=Distributor Application"}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Film className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Submit Your Film
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Are you a filmmaker? Upload your film and keep 70% of every sale.
                  </p>
                  <Button 
                    variant="goldOutline" 
                    size="sm" 
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    onClick={() => window.location.href = "mailto:filmmakers@quiflix.com?subject=Film Submission"}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Films Grid */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Featured Films
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {films.map((film) => (
                <div
                  key={film.id}
                  className="group relative rounded-xl overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={film.image}
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-sm font-bold text-foreground mb-1 line-clamp-1">
                        {film.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-primary fill-primary" />
                          {film.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {film.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold text-sm">
                          KES {film.price}
                        </span>
                        <Button 
                          variant="hero" 
                          size="sm" 
                          className="h-8 px-3 text-xs"
                          onClick={() => toast({
                            title: "Coming Soon!",
                            description: `Purchase for "${film.title}" will be available soon via M-Pesa.`,
                          })}
                        >
                          <Play className="w-3 h-3" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs text-foreground">
                      {film.genre}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
