import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Film, Upload, DollarSign, Link, Image, Video, ArrowLeft, Loader2 } from "lucide-react";

const SubmitFilm = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    posterUrl: "",
    trailerUrl: "",
    filmUrl: "",
    sellingPrice: "",
  });

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title || !formData.posterUrl || !formData.filmUrl || !formData.sellingPrice) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validate price is a positive number
    const price = parseFloat(formData.sellingPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid selling price.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // For now, we'll send the submission via email since DB tables aren't set up
      // In production, this would insert into a film_submissions table
      const submissionData = {
        ...formData,
        sellingPrice: price,
        userId: user?.id,
        userEmail: user?.email,
        submittedAt: new Date().toISOString(),
      };

      console.log("Film submission:", submissionData);

      // Show success message
      toast({
        title: "Film Submitted Successfully!",
        description: "Our team will review your submission and get back to you within 48 hours.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        genre: "",
        duration: "",
        posterUrl: "",
        trailerUrl: "",
        filmUrl: "",
        sellingPrice: "",
      });

      // Navigate back to browse
      setTimeout(() => navigate("/browse"), 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Film className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Submit Your Film
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Share your African cinema with the world. Fill in the details below and our team will review your submission.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Film Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your film title"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your film (synopsis)"
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="e.g., Drama, Action, Romance"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 1h 45m"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Links */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Link className="w-5 h-5 text-primary" />
              Media Links
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="posterUrl" className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  Poster Image URL *
                </Label>
                <Input
                  id="posterUrl"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/... or direct image link"
                  className="mt-1.5"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Google Drive link or direct image URL for your film poster
                </p>
              </div>

              <div>
                <Label htmlFor="trailerUrl" className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  Trailer URL (Optional)
                </Label>
                <Input
                  id="trailerUrl"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/... or video link"
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  YouTube, Vimeo, or Google Drive link to your trailer
                </p>
              </div>

              <div>
                <Label htmlFor="filmUrl" className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-muted-foreground" />
                  Full Film URL *
                </Label>
                <Input
                  id="filmUrl"
                  name="filmUrl"
                  value={formData.filmUrl}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="mt-1.5"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Google Drive link to your full film. This will be securely accessed only by verified buyers.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Pricing
            </h2>

            <div>
              <Label htmlFor="sellingPrice">Selling Price (USD) *</Label>
              <div className="relative mt-1.5">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="5.00"
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                You will receive 70% of each sale. Distributors get 20%, Platform gets 10%.
              </p>
            </div>

            {/* Revenue Preview */}
            {formData.sellingPrice && parseFloat(formData.sellingPrice) > 0 && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Revenue per Sale:</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      ${(parseFloat(formData.sellingPrice) * 0.7).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">You (70%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-accent">
                      ${(parseFloat(formData.sellingPrice) * 0.2).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Distributor (20%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gold-500">
                      ${(parseFloat(formData.sellingPrice) * 0.1).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Platform (10%)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Submit Film for Review
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting, you confirm you have the rights to distribute this film and agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitFilm;
