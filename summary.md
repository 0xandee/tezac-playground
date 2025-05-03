- Added a Buffer polyfill to `src/app/layout.tsx` to ensure Node.js Buffer methods are available in the browser. This fixes the `readUint32BE is not a function` error encountered during contract deployment with Aztec.js.

- Planned migration: NFT contract deployment logic will be moved from the frontend to a Node.js backend API route for security and reliability. The new API route will be created at `src/app/api/deploy-nft/route.ts` (Next.js app router). The frontend will call this API and display the deployed contract address or error.

- Implemented the backend API route at `src/app/api/deploy-nft/route.ts` to handle NFT contract deployment using Aztec.js and return the deployed address.
- Updated the frontend deployment page (`src/app/deploy/page.tsx`) to call the backend API for contract deployment and display the result to the user.

- Added the dedicated `publicMintNFT` function to `src/hooks/useNFT.tsx` to handle public minting operations. This function accepts an NFT contract instance, minter wallet, recipient address, and token ID, then calls the contract's mint method.
- Replaced the implementation of the hook's `mintNFT` method to utilize the new `publicMintNFT` function for public minting, while maintaining the private minting functionality.
- Added appropriate error handling and AztecAddress conversion for the recipient address.

- Fixed "Contract not initialized" error in the useNFT hook:

    - Enhanced `useNFT` hook to load NFT contracts dynamically using an address provided via props or from environment variables.
    - Added useEffect to initialize the contract when the component mounts.
    - Added environment configuration in `.env.local` for NFT contract address.
    - Updated `src/app/mint/page.tsx` to pass the contract address to the useNFT hook.
    - Added error state and proper handling for contract loading failures.

- Modified `useNFT` hook to accept a wallet instance as a parameter instead of getting it from the environment:
    - Added `wallet` parameter to `NFTHookProps` interface
    - Created a new state variable `nftWallet` to track the wallet instance
    - Added useEffect to load wallet from environment only if not provided as prop
    - Updated all methods to use the wallet from state instead of fetching from environment
    - Added wallet validation checks in all methods
    - Exposed `nftWallet` and `nftContract` in the returned object for more flexibility
    - Updated `src/app/mint/page.tsx` to fetch a wallet and pass it to the `useNFT` hook

# NFT Minting API Implementation

## Changes Made

1. Created a new API endpoint for minting NFTs:

    - Created `src/app/api/mint-nft/route.ts` which handles both public and private NFT minting
    - The API connects to the PXE client, loads the NFT contract, and performs minting operations
    - Supports both public and private minting modes

2. Updated the NFT minting page:
    - Modified `src/app/mint/page.tsx` to use the new API endpoint
    - Removed direct wallet and contract interactions from the frontend
    - Added proper error handling and loading states
    - Maintained the same user interface and form validation

## Technical Details

The new implementation follows a more secure architecture by moving the blockchain interactions to the server-side API:

- The frontend collects user input (NFT name, description, image, recipient address)
- The API handles all interactions with the Aztec blockchain
- Error handling is improved with specific error messages from the API
- The implementation maintains support for both public and private minting

## Future Improvements

- Add file upload handling to store images on IPFS or similar decentralized storage
- Implement authentication for the API endpoint
- Add rate limiting to prevent abuse
- Create a more comprehensive response with detailed transaction information
