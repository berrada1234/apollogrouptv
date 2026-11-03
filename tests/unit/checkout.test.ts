import { describe, expect, it } from "vitest";
import {
  bip21,
  formatBtc,
  isValidBtcAddress,
  usdToSats,
} from "@/lib/checkout/bitcoin";
import {
  matchTransactions,
  outcomeFor,
  type ChainTx,
} from "@/lib/checkout/match";

const t0 = new Date("2026-11-03T12:00:00Z");
const sec = (d: Date) => Math.floor(d.getTime() / 1000);
const tx = (
  txid: string,
  valueSats: number,
  confirmations = 0,
  blockTime: number | null = null,
): ChainTx => ({ txid, valueSats, confirmations, blockTime });

describe("bitcoin helpers", () => {
  it("converts USD to satoshis, rounding up", () => {
    expect(usdToSats(19900, 65000)).toBe(306154);
    expect(usdToSats(100, 100000)).toBe(1000);
    expect(() => usdToSats(100, 0)).toThrow();
  });

  it("formats amounts and payment URIs", () => {
    expect(formatBtc(258531)).toBe("0.00258531");
    expect(bip21("bc1qexample", 258531)).toBe(
      "bitcoin:bc1qexample?amount=0.00258531",
    );
  });

  it("validates addresses per network", () => {
    expect(
      isValidBtcAddress(
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "mainnet",
      ),
    ).toBe(true);
    expect(
      isValidBtcAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "mainnet"),
    ).toBe(true);
    expect(
      isValidBtcAddress(
        "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
        "mainnet",
      ),
    ).toBe(false);
    expect(
      isValidBtcAddress(
        "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
        "testnet4",
      ),
    ).toBe(true);
    expect(isValidBtcAddress("not-an-address", "mainnet")).toBe(false);
  });
});

describe("payment matching", () => {
  const reqA = { id: "a", amountSats: 306154, createdAt: t0 };
  const reqB = {
    id: "b",
    amountSats: 306871,
    createdAt: new Date(t0.getTime() + 60_000),
  };

  it("classifies amounts against the tolerance", () => {
    expect(outcomeFor(306154, 306154, 1)).toBe("exact");
    expect(outcomeFor(303100, 306154, 1)).toBe("exact");
    expect(outcomeFor(300000, 306154, 1)).toBe("under");
    expect(outcomeFor(400000, 306154, 1)).toBe("over");
  });

  it("matches exact unique amounts to the right request", () => {
    const m = matchTransactions(
      [reqA, reqB],
      [tx("t2", 306871), tx("t1", 306154)],
      new Set(),
      1,
    );
    expect(m.map((x) => [x.requestId, x.tx.txid, x.outcome])).toEqual([
      ["a", "t1", "exact"],
      ["b", "t2", "exact"],
    ]);
  });

  it("never reuses a transaction that is already claimed", () => {
    expect(
      matchTransactions([reqA], [tx("t1", 306154)], new Set(["t1"]), 1),
    ).toEqual([]);
  });

  it("attributes a non-exact amount only when one request is waiting", () => {
    const under = matchTransactions([reqA], [tx("t9", 200000)], new Set(), 1);
    expect(under).toHaveLength(1);
    expect(under[0].outcome).toBe("under");
    expect(
      matchTransactions([reqA, reqB], [tx("t9", 200000)], new Set(), 1),
    ).toEqual([]);
  });

  it("ignores payments confirmed before the request existed", () => {
    const old = tx(
      "old",
      306154,
      6,
      sec(new Date(t0.getTime() - 60 * 60 * 1000)),
    );
    expect(matchTransactions([reqA], [old], new Set(), 1)).toEqual([]);
  });

  it("reports overpayment", () => {
    const m = matchTransactions(
      [reqA],
      [tx("t3", 500000, 1, sec(t0))],
      new Set(),
      1,
    );
    expect(m[0].outcome).toBe("over");
  });
});
