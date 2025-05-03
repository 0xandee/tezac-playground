import { Fr, createPXEClient, deriveMasterIncomingViewingSecretKey } from '@aztec/aztec.js';
import { AccountManager } from '@aztec/aztec.js/account';
import { SingleKeyAccountContract } from '@aztec/accounts/single_key';

// Using a random secret key for development
// In production, this should be securely stored and not exposed
const SECRET_KEY = Fr.random();

export class PrivateEnv {
    pxe;
    accountContract;
    account;

    constructor(
        private secretKey: Fr,
        private pxeURL: string,
    ) {
        this.pxe = createPXEClient(this.pxeURL);
        const encryptionPrivateKey = deriveMasterIncomingViewingSecretKey(secretKey);
        this.accountContract = new SingleKeyAccountContract(encryptionPrivateKey);

        // @ts-ignore - The AccountManager constructor is private but we need to use it anyway
        this.account = new AccountManager(this.pxe, this.secretKey, this.accountContract);
    }

    async getWallet() {
        // taking advantage that register is no-op if already registered
        return await this.account.register();
    }
}

// Create the deployer environment using the PXE URL from environment variables
export const deployerEnv = new PrivateEnv(
    SECRET_KEY,
    process.env.NEXT_PUBLIC_PXE_URL || 'http://localhost:8080'
);

// Filter out functions we don't want to expose in the UI
export const IGNORE_FUNCTIONS = ['constructor', 'compute_note_hash_and_optionally_a_nullifier']; 