import "server-only";
import { db } from "@/lib/db";
import { isLocalUrl, siteConfig } from "@/lib/site";
import type { BtcNetwork } from "@/lib/checkout/bitcoin";
import type { ChainTx } from "@/lib/checkout/match";

/**
 * Local payments sandbox: PAYMENTS_SANDBOX="true" replaces live price and blockchain
 * lookups with a fixed rate and a fake chain stored in the database. Like the email
 * verification switch, it only works when the site runs on localhost.
 */
export const paymentsSandbox =
  process.env.PAYMENTS_SANDBOX === "true" &&
  isLocalUrl(process.env.BETTER_AUTH_URL ?? siteConfig.url);

const SANDBOX_RATE = 65000;
const TIMEOUT_MS = 10000;

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!res.ok)
    throw new Error(`${new URL(url).hostname} responded ${res.status}`);
  return res.json();
}

export type PriceProvider = "coinbase" | "kraken" | "coingecko";

const priceSources: Record<PriceProvider, () => Promise<number>> = {
  coinbase: async () =>
    Number(
      (
        (await getJson("https://api.coinbase.com/v2/prices/BTC-USD/spot")) as {
          data: { amount: string };
        }
      ).data.amount,
    ),
  kraken: async () =>
    Number(
      Object.values(
        (
          (await getJson(
            "https://api.kraken.com/0/public/Ticker?pair=XBTUSD",
          )) as { result: Record<string, { c: [string] }> }
        ).result,
      )[0].c[0],
    ),
  coingecko: async () =>
    Number(
      (
        (await getJson(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        )) as { bitcoin: { usd: number } }
      ).bitcoin.usd,
    ),
};

/** Current BTC/USD spot price from the preferred provider, falling back to the others. */
export async function fetchBtcUsd(
  preferred: PriceProvider,
): Promise<{ rate: number; source: string }> {
  if (paymentsSandbox) return { rate: SANDBOX_RATE, source: "sandbox" };
  const order = [
    preferred,
    ...(Object.keys(priceSources) as PriceProvider[]).filter(
      (p) => p !== preferred,
    ),
  ];
  const errors: string[] = [];
  for (const source of order) {
    try {
      const rate = await priceSources[source]();
      // Reject obviously broken responses rather than quoting a wrong amount.
      if (Number.isFinite(rate) && rate > 1000 && rate < 10_000_000)
        return { rate: Math.round(rate * 100) / 100, source };
      errors.push(`${source}: implausible rate ${rate}`);
    } catch (e) {
      errors.push(`${source}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }
  throw new Error(`No BTC price available (${errors.join("; ")})`);
}

type EsploraTx = {
  txid: string;
  status: { confirmed: boolean; block_height?: number; block_time?: number };
  vout: { scriptpubkey_address?: string; value: number }[];
};

const explorers: Record<BtcNetwork, string[]> = {
  mainnet: ["https://mempool.space/api", "https://blockstream.info/api"],
  testnet4: ["https://mempool.space/testnet4/api"],
};

/** Recent transactions paying `address`, with the amount it received in each. */
export async function addressTransactions(
  address: string,
  network: BtcNetwork,
): Promise<ChainTx[]> {
  if (paymentsSandbox) {
    const rows = await db.sandboxTransaction.findMany({ where: { address } });
    return rows.map((r) => ({
      txid: r.txid,
      valueSats: r.valueSats,
      confirmations: r.confirmations,
      blockTime:
        r.confirmations > 0 ? Math.floor(r.createdAt.getTime() / 1000) : null,
    }));
  }
  const errors: string[] = [];
  for (const base of explorers[network]) {
    try {
      const [txs, tip] = await Promise.all([
        getJson(`${base}/address/${address}/txs`) as Promise<EsploraTx[]>,
        getJson(`${base}/blocks/tip/height`),
      ]);
      return txs
        .map((tx) => ({
          txid: tx.txid,
          valueSats: tx.vout
            .filter((o) => o.scriptpubkey_address === address)
            .reduce((sum, o) => sum + o.value, 0),
          confirmations:
            tx.status.confirmed && tx.status.block_height
              ? Number(tip) - tx.status.block_height + 1
              : 0,
          blockTime: tx.status.confirmed
            ? (tx.status.block_time ?? null)
            : null,
        }))
        .filter((t) => t.valueSats > 0);
    } catch (e) {
      errors.push(`${base}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }
  throw new Error(`Blockchain lookup failed (${errors.join("; ")})`);
}
