import "server-only";
import { deviceGuideCopy, generalGuides } from "@/content/guides";
import { getSettings } from "@/lib/settings";
import { slugify } from "@/lib/utils";

/** Device guides exist only for platforms an admin has marked as verified. */
export async function getDeviceGuides() {
  const settings = await getSettings();
  const general = new Set(generalGuides.map((g) => g.slug));
  return settings.apps.platforms
    .filter((p) => p.verified)
    .map((p) => ({ ...p, slug: slugify(p.name) }))
    .filter((p) => p.slug && !general.has(p.slug))
    .map((p) => ({ ...p, ...deviceGuideCopy(p.name) }));
}

export type DeviceGuide = Awaited<ReturnType<typeof getDeviceGuides>>[number];
