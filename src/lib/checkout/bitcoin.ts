// Pure Bitcoin helpers shared by the server and the payment window (no I/O here).

export const SATS_PER_BTC = 100_000_000;

export type BtcNetwork = "mainnet" | "testnet4";

const BECH32 = "[02-9ac-hj-np-z]";
const BASE58 = "[1-9A-HJ-NP-Za-km-z]";
const patterns: Record<BtcNetwork, RegExp> = {
  mainnet: new RegExp(`^(bc1${BECH32}{11,71}|[13]${BASE58}{25,34})$`),
  testnet4: new RegExp(`^(tb1${BECH32}{11,71}|[mn2]${BASE58}{25,34})$`),
};

/** Format check only — catches typos and wrong-network addresses before customers see them. */
export function isValidBtcAddress(address: string, network: BtcNetwork) {
  return patterns[network].test(address.trim());
}

/** Satoshis needed to cover a USD amount at a given BTC/USD rate, rounded up. */
export function usdToSats(usdCents: number, rateUsd: number) {
  if (!(rateUsd > 0)) throw new Error("Invalid BTC/USD rate");
  // cents × 10^6 / rate = USD / rate × 10^8; trimming float noise first keeps exact results exact.
  return Math.ceil(Number(((usdCents * 1_000_000) / rateUsd).toFixed(6)));
}

export function formatBtc(sats: number) {
  return (sats / SATS_PER_BTC).toFixed(8);
}

/** BIP21 payment URI, so wallets that scan the QR code fill in the address and amount. */
export function bip21(address: string, sats: number) {
  return `bitcoin:${address}?amount=${formatBtc(sats)}`;
}

export function explorerTxUrl(txid: string, network: BtcNetwork) {
  return `https://mempool.space/${network === "testnet4" ? "testnet4/" : ""}tx/${txid}`;
}
