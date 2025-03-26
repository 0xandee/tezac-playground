<p align="center">
 <img width="240" alt="twitter-avatar" src="https://github.com/user-attachments/assets/bccdb666-d196-4848-90af-d7f72b589d2f" />
</p>

<h1 align="center">Tezac NFT Interactive App</h1>

<p align="center">
  <strong>A privacy-preserving NFT trading protocol built on the Aztec Network, featuring encrypted ownership, private cross-chain trading, and seamless integration with established L1/L2 collections.</strong>
</p>

---

## Overview

Tezac revolutionizes NFT trading by leveraging Aztec's zkRollup architecture to encrypt ownership data and transaction details. This privacy-focused approach ensures complete confidentiality for trading, auctions, and gaming applications. By bridging established NFT collections from Layer 1 blockchains (e.g., Ethereum) to our protocol, Tezac uniquely combines the liquidity of major ecosystems with the privacy benefits of zero-knowledge proofs.

## Core Features

### 1. Private NFT Ownership and Trading

- **Encrypted Ownership Records**: All ownership data is fully encrypted on-chain
- **Private Note Transactions**: Trading occurs through encrypted private notes
- **Identity Protection**: User identities remain completely obscured during transactions
- **Metadata Privacy**: Optional encrypted metadata for complete NFT information privacy

### 2. Hidden Reserve Prices and Blind Auctions

- **Confidential Reserve Pricing**: Sellers can set reserve prices invisible to buyers
- **Sealed-Bid Mechanisms**: Participants submit encrypted bids visible only at settlement
- **Private Auction Results**: Only winning bids are revealed, preserving privacy for all participants
- **Fair Settlement Guarantees**: Zero-knowledge proofs ensure auction integrity

### 3. Cross-Chain NFT Trading

- **Seamless L1 Integration**: Bridge system connects with Ethereum, Polygon, and other major NFT ecosystems
- **Wrapped NFT Mechanism**: Original NFTs are securely wrapped for privacy-preserving transactions
- **Cross-Chain Settlement**: Complete trades across different blockchains without sacrificing privacy
- **Flexible Unwrapping**: Return NFTs to original chains when desired

### 4. Provably Fair NFT Games

- **Verifiable Randomness**: Cryptographically secure randomness for fair outcomes
- **Private Participation**: Join raffles and lotteries without revealing identity
- **Transparent Results**: Outcomes verifiable through zero-knowledge proofs
- **Mystery Box Mechanics**: Implement truly surprising reveals with privacy guarantees

### 5. Front-Running Resistance

- **Time-locked Submissions**: Prevent miners from exploiting pending transactions
- **Encrypted Orders**: Transaction details remain hidden until settlement
- **MEV Protection**: Built-in mechanics to prevent maximal extractable value exploitation
- **Fair Market Access**: Equal opportunity for all participants regardless of network advantages

## Technical Architecture

Tezac builds on Aztec Network's privacy infrastructure with several key components:

- **Smart Contract Layer**: Privacy-preserving Noir contracts handling ownership and transactions
- **Bridge System**: Cross-chain communication protocol for L1/L2 NFT integration
- **Frontend Application**: User-friendly interface with complete wallet integration
- **Privacy Middleware**: Handles encryption, proof generation, and verification

## Roadmap

| Phase | Focus                         | Status  |
| ----- | ----------------------------- | ------- |
| 1     | Create Private NFT Contracts  | WIP     |
| 2     | Private Listings & Purchasing | WIP     |
| 3     | Cross-Chain Bridge            | Roadmap |
| 4     | Cross-Chain Trading           | Roadmap |
| 5     | Auction Mechanisms            | Roadmap |

## Development Environment

### Prerequisites

- **Docker**: For containerized deployment and testing
- **Node.js**: >= v18.xx.x and <= v20.17.x (lts/iron)
- **Yarn**: 4.5.2 for dependency management
- **Aztec Sandbox**: 0.81.0 for local development
- **Nargo**: 1.0.0-beta.3 for Noir contract compilation
- **Noirc**: 1.0.0-beta.3 for zero-knowledge circuit development

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/tezac.git
   cd tezac
   ```

2. **Install dependencies**

   ```bash
   yarn
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Prepare contract artifacts**

   ```bash
   yarn prep
   ```

5. **Start development server**
   ```bash
   yarn dev
   ```

### Project Structure

```
tezac/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── contracts/      # Smart contract source code
│   ├── hooks/          # Custom React hooks
│   ├── styles.css      # Global styles
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
├── artifacts/          # Compiled contract artifacts
├── tests/              # Test suite
├── docs/               # Documentation
└── public/             # Static assets
```

## Development Workflow

### Frontend Development

The React frontend uses TypeScript for type safety and implements form-based interactions for each NFT operation:

1. **Local Testing**

   ```bash
   yarn dev
   ```

2. **Building for Production**

   ```bash
   yarn build
   ```

3. **Running Tests**
   ```bash
   yarn test:browser
   ```

### Contract Development

Our Noir contracts implement privacy-preserving logic for NFT operations:

1. **Compiling Contracts**

   ```bash
   yarn compile
   ```

2. **Generating TypeScript Bindings**

   ```bash
   yarn codegen
   ```

3. **Testing Contracts**
   ```bash
   yarn test:node
   ```

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Ensure code quality**
   ```bash
   yarn formatting:fix
   yarn test
   ```
5. **Submit a pull request**

### Contribution Guidelines

- **Code Style**: Follow the project's formatting guidelines
- **Commit Messages**: Use clear, descriptive commit messages
- **Documentation**: Update relevant documentation for your changes
- **Tests**: Add tests for new features or bug fixes

## Community and Support

- **Telegram**: Join our community [here](https://t.me/+WI9728WPBOE0N2M1)
- **Discord**: Coming soon!
- **Issues**: Report bugs or request features through [GitHub Issues](../../issues)
- **Twitter**: Follow us for updates [@Tezac_xyz](https://twitter.com/Tezac_xyz)

## Resources

### Aztec Protocol Resources

- [Aztec Documentation](https://docs.aztec.network/)
- [Noir Programming Language](https://noir-lang.org/docs/)
- [Awesome Aztec](https://github.com/AztecProtocol/awesome-aztec)
- [Aztec Developer Resources](https://github.com/AztecProtocol/dev-rel)
- [Aztec Packages](https://github.com/AztecProtocol/aztec-packages)
- [Aztec Standards by DeFi Wonderland](https://github.com/defi-wonderland/aztec-standards)

### Educational Materials

- [ZKCamp's Aztec Noir Course](https://github.com/ZKCamp/aztec-noir-course)
- [Noir Examples](https://github.com/noir-lang/noir-examples)
- [Introduction to Zero-Knowledge Proofs](https://aztec.network/blog/intro-to-zero-knowledge-proofs)

### Technical Articles

- [Aztec Network: Zero to One!](https://blog.onlydust.com/aztec-network-zero-to-one/)
- [Understanding Aztec's Transaction Anatomy](https://aztec.network/blog/aztecs-transaction-anatomy)
- [Transaction Lifecycle Flow Chart](https://blog.onlydust.com/content/images/size/w1600/2024/04/sandbox_sending_a_tx.png)
- [Privacy-Preserving NFTs: Technical Challenges](https://docs.aztec.network/developers/tutorials/codealong/contract_tutorials/nft_contract)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
