import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect = ({ className }: WalletConnectProps) => {
  return (
    <div className={className}>
      <Wallet>
        <ConnectWallet className="!bg-gradient-to-r !from-gold-500 !to-gold-600 !text-background !font-semibold !rounded-md !px-4 !py-2 hover:!opacity-90 !transition-opacity">
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown className="!bg-card !border-border">
          <Identity 
            className="!px-4 !pt-3 !pb-2" 
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect className="!text-destructive hover:!bg-destructive/10" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

export default WalletConnect;
