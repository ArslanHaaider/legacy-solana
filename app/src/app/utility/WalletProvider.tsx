'use client'
import { useMemo,useCallback } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork ,WalletError } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
 
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
 
function WalletProviders({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // if desired, manually define specific/custom wallets here (normally not required)
      // otherwise, the wallet-adapter will auto detect the wallets a user's browser has available
    ],
    [network],
  );
 
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError}  autoConnect >
        <WalletModalProvider>
            {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
 
export default WalletProviders;