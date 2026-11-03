import "server-only";
import { db } from "@/lib/db";
import type { Settings } from "@/lib/settings";
import { isValidBtcAddress } from "@/lib/checkout/bitcoin";

export function isBitcoinReady(settings: Settings) {
  const { btcAddress, network } = settings.crypto;
  return Boolean(btcAddress) && isValidBtcAddress(btcAddress, network);
}

/** Active methods customers can actually use: Bitcoin ones need the wallet set, manual ones an account. */
export async function getCustomerMethods(settings: Settings) {
  const methods = await db.paymentMethod.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const btc = isBitcoinReady(settings);
  return methods
    .filter((m) => (m.kind === "BITCOIN" ? btc : Boolean(m.account)))
    .map((m) => ({
      id: m.id,
      name: m.name,
      subtitle: m.subtitle,
      description: m.description,
      kind: m.kind,
      logoUrl: m.logoUrl,
      glyph: m.glyph,
      accent: m.accent,
      instructions: m.instructions,
    }));
}
