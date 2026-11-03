/**
 * Decides which on-chain transaction pays which Bitcoin payment request.
 *
 * Every request on a wallet gets a unique satoshi amount, so an exact match is
 * unambiguous. A transaction with a different amount is attributed only when
 * a single request on that wallet is still waiting; otherwise it is left for
 * an admin to review rather than guessed.
 */

export type ChainTx = {
  txid: string;
  /** Total sent to the watched address in this transaction. */
  valueSats: number;
  confirmations: number;
  /** Block time in seconds; null while unconfirmed. */
  blockTime: number | null;
};

export type OpenRequest = { id: string; amountSats: number; createdAt: Date };

export type Outcome = "exact" | "over" | "under";

export type Match = { requestId: string; tx: ChainTx; outcome: Outcome };

// Allow for clock differences between our server and block timestamps.
const CLOCK_SKEW_MS = 10 * 60 * 1000;

export function outcomeFor(
  valueSats: number,
  amountSats: number,
  tolerancePct: number,
): Outcome {
  const slack = Math.floor((amountSats * tolerancePct) / 100);
  if (valueSats < amountSats - slack) return "under";
  if (valueSats > amountSats + slack) return "over";
  return "exact";
}

function seenAfter(tx: ChainTx, req: OpenRequest) {
  return (
    tx.blockTime === null ||
    tx.blockTime * 1000 >= req.createdAt.getTime() - CLOCK_SKEW_MS
  );
}

export function matchTransactions(
  requests: OpenRequest[],
  txs: ChainTx[],
  claimed: ReadonlySet<string>,
  tolerancePct: number,
): Match[] {
  const free = txs.filter((t) => t.valueSats > 0 && !claimed.has(t.txid));
  const waiting = [...requests].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  const matches: Match[] = [];

  for (const req of [...waiting]) {
    const i = free.findIndex(
      (t) => t.valueSats === req.amountSats && seenAfter(t, req),
    );
    if (i < 0) continue;
    matches.push({ requestId: req.id, tx: free[i], outcome: "exact" });
    free.splice(i, 1);
    waiting.splice(waiting.indexOf(req), 1);
  }

  if (waiting.length === 1) {
    const req = waiting[0];
    // Oldest confirmed first, then unconfirmed.
    const tx = free
      .filter((t) => seenAfter(t, req))
      .sort((a, b) => (a.blockTime ?? Infinity) - (b.blockTime ?? Infinity))[0];
    if (tx)
      matches.push({
        requestId: req.id,
        tx,
        outcome: outcomeFor(tx.valueSats, req.amountSats, tolerancePct),
      });
  }
  return matches;
}
