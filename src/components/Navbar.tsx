import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { WalletConnect } from "@/components/WalletConnect";
import logo from "@/assets/quiflix-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => handleNavigate("/")} className="flex items-center gap-2">
            <img src={logo} alt="Quiflix" className="h-10 md:h-12 w-auto logo-transparent" />
          </button>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="goldGhost" size="sm" onClick={() => handleNavigate("/browse")}>
                  Browse Films
                </Button>
                <WalletConnect />
                <Button variant="goldGhost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="goldGhost" size="sm" onClick={() => handleNavigate("/auth")}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => handleNavigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Button variant="goldGhost" size="sm" className="w-full" onClick={() => handleNavigate("/browse")}>
                    Browse Films
                  </Button>
                  <div className="flex justify-center py-2">
                    <WalletConnect />
                  </div>
                  <Button variant="goldGhost" size="sm" onClick={handleSignOut} className="w-full">
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="goldGhost" size="sm" className="w-full" onClick={() => handleNavigate("/auth")}>
                    Sign In
                  </Button>
                  <Button variant="hero" size="sm" className="w-full" onClick={() => handleNavigate("/auth")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
