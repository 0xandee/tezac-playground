<p align="center">
  <img src="https://github.com/user-attachments/assets/f1d907bb-ebf0-4683-948c-e781f22ea5c7" height="256">
</p>

<h1 align="center">Tezac NFT Trading Protocol</h1>

<p align="center">
  <strong>A privacy-preserving NFT trading protocol built on the Aztec Network. With encrypted ownership, private cross-chain trade established L1/L2 collections.

 all with ZK proofs.</strong>
</p>

---

## Overview

Tezac leverages Aztec’s zkRollup architecture to encrypt NFT ownership data and transactions, ensuring on-chain privacy for trading, auctions, and gaming applications. By bridging established NFT collections from L1 (e.g., Ethereum), Tezac combines the liquidity of major ecosystems with the privacy benefits of zero-knowledge proofs.

## Features

1. **Private NFT Ownership and Trading**  
   Ownership records are encrypted, and all trades occur using private notes, obscuring user identities and transaction details.

2. **Hidden Reserve Prices and Blind Auctions**  
   Sellers can set hidden reserve prices, while buyers participate in sealed-bid auctions without revealing their bids on-chain until settlement.

3. **Cross-Chain NFT Trading**  
   Integrates with existing L1 NFT collections through a bridge system, enabling private trading of established NFTs.

4. **Provably Fair NFT Games**  
   Verifiable randomness ensures fair raffles, lotteries, or mystery box reveals without exposing participant identities or sensitive state.

5. **Front-Running Resistance**  
   Time-locked or encrypted order submissions prevent miners or bots from exploiting transaction details in the mempool.

## Roadmap

0. Create Private NFT Contracts (WIP)
1. Creating Private Listings & Purchasing (WIP)
3. Cross-Chain Trading

## Getting Started

### Prerequisites

- **Node > v18**
- **Docker**

### Usage

1. **Install Dependencies**
   ```bash
   yarn
   ```
2. **Prepare Artifacts**
   ```bash
   yarn prep
   ```
3. **Start the Development Server**
   ```bash
   yarn dev
   ```

## Contributing

We welcome pull requests, feature requests, and bug reports. When contributing, please ensure:

1. Your code is properly formatted (`yarn formatting:fix`).
2. All tests pass (`yarn test`).
3. You adhere to the project structure and code style guidelines.

For questions, reach out in the [Issues](../../issues) or on our community Telegram group: [https://t.me/+WI9728WPBOE0N2M1](https://t.me/+WI9728WPBOE0N2M1)

## Resources

### Aztec Protocol Resources

- [Aztec Docs](https://docs.aztec.network/)
- [Noir Docs](https://noir-lang.org/docs/)
- [Awesome Aztec](https://github.com/AztecProtocol/awesome-aztec)
- [Aztec Devrel Resources](https://github.com/AztecProtocol/dev-rel)
- [Aztec Packages](https://github.com/AztecProtocol/aztec-packages)
- [Aztec Standards by DeFi Wonderland](https://github.com/defi-wonderland/aztec-standards)

### Courses & Examples

- [ZKCamp's Aztec Noir Course](https://github.com/ZKCamp/aztec-noir-course)
- [Noir Examples](https://github.com/noir-lang/noir-examples)

### Articles & Blogs

- [Aztec Network: Zero to One!](https://blog.onlydust.com/aztec-network-zero-to-one/)
- [Aztec's Transaction](https://aztec.network/blog/aztecs-transaction-anatomy)
- [Aztec's Transaction Lifecycle Flow Chart](https://blog.onlydust.com/content/images/size/w1600/2024/04/sandbox_sending_a_tx.png)

### NFT Resources

- [NFT Contract Example](https://docs.aztec.network/developers/tutorials/codealong/contract_tutorials/nft_contract)
- [Outdated - Experimental Private and Non Private NFT Standards](https://github.com/resurgencelabs/nft_standards)
