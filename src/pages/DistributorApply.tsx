import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Target, Clock, FileText, Link as LinkIcon, MessageSquare } from "lucide-react";

const distributorSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  distributionPlan: z.string().min(50, "Please provide at least 50 characters describing your distribution plan").max(2000),
  targetFilms: z.string().min(10, "Please specify which films you want to distribute").max(500),
  targetCustomers: z.coerce.number().min(10, "Target must be at least 10 customers").max(1000000),
  timelineMonths: z.coerce.number().min(1, "Timeline must be at least 1 month").max(60),
  experience: z.string().max(1000).optional(),
  socialMediaLinks: z.string().max(500).optional(),
  additionalInfo: z.string().max(1000).optional(),
});

type DistributorFormData = z.infer<typeof distributorSchema>;

const DistributorApply = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DistributorFormData>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      portfolioUrl: "",
      distributionPlan: "",
      targetFilms: "",
      targetCustomers: 100,
      timelineMonths: 6,
      experience: "",
      socialMediaLinks: "",
      additionalInfo: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (data: DistributorFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Save to database
      const { error: dbError } = await supabase.from("distributor_applications").insert({
        user_id: user.id,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        portfolio_url: data.portfolioUrl || null,
        distribution_plan: data.distributionPlan,
        target_films: data.targetFilms,
        target_customers: data.targetCustomers,
        timeline_months: data.timelineMonths,
        experience: data.experience || null,
        social_media_links: data.socialMediaLinks || null,
        additional_info: data.additionalInfo || null,
      });

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-distributor-application", {
        body: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          portfolioUrl: data.portfolioUrl,
          distributionPlan: data.distributionPlan,
          targetFilms: data.targetFilms,
          targetCustomers: data.targetCustomers,
          timelineMonths: data.timelineMonths,
          experience: data.experience,
          socialMediaLinks: data.socialMediaLinks,
          additionalInfo: data.additionalInfo,
        },
      });

      if (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });

      reset();
      navigate("/browse");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Become a <span className="text-gradient-gold">Distributor</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Apply to distribute films on Quiflix and earn 20% commission on every sale through your Digital Distribution Token.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    {...register("fullName")}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Portfolio & Experience */}
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Portfolio & Experience
              </h2>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio URL (Optional)</Label>
                <Input
                  id="portfolioUrl"
                  type="url"
                  placeholder="https://your-portfolio.com"
                  {...register("portfolioUrl")}
                  className={errors.portfolioUrl ? "border-destructive" : ""}
                />
                {errors.portfolioUrl && (
                  <p className="text-sm text-destructive">{errors.portfolioUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Distribution Experience (Optional)</Label>
                <Textarea
                  id="experience"
                  placeholder="Tell us about your experience in content distribution, marketing, or related fields..."
                  rows={3}
                  {...register("experience")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMediaLinks">Social Media Links (Optional)</Label>
                <Textarea
                  id="socialMediaLinks"
                  placeholder="Links to your social media profiles (one per line)"
                  rows={2}
                  {...register("socialMediaLinks")}
                />
              </div>
            </div>

            {/* Distribution Plan */}
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Distribution Plan
              </h2>

              <div className="space-y-2">
                <Label htmlFor="targetFilms">Which Films Do You Want to Distribute? *</Label>
                <Textarea
                  id="targetFilms"
                  placeholder="Specify the films or genres you're interested in distributing..."
                  rows={2}
                  {...register("targetFilms")}
                  className={errors.targetFilms ? "border-destructive" : ""}
                />
                {errors.targetFilms && (
                  <p className="text-sm text-destructive">{errors.targetFilms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributionPlan">How Will You Distribute the Films? *</Label>
                <Textarea
                  id="distributionPlan"
                  placeholder="Describe your distribution strategy, marketing channels, target audience, and how you plan to reach potential buyers..."
                  rows={4}
                  {...register("distributionPlan")}
                  className={errors.distributionPlan ? "border-destructive" : ""}
                />
                {errors.distributionPlan && (
                  <p className="text-sm text-destructive">{errors.distributionPlan.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCustomers" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Target Number of Customers *
                  </Label>
                  <Input
                    id="targetCustomers"
                    type="number"
                    min={10}
                    placeholder="e.g., 500"
                    {...register("targetCustomers")}
                    className={errors.targetCustomers ? "border-destructive" : ""}
                  />
                  {errors.targetCustomers && (
                    <p className="text-sm text-destructive">{errors.targetCustomers.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timelineMonths" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Timeline (Months) *
                  </Label>
                  <Input
                    id="timelineMonths"
                    type="number"
                    min={1}
                    max={60}
                    placeholder="e.g., 6"
                    {...register("timelineMonths")}
                    className={errors.timelineMonths ? "border-destructive" : ""}
                  />
                  {errors.timelineMonths && (
                    <p className="text-sm text-destructive">{errors.timelineMonths.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Additional Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Anything Else We Should Know? (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any other information you'd like to share with us..."
                  rows={3}
                  {...register("additionalInfo")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              By submitting, you agree to our terms of service. We'll review your application and contact you within 3-5 business days.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DistributorApply;
