'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { deployerEnv } from '../config';
import { Contract } from '@aztec/aztec.js';

// This is a temporary placeholder for contract types
// Will need to be replaced with actual contract types once available
interface NFTMetadata {
    name: string;
    description: string;
    image: File | null;
}

interface NFTHookProps {
    contract?: Contract;
}

export function useNFT({ contract }: NFTHookProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Mint an NFT (public or private)
    const mintNFT = async (
        metadata: NFTMetadata,
        recipientAddress: string,
        isPrivate: boolean,
    ) => {
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();

            // Create a placeholder for the image URL
            // In a real app, you would upload the image to IPFS or similar storage
            const imageUrl = metadata.image ? URL.createObjectURL(metadata.image) : null;

            // Call the mint function based on privacy setting
            const mintMethod = isPrivate
                ? contract.methods.privateMint
                : contract.methods.publicMint;

            await toast.promise(
                mintMethod(
                    recipientAddress,
                    {
                        name: metadata.name,
                        description: metadata.description,
                        image: imageUrl || 'https://placeholder.com/nft'
                    },
                    wallet.getCompleteAddress().address
                ).send().wait(),
                {
                    pending: `${isPrivate ? 'Private' : 'Public'} minting in progress...`,
                    success: `NFT has been ${isPrivate ? 'privately' : 'publicly'} minted!`,
                    error: 'Failed to mint NFT'
                }
            );

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
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();

            // Call the transfer function based on privacy setting
            const transferMethod = isPrivate
                ? contract.methods.privateTransfer
                : contract.methods.publicTransfer;

            await toast.promise(
                transferMethod(
                    tokenId,
                    recipientAddress,
                    wallet.getCompleteAddress().address
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
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();
            const priceValue = BigInt(price);

            // Call the list function based on privacy setting
            const listMethod = isPrivate
                ? contract.methods.privateList
                : contract.methods.publicList;

            await toast.promise(
                listMethod(
                    tokenId,
                    priceValue,
                    wallet.getCompleteAddress().address
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
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();

            // Call the cancel function based on privacy setting
            const cancelMethod = isPrivate
                ? contract.methods.privateCancelListing
                : contract.methods.publicCancelListing;

            await toast.promise(
                cancelMethod(
                    tokenId,
                    wallet.getCompleteAddress().address
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
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();
            const priceValue = BigInt(price);

            // Call the buy function based on privacy setting
            const buyMethod = isPrivate
                ? contract.methods.privateBuy
                : contract.methods.publicBuy;

            await toast.promise(
                buyMethod(
                    tokenId,
                    priceValue,
                    wallet.getCompleteAddress().address
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
        if (!contract) {
            toast.error('Contract not initialized');
            return false;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();

            // Call the verifyOwnership function
            const result = await contract.methods.verifyOwnership(
                tokenId,
                ownerAddress,
                wallet.getCompleteAddress().address
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
        if (!contract) {
            toast.error('Contract not initialized');
            return;
        }

        setIsLoading(true);
        try {
            const wallet = await deployerEnv.getWallet();

            await toast.promise(
                contract.methods.bridgeToL1(
                    tokenId,
                    l1Address,
                    wallet.getCompleteAddress().address
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
        mintNFT,
        transferNFT,
        listNFT,
        cancelListing,
        buyNFT,
        verifyOwnership,
        bridgeNFT,
    };
} 