import { ReactNode, createContext, useContext, useState, useCallback } from 'react';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

interface OnchainContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const OnchainContext = createContext<OnchainContextType | undefined>(undefined);

interface OnchainProviderProps {
  children: ReactNode;
}

export const OnchainProvider = ({ children }: OnchainProviderProps) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
  });

  const connect = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    
    try {
      // Check if MetaMask or similar is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        
        // Request account access
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          // Switch to Base network (chainId: 8453)
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x2105' }], // 8453 in hex
            });
          } catch (switchError: any) {
            // If Base network is not added, add it
            if (switchError.code === 4902) {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x2105',
                  chainName: 'Base',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                }],
              });
            }
          }
          
          setWallet({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
          });
        }
      } else {
        // No wallet detected - open Coinbase Wallet download page
        window.open('https://www.coinbase.com/wallet', '_blank');
        setWallet(prev => ({ ...prev, isConnecting: false }));
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  return (
    <OnchainContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </OnchainContext.Provider>
  );
};

export const useOnchain = () => {
  const context = useContext(OnchainContext);
  if (context === undefined) {
    throw new Error('useOnchain must be used within an OnchainProvider');
  }
  return context;
};

export default OnchainProvider;
