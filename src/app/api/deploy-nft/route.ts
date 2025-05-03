import { NextRequest, NextResponse } from 'next/server';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { NFTContract } from '@aztec/noir-contracts.js/NFT';
import { createPXEClient } from '@aztec/aztec.js';

export async function POST(req: NextRequest) {
    try {
        const { name, symbol } = await req.json();
        if (!name || !symbol) {
            return NextResponse.json({ error: 'Name and symbol are required' }, { status: 400 });
        }

        // Connect to PXE (assumes default URL, adjust if needed)
        const pxe = createPXEClient('http://localhost:8080');

        // Get chain ID to confirm connection
        const nodeInfo = await pxe.getNodeInfo();
        console.log(`Backend connected to PXE on chain ${nodeInfo.l1ChainId}`);

        const [deployerWallet] = await getInitialTestAccountsWallets(pxe);
        console.log("deployerWallet", deployerWallet);
        const deployerAddress = deployerWallet.getAddress();

        const nftContract = await NFTContract.deploy(deployerWallet, deployerAddress, name, symbol).send().deployed();

        return NextResponse.json({
            address: nftContract.address.toString(),
            name,
            symbol,
        });
    } catch (error: any) {
        console.error('NFT deployment failed:', error);
        return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
    }
} 