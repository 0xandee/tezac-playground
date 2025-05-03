'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { deployerEnv } from '../config';
import { Contract, AztecAddress } from '@aztec/aztec.js';
import { NFTContract } from '@aztec/noir-contracts.js/NFT';
import { Wallet } from '@aztec/aztec.js';

// This is a temporary placeholder for contract types
// Will need to be replaced with actual contract types once available
interface NFTMetadata {
    name: string;
    description: string;
    image: File | null;
}

interface NFTHookProps {
    contract?: Contract;
    contractAddress?: string;
    wallet?: Wallet;
}

// Default NFT contract address - update with your deployed contract
const DEFAULT_NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

export async function publicMintNFT(
    nft: NFTContract,
    minterWallet: Wallet,
    recipient: AztecAddress,
    tokenId: bigint,
) {
    const nftAsMinter = await NFTContract.at(nft.address, minterWallet);
    await nftAsMinter.methods.mint(recipient, tokenId).send().wait();
}

export function useNFT({ contract, contractAddress, wallet }: NFTHookProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [nftContract, setNftContract] = useState<Contract | undefined>(contract);
    const [error, setError] = useState<string | null>(null);
    const [nftWallet, setNftWallet] = useState<Wallet | undefined>(wallet);

    // Load wallet if not provided
    useEffect(() => {
        const loadWallet = async () => {
            if (wallet) {
                setNftWallet(wallet);
                return;
            }

            try {
                const loadedWallet = await deployerEnv.getWallet();
                setNftWallet(loadedWallet);
            } catch (err) {
                console.error('Failed to load wallet:', err);
                setError('Failed to load wallet');
            }
        };

        loadWallet();
    }, [wallet]);

    // Load NFT contract if not provided and contractAddress exists
    useEffect(() => {
        const loadContract = async () => {
            try {
                // If contract is already provided, use it
                if (contract) {
                    setNftContract(contract);
                    return;
                }

                // We need a wallet to load the contract
                if (!nftWallet) {
                    return;
                }

                // Get the contract address to use
                const addressToUse = contractAddress || DEFAULT_NFT_CONTRACT_ADDRESS;

                if (!addressToUse) {
                    console.warn('No NFT contract address provided. Functions will not work until a contract is connected.');
                    return;
                }

                setIsLoading(true);

                // Convert string address to AztecAddress
                const aztecAddress = AztecAddress.fromString(addressToUse);

                // Load the contract with the provided wallet
                const loadedContract = await NFTContract.at(aztecAddress, nftWallet);
                setNftContract(loadedContract as Contract);
                console.log('NFT contract loaded:', loadedContract.address.toString());
            } catch (err) {
                console.error('Failed to load NFT contract:', err);
                setError('Failed to load NFT contract');
            } finally {
                setIsLoading(false);
            }
        };

        loadContract();
    }, [contract, contractAddress, nftWallet]);

    // Mint an NFT (public or private)
    const mintNFT = async (
        metadata: NFTMetadata,
        recipientAddress: string,
        isPrivate: boolean,
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            // Create a token ID (this could be determined by the contract or specified by the user)
            const tokenId = BigInt(Date.now()); // Simple example using timestamp as tokenId

            // Convert recipientAddress to AztecAddress
            const recipient = AztecAddress.fromString(recipientAddress);

            if (isPrivate) {
                // Handle private minting with existing logic
                const imageUrl = metadata.image ? URL.createObjectURL(metadata.image) : null;

                await toast.promise(
                    nftContract.methods.privateMint(
                        recipientAddress,
                        {
                            name: metadata.name,
                            description: metadata.description,
                            image: imageUrl || 'https://placeholder.com/nft'
                        },
                        nftWallet.getCompleteAddress().address
                    ).send().wait(),
                    {
                        pending: 'Private minting in progress...',
                        success: 'NFT has been privately minted!',
                        error: 'Failed to mint NFT'
                    }
                );
            } else {
                // Use the new public minting function
                try {
                    const nftContractInstance = await NFTContract.at(nftContract.address, nftWallet);

                    await toast.promise(
                        publicMintNFT(nftContractInstance, nftWallet, recipient, tokenId),
                        {
                            pending: 'Public minting in progress...',
                            success: 'NFT has been publicly minted!',
                            error: 'Failed to mint NFT'
                        }
                    );
                } catch (error) {
                    console.error('Error getting NFT contract:', error);
                    toast.error('Failed to initialize NFT contract');
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Mint error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Transfer an NFT
    const transferNFT = async (
        tokenId: string,
        recipientAddress: string,
        isPrivate: boolean
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            // Call the transfer function based on privacy setting
            const transferMethod = isPrivate
                ? nftContract.methods.privateTransfer
                : nftContract.methods.publicTransfer;

            await toast.promise(
                transferMethod(
                    tokenId,
                    recipientAddress,
                    nftWallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: `${isPrivate ? 'Private' : 'Public'} transfer in progress...`,
                    success: `NFT has been ${isPrivate ? 'privately' : 'publicly'} transferred!`,
                    error: 'Failed to transfer NFT'
                }
            );

            return true;
        } catch (error) {
            console.error('Transfer error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // List an NFT for sale
    const listNFT = async (
        tokenId: string,
        price: string,
        isPrivate: boolean
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const priceValue = BigInt(price);

            // Call the list function based on privacy setting
            const listMethod = isPrivate
                ? nftContract.methods.privateList
                : nftContract.methods.publicList;

            await toast.promise(
                listMethod(
                    tokenId,
                    priceValue,
                    nftWallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: `${isPrivate ? 'Private' : 'Public'} listing in progress...`,
                    success: `NFT has been ${isPrivate ? 'privately' : 'publicly'} listed for sale!`,
                    error: 'Failed to list NFT'
                }
            );

            return true;
        } catch (error) {
            console.error('Listing error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel a listing
    const cancelListing = async (
        tokenId: string,
        isPrivate: boolean
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            // Call the cancel function based on privacy setting
            const cancelMethod = isPrivate
                ? nftContract.methods.privateCancelListing
                : nftContract.methods.publicCancelListing;

            await toast.promise(
                cancelMethod(
                    tokenId,
                    nftWallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: `${isPrivate ? 'Private' : 'Public'} cancellation in progress...`,
                    success: `Listing has been ${isPrivate ? 'privately' : 'publicly'} cancelled!`,
                    error: 'Failed to cancel listing'
                }
            );

            return true;
        } catch (error) {
            console.error('Cancel listing error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Buy an NFT
    const buyNFT = async (
        tokenId: string,
        price: string,
        isPrivate: boolean
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const priceValue = BigInt(price);

            // Call the buy function based on privacy setting
            const buyMethod = isPrivate
                ? nftContract.methods.privateBuy
                : nftContract.methods.publicBuy;

            await toast.promise(
                buyMethod(
                    tokenId,
                    priceValue,
                    nftWallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: `${isPrivate ? 'Private' : 'Public'} purchase in progress...`,
                    success: `NFT has been ${isPrivate ? 'privately' : 'publicly'} purchased!`,
                    error: 'Failed to buy NFT'
                }
            );

            return true;
        } catch (error) {
            console.error('Buy error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Verify ownership of an NFT
    const verifyOwnership = async (
        tokenId: string,
        ownerAddress: string
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return false;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return false;
        }

        setIsLoading(true);
        try {
            // Call the verifyOwnership function
            const result = await nftContract.methods.verifyOwnership(
                tokenId,
                ownerAddress,
                nftWallet.getCompleteAddress().address
            ).simulate();

            const isOwner = Boolean(result.value);

            toast.info(
                isOwner
                    ? `Address ${ownerAddress} is the owner of token ${tokenId}`
                    : `Address ${ownerAddress} is NOT the owner of token ${tokenId}`
            );

            return isOwner;
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Failed to verify ownership');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Bridge an NFT to L1
    const bridgeNFT = async (
        tokenId: string,
        l1Address: string
    ) => {
        if (!nftContract) {
            toast.error('Contract not initialized');
            return;
        }

        if (!nftWallet) {
            toast.error('Wallet not initialized');
            return;
        }

        setIsLoading(true);
        try {
            await toast.promise(
                nftContract.methods.bridgeToL1(
                    tokenId,
                    l1Address,
                    nftWallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: 'Bridging NFT to L1...',
                    success: 'NFT has been bridged to L1!',
                    error: 'Failed to bridge NFT'
                }
            );

            return true;
        } catch (error) {
            console.error('Bridge error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        nftContract,
        nftWallet,
        mintNFT,
        transferNFT,
        listNFT,
        cancelListing,
        buyNFT,
        verifyOwnership,
        bridgeNFT,
    };
} 