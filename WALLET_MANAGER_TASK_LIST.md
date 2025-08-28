# 🔐 PRONOVA PROJECT - WALLET MANAGER TASK LIST
**Role: Wallet Manager**  
**Document Version: 1.0**  
**Created: December 2024**  
**Classification: CONFIDENTIAL**

---

## 📋 EXECUTIVE SUMMARY

As the Wallet Manager for the PRONOVA project, you are responsible for creating, securing, and managing all cryptocurrency wallets required for the smart contract deployment and ongoing operations. This document outlines your complete responsibilities and deliverables.

**Critical Timeline:**
- Testnet Wallets: Required by [DATE - 3 days before testnet deployment]
- Mainnet Wallets: Required by [DATE - 5 days before mainnet deployment]
- All security measures must be in place before generating mainnet wallets

---

## 1️⃣ WALLET REQUIREMENTS OVERVIEW

### Total Wallets Required: 7

| # | Wallet Name | Type | Purpose | Multi-sig Required |
|---|-------------|------|---------|-------------------|
| 1 | **DEPLOYER** | Hot Wallet | Deploy smart contracts (temporary use) | No |
| 2 | **OWNER** | Cold Wallet | Ultimate contract control & emergency functions | Yes (3/5) |
| 3 | **TREASURY** | Cold Wallet | Receive & store presale funds | Yes (3/5) |
| 4 | **TEAM** | Cold Wallet | Hold 15% token allocation (150M PRN) | Yes (2/3) |
| 5 | **LIQUIDITY** | Warm Wallet | Hold 20% for DEX liquidity (200M PRN) | No |
| 6 | **MARKETING** | Warm Wallet | Hold 10% for marketing (100M PRN) | No |
| 7 | **STAKING** | Cold Wallet | Hold 15% for staking rewards (150M PRN) | Yes (2/3) |

### Wallet Type Definitions:
- **Hot Wallet**: Online, used for immediate transactions
- **Warm Wallet**: Hardware wallet with periodic access
- **Cold Wallet**: Hardware wallet or paper wallet, offline storage

---

## 2️⃣ DETAILED WALLET SPECIFICATIONS

### 🔸 WALLET #1: DEPLOYER
**Purpose:** Temporary wallet for deploying smart contracts  
**Security Level:** Medium  
**Type:** Hot Wallet (MetaMask acceptable)  

**Requirements:**
- [ ] Generate new wallet (never used before)
- [ ] Store private key in encrypted password manager
- [ ] Fund with 0.5 ETH (mainnet) or 0.1 ETH (testnet)
- [ ] Will be retired after deployment

**Generate:**
- Private Key: YES
- Mnemonic Phrase: YES (12 words)
- Address: YES

---

### 🔸 WALLET #2: OWNER (MULTI-SIG)
**Purpose:** Ultimate control of all smart contracts  
**Security Level:** MAXIMUM  
**Type:** Gnosis Safe Multi-sig (3 of 5 signers required)  

**Requirements:**
- [ ] Create Gnosis Safe at https://gnosis-safe.io
- [ ] Configure 3/5 multi-signature requirement
- [ ] Use hardware wallets for at least 3 signers
- [ ] Document all 5 signer addresses
- [ ] Test transaction signing process

**Signers Required:**
1. CEO/Founder (Hardware Wallet)
2. CTO/Tech Lead (Hardware Wallet)
3. CFO/Finance Lead (Hardware Wallet)
4. Legal Advisor (Hardware or Cold Wallet)
5. Independent Board Member (Hardware or Cold Wallet)

**Generate:**
- Multi-sig Contract Address: YES
- Individual Signer Addresses: YES (5 addresses)
- Safe Setup Transaction Hash: YES

---

### 🔸 WALLET #3: TREASURY (MULTI-SIG)
**Purpose:** Receive and manage presale funds  
**Security Level:** MAXIMUM  
**Type:** Gnosis Safe Multi-sig (3 of 5 signers required)  

**Requirements:**
- [ ] Create separate Gnosis Safe from OWNER
- [ ] Configure 3/5 multi-signature requirement
- [ ] Different signers from OWNER wallet (at least 2 different)
- [ ] Enable spending limits if needed
- [ ] Add transaction policies

**Treasury Signers Required:**
1. CFO/Finance Lead (Hardware Wallet)
2. CEO/Founder (Hardware Wallet)
3. Operations Manager (Hardware Wallet)
4. External Accountant (Hardware Wallet)
5. Legal Advisor (Hardware Wallet)

**Generate:**
- Multi-sig Contract Address: YES
- Individual Signer Addresses: YES (5 addresses)
- Safe Setup Transaction Hash: YES

---

### 🔸 WALLET #4: TEAM (MULTI-SIG)
**Purpose:** Hold team token allocation (150M PRN, vested)  
**Security Level:** HIGH  
**Type:** Gnosis Safe Multi-sig (2 of 3 signers required)  

**Requirements:**
- [ ] Create Gnosis Safe with 2/3 requirement
- [ ] Subject to 5-year vesting schedule
- [ ] Configure time-lock if possible

**Team Signers Required:**
1. CEO/Founder
2. CTO/Tech Lead
3. HR/Operations Lead

**Generate:**
- Multi-sig Contract Address: YES
- Individual Signer Addresses: YES (3 addresses)

---

### 🔸 WALLET #5: LIQUIDITY
**Purpose:** Hold tokens for DEX liquidity provision  
**Security Level:** HIGH  
**Type:** Hardware Wallet (Single Signature)  

**Requirements:**
- [ ] Use Ledger or Trezor hardware wallet
- [ ] Never expose to internet before mainnet
- [ ] Backup seed phrase in bank vault
- [ ] Test recovery process

**Generate:**
- Address: YES
- Private Key: NO (keep on hardware wallet)
- Seed Phrase: YES (24 words, store offline)

---

### 🔸 WALLET #6: MARKETING
**Purpose:** Hold tokens for marketing activities  
**Security Level:** MEDIUM-HIGH  
**Type:** Hardware Wallet (Single Signature)  

**Requirements:**
- [ ] Use Ledger or Trezor hardware wallet
- [ ] Controlled by Marketing Department
- [ ] Monthly access allowed
- [ ] Transaction logs required

**Generate:**
- Address: YES
- Private Key: NO (keep on hardware wallet)
- Seed Phrase: YES (24 words, store offline)

---

### 🔸 WALLET #7: STAKING (MULTI-SIG)
**Purpose:** Hold tokens for staking rewards distribution  
**Security Level:** HIGH  
**Type:** Gnosis Safe Multi-sig (2 of 3 signers required)  

**Requirements:**
- [ ] Create Gnosis Safe with 2/3 requirement
- [ ] Will be managed by staking contract later
- [ ] Time-locked distributions

**Staking Signers Required:**
1. CTO/Tech Lead
2. Operations Manager
3. Community Manager

**Generate:**
- Multi-sig Contract Address: YES
- Individual Signer Addresses: YES (3 addresses)

---

## 3️⃣ SECURITY REQUIREMENTS & PROCEDURES

### A. Hardware Wallet Setup
```
REQUIRED HARDWARE WALLETS: Minimum 5 devices
- 3x Ledger Nano X or S Plus
- 2x Trezor Model T or One
```

**Setup Procedure:**
1. [ ] Purchase hardware wallets from official sources only
2. [ ] Verify authenticity with manufacturer
3. [ ] Initialize in secure, offline environment
4. [ ] Generate seed phrases
5. [ ] Never photograph or digitally store seed phrases
6. [ ] Test recovery process before funding

### B. Seed Phrase Storage

**Primary Storage (Bank Vault):**
- [ ] Use fireproof, waterproof seed phrase storage (e.g., Cryptosteel)
- [ ] Store in bank safety deposit box
- [ ] Document vault location (separate from seeds)

**Backup Storage:**
- [ ] Create encrypted paper backup
- [ ] Store with trusted legal counsel
- [ ] Use Shamir Secret Sharing for critical wallets

### C. Multi-Signature Setup

**Gnosis Safe Configuration:**
```
1. Go to https://gnosis-safe.io/app
2. Connect wallet (use hardware wallet)
3. Click "Create New Safe"
4. Select network (Ethereum/BSC)
5. Name the safe (e.g., "PRONOVA Treasury")
6. Add owner addresses
7. Set threshold (3/5 or 2/3)
8. Review and deploy
9. Save the Safe address
```

### D. Access Control Policy

**Level 1 - Maximum Security (OWNER, TREASURY):**
- Physical access to hardware wallets restricted
- Require 2-person authorization for access
- Video recording of all access events
- 48-hour notice before access

**Level 2 - High Security (TEAM, STAKING):**
- Hardware wallet in company safe
- CEO/CTO authorization required
- 24-hour notice before access

**Level 3 - Medium Security (LIQUIDITY, MARKETING):**
- Hardware wallet with department head
- Monthly access allowed
- Transaction logs required

---

## 4️⃣ INFORMATION SHARING PROTOCOL

### What to Share with Development Team

**Create file: `wallet-addresses.json`**
```json
{
  "network": "mainnet",
  "generated_date": "2024-12-XX",
  "generated_by": "Wallet Manager Name",
  "wallets": {
    "DEPLOYER": "0x...",
    "OWNER": "0x... (Gnosis Safe)",
    "TREASURY": "0x... (Gnosis Safe)",
    "TEAM": "0x... (Gnosis Safe)",
    "LIQUIDITY": "0x...",
    "MARKETING": "0x...",
    "STAKING": "0x... (Gnosis Safe)"
  },
  "multisig_details": {
    "OWNER": {
      "safe_address": "0x...",
      "threshold": "3 of 5",
      "chain_id": 1
    },
    "TREASURY": {
      "safe_address": "0x...",
      "threshold": "3 of 5",
      "chain_id": 1
    },
    "TEAM": {
      "safe_address": "0x...",
      "threshold": "2 of 3",
      "chain_id": 1
    },
    "STAKING": {
      "safe_address": "0x...",
      "threshold": "2 of 3",
      "chain_id": 1
    }
  }
}
```

### What NEVER to Share
- ❌ Private keys
- ❌ Seed phrases
- ❌ Hardware wallet PINs
- ❌ Individual signer private keys
- ❌ Password manager master password

### Secure Delivery Method
1. [ ] Encrypt `wallet-addresses.json` with GPG
2. [ ] Share via secure channel (Signal/Telegram secret chat)
3. [ ] Verify receipt with SHA-256 hash
4. [ ] Confirm addresses verbally in secure call

---

## 5️⃣ DELIVERABLES FOR DEPLOYMENT TEAM

### A. For Testnet Deployment

**File: `testnet-wallets.env`**
```env
# Testnet Wallet Addresses Only
# Generated: [DATE]
# Network: Sepolia / BSC Testnet

DEPLOYER_ADDRESS=0x...
OWNER_ADDRESS=0x...
TREASURY_ADDRESS=0x...
TEAM_WALLET_ADDRESS=0x...
LIQUIDITY_WALLET_ADDRESS=0x...
MARKETING_WALLET_ADDRESS=0x...
STAKING_ADDRESS=0x...

# Deployer private key ONLY for testnet
# This will be provided separately via secure channel
TESTNET_DEPLOYER_PRIVATE_KEY=[TO BE PROVIDED SEPARATELY]
```

### B. For Mainnet Deployment

**File: `mainnet-wallets.env`**
```env
# Mainnet Wallet Addresses Only
# Generated: [DATE]
# Network: Ethereum Mainnet / BSC Mainnet

DEPLOYER_ADDRESS=0x...
OWNER_ADDRESS=0x... # Gnosis Safe 3/5
TREASURY_ADDRESS=0x... # Gnosis Safe 3/5
TEAM_WALLET_ADDRESS=0x... # Gnosis Safe 2/3
LIQUIDITY_WALLET_ADDRESS=0x...
MARKETING_WALLET_ADDRESS=0x...
STAKING_ADDRESS=0x... # Gnosis Safe 2/3

# CRITICAL: Mainnet deployer private key
# Will be provided ONLY at deployment time
# Via encrypted message with one-time access
```

### C. Verification Document

**File: `wallet-verification.md`**
```markdown
# Wallet Verification Checklist

## Addresses Verified On Etherscan/BscScan
- [ ] All addresses are valid format
- [ ] No addresses have existing transactions
- [ ] Multi-sig contracts deployed successfully
- [ ] Multi-sig thresholds verified

## Funding Status
- [ ] Testnet wallets funded with test ETH/BNB
- [ ] Mainnet deployer has 0.5+ ETH
- [ ] Treasury multi-sig ready to receive funds

## Security Verification
- [ ] All hardware wallets tested
- [ ] Multi-sig signing tested
- [ ] Backup procedures documented
- [ ] Recovery process tested

Verified by: [Name]
Date: [DATE]
Signature: [Digital signature]
```

---

## 6️⃣ OPERATIONAL TASKS CHECKLIST

### Phase 1: Preparation (Day -7 to -5)
- [ ] Order hardware wallets from official sources
- [ ] Set up secure environment (air-gapped computer)
- [ ] Prepare secure storage locations
- [ ] Brief all multi-sig signers on responsibilities

### Phase 2: Testnet Wallets (Day -4 to -3)
- [ ] Generate testnet deployer wallet
- [ ] Create testnet multi-sig wallets
- [ ] Fund testnet wallets using faucets:
  - Sepolia ETH: https://sepoliafaucet.com
  - BSC Testnet: https://testnet.binance.org/faucet-smart
- [ ] Share testnet addresses with dev team
- [ ] Document testnet wallet details

### Phase 3: Mainnet Wallets (Day -2 to -1)
- [ ] Generate ALL mainnet wallets
- [ ] Initialize hardware wallets
- [ ] Deploy Gnosis Safe contracts
- [ ] Test multi-sig functionality
- [ ] Secure all seed phrases
- [ ] Create wallet-addresses.json
- [ ] Verify all addresses

### Phase 4: Pre-Deployment (Day 0)
- [ ] Fund mainnet deployer with 0.5 ETH
- [ ] Verify all multi-sig contracts active
- [ ] Final security check
- [ ] Provide deployer private key (secure channel)
- [ ] Stand by for deployment support

### Phase 5: Post-Deployment (Day +1)
- [ ] Verify contract ownership transferred
- [ ] Confirm treasury receiving funds
- [ ] Retire deployer wallet
- [ ] Secure all documentation
- [ ] Complete audit trail

---

## 7️⃣ FUNDING REQUIREMENTS

### Testnet Funding
| Wallet | Amount Needed | Faucet Links |
|--------|--------------|--------------|
| Deployer | 0.5 SepoliaETH | https://sepoliafaucet.com |
| All Others | 0.1 SepoliaETH each | https://sepoliafaucet.com |

### Mainnet Funding (Pre-Deployment)
| Wallet | ETH Required | When Needed |
|--------|-------------|-------------|
| Deployer | 0.5 ETH | 24 hours before deployment |
| OWNER (Gnosis) | 0.05 ETH | Before deployment |
| TREASURY (Gnosis) | 0.05 ETH | Before deployment |
| Others | 0.01 ETH | Post-deployment |

**Total ETH Required: ~0.65 ETH**

---

## 8️⃣ EMERGENCY PROCEDURES

### Lost Hardware Wallet
1. Immediately notify project lead
2. Use seed phrase to recover on new device
3. Consider migrating to new wallet
4. Document incident

### Compromised Wallet Suspected
1. **IMMEDIATE**: Notify all team members
2. Execute emergency pause on smart contracts
3. If multi-sig: Remove compromised signer
4. If single-sig: Transfer funds to backup wallet
5. Conduct security audit

### Multi-sig Signer Unavailable
1. Verify remaining signers meet threshold
2. If below threshold, use emergency recovery
3. Add replacement signer ASAP
4. Update documentation

---

## 9️⃣ COMMUNICATION PROTOCOLS

### Secure Communication Channels

**Primary Channel:** Signal (End-to-end encrypted)
- Group: "PRONOVA Wallet Security"
- Members: Wallet Manager, CTO, CEO

**Backup Channel:** Telegram Secret Chat
- One-on-one chats only
- Auto-delete after 24 hours

**Emergency Channel:** Phone Call
- Pre-verified phone numbers only
- Code phrase required: "[TO BE SET]"

### Information Classification

**TOP SECRET** (Never digital):
- Private keys
- Seed phrases
- Hardware wallet PINs

**CONFIDENTIAL** (Encrypted only):
- Wallet addresses (before public)
- Multi-sig configurations
- Deployment timeline

**INTERNAL** (Team channels):
- Public wallet addresses
- Transaction hashes
- General updates

---

## 🔟 SIGN-OFF REQUIREMENTS

### Wallet Manager Attestation

I, _________________________ [Wallet Manager Name], hereby confirm that:

1. ✅ All wallets have been generated according to specifications
2. ✅ Security procedures have been followed completely
3. ✅ Seed phrases are secured in approved locations
4. ✅ Multi-signature wallets are properly configured
5. ✅ No private keys have been digitally transmitted
6. ✅ All hardware wallets are genuine and tested
7. ✅ Backup and recovery procedures are in place
8. ✅ Team members have been briefed on security protocols

**Signature:** _________________________  
**Date:** _________________________  
**Witness (CEO/CTO):** _________________________

---

## 📎 APPENDICES

### Appendix A: Hardware Wallet Suppliers
- **Ledger Official:** https://www.ledger.com
- **Trezor Official:** https://trezor.io
- **NEVER buy from:** Amazon, eBay, third-party sellers

### Appendix B: Multi-sig Resources
- **Gnosis Safe:** https://gnosis-safe.io
- **Documentation:** https://docs.gnosis.io/safe
- **Support:** https://discord.gg/gnosis

### Appendix C: Security Tools
- **Seed Storage:** Cryptosteel, Billfodl
- **Password Manager:** Bitwarden, 1Password (Team)
- **Encryption:** GPG, VeraCrypt
- **2FA:** Yubikey, Google Authenticator

### Appendix D: Audit Trail Template
```
Date: [DATE]
Action: [Wallet created/accessed/modified]
Wallet: [Which wallet]
Performed by: [Name]
Witnessed by: [Name]
Purpose: [Reason]
Next action: [What happens next]
```

---

## ⚠️ FINAL CRITICAL REMINDERS

1. **NEVER** share private keys via email, Slack, Discord, or any digital medium
2. **ALWAYS** use hardware wallets for mainnet
3. **TEST** everything on testnet first
4. **DOCUMENT** every action taken
5. **VERIFY** addresses multiple times before deployment
6. **SECURE** physical access to hardware wallets
7. **BACKUP** everything with proper encryption
8. **ASSUME** you're being watched by hackers
9. **QUESTION** any unusual requests
10. **PROTECT** the project and investors' funds

---

**Document Classification:** CONFIDENTIAL  
**Distribution:** Wallet Manager, CEO, CTO Only  
**Retention Period:** 7 years  
**Destruction Method:** Secure shredding or burning

---

END OF DOCUMENT

**For questions or clarifications, contact:**
- Project Lead: [Contact]
- Security Officer: [Contact]
- Emergency Hotline: [Number]