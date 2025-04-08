'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { deployerEnv } from '../config';
import { toast } from 'react-toastify';
import { usePXE } from './usePXE';
import { Fr, deriveMasterIncomingViewingSecretKey } from '@aztec/aztec.js';
import { AccountManager } from '@aztec/aztec.js/account';
import { SingleKeyAccountContract } from '@aztec/accounts/single_key';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: string | null;
    connecting: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

// Create a context for wallet data
const WalletContext = createContext<WalletContextType>({
    isConnected: false,
    address: null,
    balance: null,
    connecting: false,
    connectWallet: async () => { },
    disconnectWallet: () => { },
});

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    // Get PXE client from the PXE context
    const { pxe, isConnected: isPXEConnected, error: pxeError } = usePXE();

    // Check for stored connection on mount
    useEffect(() => {
        const storedConnection = localStorage.getItem('walletConnected');
        if (storedConnection === 'true' && isPXEConnected) {
            connectWallet();
        }
    }, [isPXEConnected]);

    // Display error if PXE connection fails
    useEffect(() => {
        if (pxeError) {
            toast.error(`PXE connection error: ${pxeError}`);
        }
    }, [pxeError]);

    const connectWallet = async () => {
        if (!pxe) {
            toast.error('PXE service not connected');
            return;
        }

        setConnecting(true);
        try {
            // // Using a random secret key for development - In production, this should be stored securely
            // const secretKey = Fr.random();
            // const encryptionPrivateKey = deriveMasterIncomingViewingSecretKey(secretKey);
            // const accountContract = new SingleKeyAccountContract(encryptionPrivateKey);

            // // Create account manager
            // // @ts-ignore - The AccountManager constructor is private but we need to use it anyway
            // const account = new AccountManager(pxe, secretKey, accountContract);

            // // Register the account (no-op if already registered)
            // const wallet = await account.getWallet();

            // // Get wallet address
            // const walletAddress = wallet.getCompleteAddress().address;

            const [ownerWallet] = await getInitialTestAccountsWallets(pxe);
            const ownerAddress = ownerWallet.getAddress();

            // Mock balance for now - would typically come from a blockchain query
            const walletBalance = '0';

            // Update state
            setIsConnected(true);
            setAddress(ownerAddress.toString());
            setBalance(walletBalance);

            // Store connection in localStorage
            localStorage.setItem('walletConnected', 'true');

            toast.success('Wallet connected successfully');
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            toast.error('Failed to connect wallet');
        } finally {
            setConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setAddress(null);
        setBalance(null);
        localStorage.removeItem('walletConnected');
        toast.info('Wallet disconnected');
    };

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                address,
                balance,
                connecting,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}; 