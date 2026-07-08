/*
 * testnet-presale.js — Pronova BSC Testnet presale helper (chainId 97).
 *
 *   Presale : 0x1AE86fB64059723a9e8c3C975D3095Aa5dca05Ba
 *   Network : BSC Testnet — get free tBNB at https://testnet.bnbchain.org/faucet-smart
 *
 * Usage:
 *   node testnet-presale.js status [0xADDR]      Read-only. Shows price/window/whitelist.
 *                                                Optionally checks if 0xADDR can buy.
 *   node testnet-presale.js whitelist 0xADDR ..  Admin: allow those wallet(s) to buy on
 *                                                the website (presale is whitelist-gated).
 *   node testnet-presale.js buy [bnbAmount]      Real test-buy from the admin wallet.
 *                                                Default 0.01 BNB (= $3 at the $300 test rate).
 *
 * The admin key is read from backend/contracts/.env (PRIVATE_KEY) and is NEVER printed
 * or transmitted. TESTNET ONLY.
 */
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const PRESALE = '0x1AE86fB64059723a9e8c3C975D3095Aa5dca05Ba';
const DEPLOYER = '0xdCca72A15AA9E04cF13eda5a5369E4FE9e770573'; // admin (for read-only status)
const ZERO = '0x0000000000000000000000000000000000000000';
const RPCS = [
  'https://data-seed-prebsc-1-s1.bnbchain.org:8545/',
  'https://data-seed-prebsc-2-s1.bnbchain.org:8545/',
  'https://bsc-testnet.public.blastapi.io',
];

const ABI = [
  'function paused() view returns (bool)',
  'function currentPhase() view returns (uint256)',
  'function whitelistEnabled() view returns (bool)',
  'function whitelist(address) view returns (bool)',
  'function phases(uint256) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,bool)',
  'function bnbToUsdPrice() view returns (uint256)',
  'function getUserPurchaseInfo(address) view returns (uint256,uint256,uint256,bool)',
  'function updateWhitelist(address[],bool)',
  'function buyWithBNB(address referrer, uint256 minTokensExpected, bytes32 nonce) payable',
];

const usd = (v) => '$' + (Number(v) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 });
const prn = (v) => Number(ethers.utils.formatUnits(v, 18)).toLocaleString();

function readKey() {
  const p = path.join(__dirname, 'backend', 'contracts', '.env');
  const env = fs.readFileSync(p, 'utf8');
  const m = env.match(/^\s*(?:PRIVATE_KEY|DEPLOYER_PRIVATE_KEY)\s*=\s*["']?([^"'\r\n]+)/mi);
  if (!m) throw new Error('No PRIVATE_KEY found in backend/contracts/.env');
  const k = m[1].trim();
  return k.startsWith('0x') ? k : '0x' + k;
}

async function getProvider() {
  for (const url of RPCS) {
    try {
      const p = new ethers.providers.JsonRpcProvider(url);
      const net = await p.getNetwork();
      if (Number(net.chainId) === 97) return p;
    } catch (e) { /* try next */ }
  }
  throw new Error('Could not reach any BSC Testnet RPC endpoint');
}

async function status(provider, target) {
  const c = new ethers.Contract(PRESALE, ABI, provider);
  const [paused, phaseId, wlEnabled, bnbPrice] = await Promise.all([
    c.paused(), c.currentPhase(), c.whitelistEnabled(), c.bnbToUsdPrice(),
  ]);
  const ph = await c.phases(phaseId);
  const now = Math.floor(Date.now() / 1000);
  const open = !paused && ph[7] && now >= Number(ph[5]) && now <= Number(ph[6]);
  console.log('Presale    :', PRESALE);
  console.log('Paused     :', paused);
  console.log('Phase      :', phaseId.toString());
  console.log('Price      :', usd(ph[0]), 'per PRN');
  console.log('Min / Max  :', usd(ph[3]), '/', usd(ph[4]), 'per transaction');
  console.log('Window     :', new Date(Number(ph[5]) * 1000).toISOString().slice(0, 16),
    '->', new Date(Number(ph[6]) * 1000).toISOString().slice(0, 16), 'UTC');
  console.log('Phase live :', ph[7]);
  console.log('BNB rate   :', usd(bnbPrice), '(testnet fallback; 0.01 BNB =', usd(bnbPrice.div(100)) + ')');
  console.log('Whitelist  :', wlEnabled ? 'ENABLED — buyers must be whitelisted first' : 'disabled');
  console.log('OPEN NOW   :', open ? 'YES ✅' : 'NO ❌');
  const addr = target || DEPLOYER;
  const wl = await c.whitelist(addr).catch(() => false);
  console.log('\n' + addr + (target ? '' : ' (admin)') + ' whitelisted:', wl ? 'YES ✅' : 'NO ❌');
  if (open) console.log('\n🎉 Presale is OPEN. Buy at https://pronovacrypto.com/presale (BSC Testnet).');
  return open;
}

async function whitelistAddrs(provider, wallet, addrs) {
  const list = addrs.filter((a) => /^0x[0-9a-fA-F]{40}$/.test(a));
  if (!list.length) throw new Error('Give at least one 0x wallet address to whitelist');
  const c = new ethers.Contract(PRESALE, ABI, wallet);
  console.log('Whitelisting:', list.join(', '));
  const gp = (await provider.getGasPrice()).mul(12).div(10);
  const tx = await c.updateWhitelist(list, true, { gasPrice: gp, gasLimit: 80000 + 40000 * list.length });
  console.log('Sent:', tx.hash);
  const rc = await tx.wait();
  console.log('Confirmed ✅ block', rc.blockNumber);
  for (const a of list) console.log('  ', a, '->', (await c.whitelist(a)) ? 'whitelisted ✅' : 'FAILED ❌');
  console.log('\nThose wallets can now buy at https://pronovacrypto.com/presale');
}

async function buy(provider, wallet, bnbAmountStr) {
  const c = new ethers.Contract(PRESALE, ABI, wallet);
  const value = ethers.utils.parseEther(bnbAmountStr || '0.01');
  const bnbPrice = await c.bnbToUsdPrice();
  const usdAmount = value.mul(bnbPrice).div(ethers.constants.WeiPerEther); // 6-dec USD
  console.log(`Test-buy: ${ethers.utils.formatEther(value)} BNB  (~${usd(usdAmount)} at ${usd(bnbPrice)}/BNB)`);

  const nonce32 = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  // Preflight with estimateGas (public RPCs mis-simulate value-bearing eth_call, so
  // callStatic can false-fail — estimateGas reverts only if the tx would truly revert).
  let gasEstimate;
  try {
    gasEstimate = await c.estimateGas.buyWithBNB(ZERO, 0, nonce32, { value });
  } catch (e) {
    console.log('Preflight FAILED ❌:', e.reason || (e.error && e.error.message) || e.message);
    console.log('Likely: wallet not whitelisted, window closed, or below the', usd(usdAmount), 'minimum.');
    return;
  }
  const gp = (await provider.getGasPrice()).mul(12).div(10);
  const tx = await c.buyWithBNB(ZERO, 0, nonce32, { value, gasPrice: gp, gasLimit: gasEstimate.mul(120).div(100) });
  console.log('Sent:', tx.hash);
  const rc = await tx.wait();
  console.log('Confirmed ✅ block', rc.blockNumber, '| gasUsed', rc.gasUsed.toString());
  const info = await c.getUserPurchaseInfo(wallet.address);
  console.log('Your PRN allocation:', prn(info[0]), 'PRN  | total paid:', usd(info[1]));
  console.log('Explorer: https://testnet.bscscan.com/tx/' + tx.hash);
}

(async () => {
  const [cmd, ...rest] = process.argv.slice(2);
  const provider = await getProvider();

  if (cmd === 'status' || !cmd) {
    await status(provider, rest[0]);
    return;
  }
  const wallet = new ethers.Wallet(readKey(), provider);
  const bal = await provider.getBalance(wallet.address);
  console.log('Admin :', wallet.address, '|', ethers.utils.formatEther(bal), 'tBNB\n');
  if (cmd === 'whitelist') return whitelistAddrs(provider, wallet, rest);
  if (cmd === 'buy') return buy(provider, wallet, rest[0]);
  console.log('Usage: node testnet-presale.js status [0xADDR] | whitelist 0xADDR ... | buy [bnbAmount]');
})().catch((e) => { console.error('ERROR:', e.reason || e.message); process.exit(1); });
