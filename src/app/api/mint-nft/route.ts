import { NextRequest, NextResponse } from 'next/server';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { NFTContract } from '@aztec/noir-contracts.js/NFT';
import { createPXEClient } from '@aztec/aztec.js';
import { AztecAddress } from '@aztec/aztec.js';
import fs from 'fs';
import path from 'path';

// Monkey-patch fs.openSync to redirect the WASM file path
const originalOpen = fs.openSync;
console.log("originalOpen1", originalOpen);
fs.openSync = (filePath, flags) => {
    if (filePath.toString().includes('barretenberg-threads.wasm.gz')) {
        const correctPath = path.join(
            process.cwd(),
            'node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/barretenberg-threads.wasm.gz'
        );
        console.log('Redirecting WASM file access to:', correctPath);
        console.log("originalOpen2", originalOpen);
        return originalOpen(correctPath, flags);
    }
    console.log("originalOpen3", originalOpen);
    return originalOpen(filePath, flags);
};

export async function POST(req: NextRequest) {
    try {
        const { name, description, image, recipientAddress, isPrivate } = await req.json();

        if (!name || !description || !recipientAddress) {
            return NextResponse.json(
                { error: 'Name, description, and recipient address are required' },
                { status: 400 }
            );
        }
        // /Users/0xandee/Documents/Github/tezac/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/barretenberg-threads.wasm.gz
        // '[project]/node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/fetch_code/node/index.js [app-route] (ecmascript)/../../barretenberg-threads.wasm.gz'
        const aztec = require('@aztec/bb.js');
        console.log('Current working directory:', process.cwd());

        // Connect to PXE
        const pxeUrl = process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080';
        const pxe = createPXEClient(pxeUrl);

        // Get chain ID to confirm connection
        const nodeInfo = await pxe.getNodeInfo();
        console.log(`Backend connected to PXE on chain ${nodeInfo.l1ChainId}`);

        // Get a wallet to use for minting
        const [wallet] = await getInitialTestAccountsWallets(pxe);
        const walletAddress = wallet.getAddress();
        console.log("Using wallet for minting:", walletAddress.toString());

        // Get the NFT contract
        const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
        if (!nftContractAddress) {
            return NextResponse.json(
                { error: 'NFT contract address not configured' },
                { status: 500 }
            );
        }

        // Load the NFT contract
        const contractAddress = AztecAddress.fromString(nftContractAddress);
        const nftContract = await NFTContract.at(contractAddress, wallet);
        console.log("NFT contract loaded:", nftContract.address.toString());

        // Create a token ID using timestamp
        const tokenId = BigInt(Date.now());

        // Convert recipient address to AztecAddress
        const recipient = AztecAddress.fromString(recipientAddress);

        // Mint the NFT (public or private)
        if (isPrivate) {
            // Private mint
            const imageUrl = image || 'https://placeholder.com/nft'; // Use default if no image
            await nftContract.methods.privateMint(
                recipientAddress,
                {
                    name,
                    description,
                    image: imageUrl
                },
                wallet.getCompleteAddress().address
            ).send().wait();
        } else {
            // Public mint
            await nftContract.methods.mint(recipient, tokenId).send().wait();
        }

        return NextResponse.json({
            success: true,
            tokenId: tokenId.toString(),
            recipient: recipientAddress,
            isPrivate
        });
    } catch (error: any) {
        console.error('NFT minting failed:', error);
        return NextResponse.json(
            { error: error?.message || 'Unknown error' },
            { status: 500 }
        );
    }
} 