import { useState } from 'react';
import { deployerEnv } from '../config';

import { Contract, Fr } from '@aztec/aztec.js';
import { toast } from 'react-toastify';

// Import NFTContract from artifacts when available
// This will need to be updated once you generate the artifacts
// import { NFTContract } from '../../artifacts/NFT';

// Temporary placeholder for NFTContract until artifacts are generated
const NFTContract = {
    deploy: (wallet: any, address: any, name: string, symbol: string, owner: any) => ({
        send: ({ contractAddressSalt }: { contractAddressSalt: Fr }) => ({
            deployed: () => Promise.resolve({ address: '0x...' }),
        }),
    }),
};

export function useContract() {
    const [wait, setWait] = useState(false);
    const [contract, setContract] = useState<Contract | undefined>();

    const deploy = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setWait(true);
        try {
            const wallet = await deployerEnv.getWallet();
            const salt = Fr.random();

            const tx = await NFTContract.deploy(
                wallet,
                wallet.getCompleteAddress().address,
                "NFT Collection",
                "NFT",
                wallet.getCompleteAddress().address,
            ).send({
                contractAddressSalt: salt,
            });

            const deployedContract = await toast.promise(tx.deployed(), {
                pending: 'Deploying contract...',
                success: {
                    render: ({ data }: { data: any }) => `Address: ${data.address}`,
                },
                error: 'Error deploying contract',
            });

            setContract(deployedContract as Contract);
        } catch (error) {
            console.error('Failed to deploy contract:', error);
            toast.error('Failed to deploy contract');
        } finally {
            setWait(false);
        }
    };

    return { deploy, contract, wait };
} 