import { Button } from "@/components/ui/button";
import { Wallet, LogOut, ExternalLink } from "lucide-react";
import { useOnchain } from "@/providers/OnchainProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect = ({ className }: WalletConnectProps) => {
  const { wallet, connect, disconnect } = useOnchain();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (wallet.isConnected && wallet.address) {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="goldOutline" 
              size="sm"
              className="gap-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {formatAddress(wallet.address)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => window.open(`https://basescan.org/address/${wallet.address}`, '_blank')}
              className="gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              View on BaseScan
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={disconnect}
              className="gap-2 cursor-pointer text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button 
        variant="goldOutline" 
        size="sm"
        onClick={connect}
        disabled={wallet.isConnecting}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        {wallet.isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default WalletConnect;
