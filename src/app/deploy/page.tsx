'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';
import { getDeployedTestAccountsWallets, getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { Contract, createPXEClient, loadContractArtifact, waitForPXE, Fr, createLogger } from '@aztec/aztec.js';
import { usePXE } from '@/hooks/usePXE';
import { useWallet } from '@/hooks/useWallet';
import { TokenContract } from '@aztec/noir-contracts.js/Token';
import { NFTContract } from '@aztec/noir-contracts.js/NFT';

export default function DeployPage() {
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    // const [decimals, setDecimals] = useState('18');
    // const [contractArtifact, setContractArtifact] = useState(null);
    const [contractAddress, setContractAddress] = useState('');
    const { pxe, isConnected: isPXEConnected } = usePXE();
    const { isConnected: isWalletConnected, address } = useWallet();

    // useEffect(() => {
    //     // Load contract artifact when component mounts
    //     const loadArtifact = async () => {
    //         try {
    //             // In a production app, we would load the artifact from a local file
    //             // or from a remote source. For this example, we'll fetch it at runtime.
    //             const response = await fetch('/contracts/token-Token.json');
    //             if (!response.ok) {
    //                 console.log('Token contract artifact not found, will deploy without it');
    //                 return;
    //             }
    //             const artifactJson = await response.json();
    //             setContractArtifact(artifactJson);
    //         } catch (error) {
    //             console.error('Failed to load contract artifact:', error);
    //         }
    //     };

    //     loadArtifact();
    // }, []);

    const handleDeploy = async () => {
        if (!name || !symbol) {
            toast.error('Name and symbol are required');
            return;
        }

        try {
            setIsDeploying(true);
            if (!pxe) {
                toast.error('PXE is not connected. Make sure your Aztec Sandbox is running.');
                return;
            }
            // const [deployerWallet] = await getDeployedTestAccountsWallets(pxe);
            // const deployerAddress = deployerWallet.getAddress();
            // const nftContract = await NFTContract.deploy(deployerWallet, deployerAddress, name, symbol).send().deployed();
            // console.log('NFT Contract deployed successfully:', nftContract.address.toString());

            console.log('Calling backend API to deploy NFT contract...');
            const response = await fetch('/api/deploy-nft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, symbol }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Deployment failed');
            }
            setContractAddress(data.address);
            toast.success(
                <div>
                    NFT Contract successfully deployed!<br />
                    <strong>Name:</strong> {name}<br />
                    <strong>Symbol:</strong> {symbol}<br />
                    <strong>Address:</strong> <small>{data.address}</small>
                </div>,
                { autoClose: 10000 }
            );
        } catch (error) {
            console.error('Deployment failed:', error);
            toast.error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <AppLayout>
            <div className="deploy-page">
                <h1>Deploy NFT Contract</h1>
                <p className="page-description">
                    Create your own NFT collection by deploying a new contract with custom parameters.
                </p>

                <div className="deploy-form">
                    <div className="form-group">
                        <label htmlFor="name">Collection Name *</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="e.g. My Awesome NFTs"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                        />
                        <p className="helper-text">The name of your NFT collection</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="symbol">Collection Symbol *</label>
                        <input
                            type="text"
                            id="symbol"
                            placeholder="e.g. AWESOME"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            className="form-input"
                        />
                        <p className="helper-text">A short symbol for your NFT (usually 3-5 capital letters)</p>
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="decimals">Decimals</label>
                        <input
                            type="number"
                            id="decimals"
                            placeholder="18"
                            value={decimals}
                            onChange={(e) => setDecimals(e.target.value)}
                            className="form-input"
                            min="0"
                            max="18"
                        />
                        <p className="helper-text">Number of decimal places (usually 18 for most tokens)</p>
                    </div> */}

                    {contractAddress && (
                        <div className="form-group success-container">
                            <h3>Contract Deployed!</h3>
                            <div className="address-display">
                                <label>Contract Address:</label>
                                <div className="address-value">{contractAddress}</div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying || !name || !symbol || !isPXEConnected}
                        className={`submit-button ${isDeploying ? 'loading' : ''}`}
                    >
                        {isDeploying ? 'Deploying...' : 'Deploy Contract'}
                    </button>

                    {!isPXEConnected && (
                        <p className="error-message">PXE is not connected. Make sure your Aztec Sandbox is running.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 