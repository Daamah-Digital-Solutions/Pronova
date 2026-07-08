import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCopy, FaCheck, FaExternalLinkAlt, FaNetworkWired, FaFileCode } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { CONTRACTS } from '../../config/contracts';

/**
 * On-chain transparency section (client request C3).
 * Shows Network, contract addresses, BSCScan verification links, and ABI access.
 *
 * Addresses + network are read from the single source of truth in
 * src/config/contracts.js (the same map the buy flow uses via getContractAddress),
 * so the displayed addresses always match the contracts users actually transact
 * with. Chain is selected by REACT_APP_CHAIN_ID (defaults to 97 / BSC Testnet).
 */
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || '97', 10);
const IS_MAINNET = CHAIN_ID === 56;
const NETWORK = IS_MAINNET ? CONTRACTS.NETWORKS.BSC : CONTRACTS.NETWORKS.BSC_TESTNET;
const ADDRESSES = IS_MAINNET ? CONTRACTS.ADDRESSES.BSC : CONTRACTS.ADDRESSES.BSC_TESTNET;

const CONTRACT_LIST = [
  { label: 'PRN Token', address: ADDRESSES.PRONOVA_TOKEN },
  { label: 'Presale', address: ADDRESSES.PRONOVA_PRESALE },
  { label: 'Vesting', address: ADDRESSES.PRONOVA_VESTING },
];

const isRealAddress = (addr) => typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr);

const SmartContractSection = () => {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(null);

  const copy = (address) => {
    try {
      navigator.clipboard.writeText(address);
      setCopied(address);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {
      /* clipboard unavailable */
    }
  };

  const explorer = NETWORK.explorerUrl;

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
            <FaShieldAlt /> On-Chain Transparency
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Verify the <span className="gradient-text">Smart Contracts</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Pronova is fully verifiable on-chain. Confirm the network, contract addresses, and the verified
            source code &amp; ABI directly on the block explorer — never trust, always verify.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Network banner */}
          <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 mb-6 border ${
            darkMode ? 'bg-dark-900/60 border-primary-600/20' : 'bg-white border-gray-200'
          }`}>
            <FaNetworkWired className="text-primary-500" size={20} />
            <span className="text-gray-500 dark:text-gray-400">Network:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              BNB Smart Chain (BSC) — {NETWORK.name} · Chain ID {NETWORK.chainId}
            </span>
          </div>

          {/* Contract cards */}
          <div className="space-y-4">
            {CONTRACT_LIST.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`rounded-2xl p-5 border ${
                  darkMode ? 'bg-dark-900/60 border-primary-600/20' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{c.label} Contract</div>
                    {isRealAddress(c.address) ? (
                      <code className="block text-sm md:text-base font-mono text-gray-900 dark:text-white break-all">
                        {c.address}
                      </code>
                    ) : (
                      <span className="text-sm italic text-amber-500">Address will be published at mainnet launch</span>
                    )}
                  </div>
                  {isRealAddress(c.address) && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copy(c.address)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                        title="Copy address"
                      >
                        {copied === c.address ? <FaCheck className="text-green-500" /> : <FaCopy />}
                        {copied === c.address ? 'Copied' : 'Copy'}
                      </button>
                      <a
                        href={`${explorer}/address/${c.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                      >
                        Verify <FaExternalLinkAlt size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ABI + how to verify */}
          <div className={`mt-6 rounded-2xl p-6 border ${
            darkMode ? 'bg-dark-900/60 border-primary-600/20' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <FaFileCode className="text-primary-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">
                  ABI &amp; Verified Source Code
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  The contract ABI and full verified source code are published on the block explorer. Open any
                  contract above, go to the <strong>“Contract”</strong> tab, and you’ll find the verified code and
                  the ABI ready to copy or download. This lets anyone independently confirm exactly how Pronova
                  works on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartContractSection;
