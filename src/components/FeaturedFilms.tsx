import { Play, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Film {
  id: string;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  price: string;
  thumbnail: string;
}

const films: Film[] = [
  {
    id: "1",
    title: "The Last Safari",
    genre: "Drama",
    duration: "1h 54m",
    rating: 4.8,
    price: "KES 500",
    thumbnail: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Nairobi Nights",
    genre: "Thriller",
    duration: "2h 12m",
    rating: 4.6,
    price: "KES 450",
    thumbnail: "https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?w=400&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Serengeti Dreams",
    genre: "Documentary",
    duration: "1h 28m",
    rating: 4.9,
    price: "KES 350",
    thumbnail: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Ubuntu Rising",
    genre: "Action",
    duration: "2h 05m",
    rating: 4.5,
    price: "KES 550",
    thumbnail: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&h=600&fit=crop",
  },
];

const FeaturedFilms = () => {
  return (
    <section id="films" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Featured Films</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover award-winning African cinema. Buy once, own forever.
          </p>
        </div>

        {/* Films Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {films.map((film) => (
            <div
              key={film.id}
              className="group relative rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={film.thumbnail}
                  alt={film.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Button variant="hero" size="icon" className="w-14 h-14 rounded-full">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {film.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {film.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-primary font-medium">{film.genre}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {film.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    {film.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="goldOutline" size="lg">
            Browse All Films
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFilms;
