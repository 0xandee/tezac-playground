'use client';

import { createPXEClient, PXE } from '@aztec/aztec.js';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface PXEContextType {
    pxe: PXE | null;
    isConnected: boolean;
    connecting: boolean;
    accounts: string[];
    error: string | null;
    chainId: number | null;
    refreshAccounts: () => Promise<void>;
}

const PXEContext = createContext<PXEContextType>({
    pxe: null,
    isConnected: false,
    connecting: false,
    accounts: [],
    error: null,
    chainId: null,
    refreshAccounts: async () => { },
});

export const usePXE = () => useContext(PXEContext);

export const PXEProvider = ({ children }: { children: React.ReactNode }) => {
    const [pxe, setPXE] = useState<PXE | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);

    // Connect to PXE on component mount
    useEffect(() => {
        const connectToPXE = async () => {
            setConnecting(true);
            try {
                const pxeUrl = process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080';
                const pxeClient = await createPXEClient(pxeUrl);

                // Get chain ID to confirm connection
                const { l1ChainId } = await pxeClient.getNodeInfo();
                console.log(`Connected to PXE on chain ${l1ChainId}`);

                setPXE(pxeClient);
                setChainId(Number(l1ChainId));
                setIsConnected(true);

                // Load accounts
                await loadAccounts(pxeClient);

                const accounts = await pxeClient.getRegisteredAccounts();
                console.log(`User accounts:\n${accounts.map(a => a.address).join('\n')}`);

                setError(null);
            } catch (err) {
                console.error('Failed to connect to PXE:', err);
                setError(`Failed to connect to PXE: ${err instanceof Error ? err.message : String(err)}`);
                toast.error('Failed to connect to Aztec PXE service. Make sure Sandbox is running.');
            } finally {
                setConnecting(false);
            }
        };

        connectToPXE();
    }, []);

    const loadAccounts = async (pxeClient: PXE) => {
        try {
            const userAccounts = await pxeClient.getRegisteredAccounts();
            setAccounts(userAccounts.map(a => a.address.toString()));
        } catch (err) {
            console.error('Failed to load accounts:', err);
            setError(`Failed to load accounts: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const refreshAccounts = async () => {
        if (pxe) {
            await loadAccounts(pxe);
        }
    };

    return (
        <PXEContext.Provider
            value={{
                pxe,
                isConnected,
                connecting,
                accounts,
                error,
                chainId,
                refreshAccounts,
            }}
        >
            {children}
        </PXEContext.Provider>
    );
}; 