'use client';

import { usePXE } from '../hooks/usePXE';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';

export default function PXEStatus() {
    const { isConnected, connecting, accounts, error, chainId } = usePXE();
    const { connectWallet, isConnected: isWalletConnected, address } = useWallet();
    const [showAccounts, setShowAccounts] = useState(false);

    return (
        <div className="rounded-lg overflow-hidden w-full">
            <div className="p-3 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">PXE Status:</span>
                    {connecting ? (
                        <span className="text-yellow-300 font-bold">Connecting...</span>
                    ) : isConnected ? (
                        <span className="text-green-400 font-bold">Connected</span>
                    ) : (
                        <span className="text-red-400 font-bold">Disconnected</span>
                    )}
                </div>

                {chainId && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Chain ID:</span>
                        <span className="text-gray-200 font-medium">{chainId}</span>
                    </div>
                )}

                {error && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-800 rounded text-red-400 text-xs">
                        <span className="font-semibold block mb-1">Error:</span>
                        <span>{error}</span>
                    </div>
                )}

                {isConnected && (
                    <>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-400">Accounts:</span>
                            <div className="flex items-center">
                                <button
                                    className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded transition-colors cursor-pointer"
                                    onClick={() => setShowAccounts(!showAccounts)}
                                >
                                    {`${accounts.length} ${showAccounts ? '(Hide)' : '(Show)'}`}
                                </button>
                            </div>
                        </div>

                        {showAccounts && accounts.length > 0 && (
                            <div className="mt-2">
                                <ul className="text-xs bg-gray-800 border border-gray-700 p-2 rounded overflow-auto max-h-32">
                                    {accounts.map((account, index) => (
                                        <li key={index} className="mb-1 pb-1 border-b border-gray-700 last:border-0 last:mb-0 last:pb-0 break-all text-gray-300">
                                            {account}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 