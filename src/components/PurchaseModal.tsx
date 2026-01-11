import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Smartphone, Shield, Loader2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Film {
  id: string | number;
  title: string;
  price: number;
  currency?: string;
  image?: string;
  poster_url?: string;
}

interface PurchaseModalProps {
  film: Film | null;
  isOpen: boolean;
  onClose: () => void;
  distributorCode?: string;
}

const PurchaseModal = ({ film, isOpen, onClose, distributorCode }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: "wallet",
      name: "Connect Wallet",
      description: "Use MetaMask, Coinbase, or any EVM wallet",
      icon: <Wallet className="w-6 h-6" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "custodial",
      name: "Custodial Wallet",
      description: "Quick setup - we manage your wallet securely",
      icon: <Shield className="w-6 h-6" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      id: "mpesa",
      name: "M-Pesa",
      description: "Pay with your mobile money",
      icon: <Smartphone className="w-6 h-6" />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const handlePayment = async (methodId: string) => {
    if (!film || !user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to purchase films.",
        variant: "destructive",
      });
      return;
    }

    setSelectedMethod(methodId);
    setIsProcessing(true);

    try {
      // Create a pending purchase record
      const { error } = await supabase.from("purchases").insert([{
        user_id: user.id,
        film_id: String(film.id),
        distributor_id: distributorCode ? null : null, // TODO: Look up distributor from token
        amount: film.price,
        currency: film.currency || "KES",
        payment_method: methodId,
        status: "pending",
      }]);

      if (error) throw error;

      // Handle different payment methods
      switch (methodId) {
        case "wallet":
          // Check if ethereum wallet is available
          if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
              await (window as any).ethereum.request({ method: "eth_requestAccounts" });
              toast({
                title: "Wallet Connected!",
                description: "Processing your payment on Base network...",
              });
              // TODO: Implement actual blockchain payment
              setTimeout(() => {
                toast({
                  title: "Payment Successful!",
                  description: `You now have access to "${film.title}".`,
                });
                onClose();
              }, 2000);
            } catch (err) {
              throw new Error("Wallet connection failed");
            }
          } else {
            window.open("https://www.coinbase.com/wallet", "_blank");
            toast({
              title: "No Wallet Detected",
              description: "Please install a wallet like Coinbase Wallet or MetaMask.",
            });
          }
          break;

        case "custodial":
          toast({
            title: "Creating Your Wallet...",
            description: "Setting up a secure custodial wallet for you.",
          });
          // TODO: Implement custodial wallet creation with passkey
          setTimeout(() => {
            toast({
              title: "Wallet Created!",
              description: "Your secure wallet is ready. Processing payment...",
            });
            setTimeout(() => {
              toast({
                title: "Payment Successful!",
                description: `You now have access to "${film.title}".`,
              });
              onClose();
            }, 2000);
          }, 2000);
          break;

        case "mpesa":
          toast({
            title: "M-Pesa Payment",
            description: "You will receive an STK push to complete payment.",
          });
          // TODO: Integrate with Pretium for M-Pesa
          setTimeout(() => {
            toast({
              title: "Payment Successful!",
              description: `You now have access to "${film.title}".`,
            });
            onClose();
          }, 3000);
          break;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  if (!film) return null;

  const imageUrl = film.poster_url || film.image;
  const currency = film.currency || "KES";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Purchase Film</DialogTitle>
          <DialogDescription>Choose your preferred payment method</DialogDescription>
        </DialogHeader>

        {/* Film Preview */}
        <div className="flex gap-4 p-4 bg-muted/50 rounded-xl mb-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={film.title}
              className="w-16 h-24 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">{film.title}</h3>
            <p className="text-2xl font-bold text-primary">
              {currency} {film.price}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime access • Watch anywhere
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handlePayment(method.id)}
              disabled={isProcessing}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 text-left ${
                selectedMethod === method.id ? "border-primary bg-primary/5" : ""
              } ${isProcessing && selectedMethod !== method.id ? "opacity-50" : ""}`}
            >
              <div className={`w-12 h-12 rounded-xl ${method.bgColor} flex items-center justify-center ${method.color}`}>
                {isProcessing && selectedMethod === method.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  method.icon
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{method.name}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Revenue Split Info */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            70% goes to filmmaker • 20% to distributor • 10% platform fee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
