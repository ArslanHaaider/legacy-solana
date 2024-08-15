'use client';
import { useEffect } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import Navbar from '../components/Navbar';
import { NavbarMinimal } from '../components/SideNavbar';
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { useWallet } from '@solana/wallet-adapter-react';

const Owner = () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const { publicKey } = useWallet();

    useEffect(() => {
        if (!publicKey) {
            console.log('No public key found. Wallet might not be connected.');
            return;
        }

        console.log('Fetching tokens and SOL balance for public key:', publicKey.toBase58());

        async function fetchBalances() {
            try {
                // Fetch SOL balance
                const solBalance = await connection.getBalance(publicKey);
                console.log('SOL Balance:', solBalance / 1e9, 'SOL'); // Convert from lamports to SOL

                // Fetch token accounts owned by the user
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                    programId: TOKEN_PROGRAM_ID, // Token program ID
                });

                console.log('Token accounts fetched:', tokenAccounts);

                // Process the token accounts
                tokenAccounts.value.forEach((accountInfo) => {
                    const accountData = accountInfo.account.data.parsed.info;
                    console.log('Token Mint:', accountData.mint);
                    console.log('Token Amount:', accountData.tokenAmount.uiAmount);
                });
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        }

        fetchBalances();
    }, [publicKey]);

    return (
        <>
            <Navbar />
            <div className="">
                <NavbarMinimal />
            </div>
        </>
    );
};

export default Owner;
