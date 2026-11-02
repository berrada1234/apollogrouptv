// Generates the original homepage illustrations (public/images/home/*.svg).
// Run: node scripts/generate-home-illustrations.mjs
// Flat, on-brand vector art — no third-party imagery, logos or photos.
import fs from "node:fs";

const OUT = "public/images/home";
fs.mkdirSync(OUT, { recursive: true });

const C = { bg: "#0B1728", card: "#101F33", raised: "#162A44", inset: "#091423", border: "#22334A", strong: "#2E4562", blue: "#3B82F6", accent: "#60A5FA", light: "#93C5FD", text: "#F8FAFC", muted: "#94A3B8", success: "#22C55E", warn: "#F59E0B" };

const frame = (id, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" role="img">
<defs>
  <radialGradient id="${id}-glow" cx="50%" cy="0%" r="80%"><stop offset="0" stop-color="${C.blue}" stop-opacity=".28"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}-art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E3A8A"/><stop offset=".55" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.light}"/></linearGradient>
  <linearGradient id="${id}-art2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#172554"/><stop offset="1" stop-color="#6366F1"/></linearGradient>
  <linearGradient id="${id}-art3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0C4A6E"/><stop offset="1" stop-color="#7DD3FC"/></linearGradient>
</defs>
<rect width="640" height="440" rx="28" fill="${C.bg}"/>
<rect width="640" height="440" rx="28" fill="url(#${id}-glow)"/>
<rect x=".5" y=".5" width="639" height="439" rx="27.5" fill="none" stroke="${C.border}"/>
${body}
</svg>`;

const card = (x, y, w, h, fill = C.card, r = 14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.border}"/>`;
const bar = (x, y, w, h = 8, fill = C.strong, r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const dot = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const check = (x, y, s = 1, color = C.success) => `<path d="M${x} ${y + 6 * s}l${5 * s} ${5 * s} ${10 * s}-${11 * s}" fill="none" stroke="${color}" stroke-width="${3 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
const tile = (x, y, w, h, grad) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#${grad})"/><rect x="${x + 10}" y="${y + h - 16}" width="${w * 0.45}" height="5" rx="2.5" fill="#fff" fill-opacity=".55"/>`;

const files = {
  // 1. Overview: TV with app UI
  "apollo-group-tv-streaming-overview": (id) => `
${card(90, 60, 460, 280, C.inset, 18)}
${card(104, 74, 432, 252, C.card, 12)}
<rect x="120" y="92" width="400" height="96" rx="12" fill="url(#${id}-art)"/>
${bar(140, 120, 150, 12, "#fff")}${bar(140, 142, 200, 7, "#fff", 3.5).replace('fill="#fff"', 'fill="#fff" fill-opacity=".5"')}
<rect x="140" y="160" width="70" height="18" rx="6" fill="#fff"/>
${tile(120, 204, 92, 56, `${id}-art2`)}${tile(222, 204, 92, 56, `${id}-art3`)}${tile(324, 204, 92, 56, `${id}-art`)}${tile(426, 204, 94, 56, `${id}-art2`)}
${bar(120, 276, 120)}${bar(120, 292, 80, 6, C.border)}
<rect x="290" y="340" width="60" height="16" rx="4" fill="${C.raised}"/><rect x="240" y="356" width="160" height="10" rx="5" fill="${C.card}"/>
${card(470, 300, 140, 70, C.raised)}${dot(494, 335, 12, C.success)}${check(487, 329, 0.9, C.bg)}${bar(514, 324, 76, 8, C.text)}${bar(514, 340, 56, 6, C.muted)}`,

  // 2. Features dashboard
  "apollo-group-tv-features-dashboard": () => `
${card(60, 50, 520, 340, C.card, 18)}
${bar(84, 76, 140, 12, C.text)}${bar(84, 98, 90, 7, C.muted)}
${[0, 1, 2].map((i) => `${card(84 + i * 162, 124, 148, 90, C.raised)}${bar(100 + i * 162, 142, 70, 7, C.muted)}${bar(100 + i * 162, 160, 90, 14, C.text)}${bar(100 + i * 162, 186, 50, 7, i === 0 ? C.success : C.accent)}`).join("")}
${card(84, 230, 300, 136, C.raised)}
${[0, 1, 2, 3].map((i) => `${dot(108, 256 + i * 28, 6, i === 0 ? C.accent : C.strong)}${bar(124, 252 + i * 28, 180 - i * 25, 8)}`).join("")}
${card(398, 230, 158, 136, C.raised)}
<circle cx="477" cy="298" r="42" fill="none" stroke="${C.border}" stroke-width="12"/>
<circle cx="477" cy="298" r="42" fill="none" stroke="${C.accent}" stroke-width="12" stroke-dasharray="190 264" stroke-linecap="round" transform="rotate(-90 477 298)"/>`,

  // 3. How it works: 4 connected steps
  "apollo-tv-how-it-works": () => `
<path d="M120 220 H520" stroke="${C.blue}" stroke-opacity=".5" stroke-width="3" stroke-dasharray="6 8"/>
${[0, 1, 2, 3].map((i) => {
    const x = 120 + i * 133;
    return `<circle cx="${x}" cy="220" r="44" fill="${C.card}" stroke="${i < 3 ? C.blue : C.strong}" stroke-width="3"/>
<circle cx="${x}" cy="220" r="30" fill="${i < 3 ? C.blue : C.raised}"/>
<text x="${x}" y="230" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#fff">${i + 1}</text>
${bar(x - 46, 290, 92, 9, C.text)}${bar(x - 34, 308, 68, 7, C.muted)}`;
  }).join("")}
${card(240, 70, 160, 70, C.raised)}${dot(272, 105, 14, C.success)}${check(264, 99, 0.95, C.bg)}${bar(296, 96, 86, 8, C.text)}${bar(296, 112, 60, 6, C.muted)}`,

  // 4. Plans & pricing cards
  "apollo-group-tv-subscription-plans-pricing": () => `
${[0, 1, 2].map((i) => {
    const x = 70 + i * 172;
    const hi = i === 1;
    const y = hi ? 56 : 80;
    return `<rect x="${x}" y="${y}" width="156" height="${hi ? 330 : 290}" rx="16" fill="${hi ? C.raised : C.card}" stroke="${hi ? C.blue : C.border}" stroke-width="${hi ? 2 : 1}"/>
${hi ? `<rect x="${x + 38}" y="${y - 12}" width="80" height="24" rx="12" fill="${C.blue}"/>` : ""}
${bar(x + 18, y + 32, 70, 10, C.text)}${bar(x + 18, y + 52, 110, 6, C.muted)}
${bar(x + 18, y + 80, 86, 22, C.text, 6)}
${[0, 1, 2].map((j) => `${check(x + 18, y + 124 + j * 30, 0.8, C.accent)}${bar(x + 40, y + 128 + j * 30, 90 - j * 12, 7)}`).join("")}
<rect x="${x + 18}" y="${y + (hi ? 270 : 232)}" width="120" height="32" rx="10" fill="${hi ? C.blue : C.inset}" stroke="${hi ? C.blue : C.strong}"/>`;
  }).join("")}`,

  // 5. Channel catalog with search & categories
  "apollo-group-tv-channel-catalog": (id) => `
${card(60, 50, 520, 340, C.card, 18)}
<rect x="84" y="76" width="300" height="38" rx="10" fill="${C.inset}" stroke="${C.strong}"/>
<circle cx="106" cy="95" r="8" fill="none" stroke="${C.muted}" stroke-width="2.5"/><path d="M112 101l6 6" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>
${bar(126, 91, 120, 8, C.strong)}
${["All", "News", "Sports", "Movies", "Kids"].map((_, i) => `<rect x="${84 + i * 92}" y="130" width="80" height="26" rx="13" fill="${i === 2 ? C.blue : C.inset}" fill-opacity="${i === 2 ? 0.25 : 1}" stroke="${i === 2 ? C.blue : C.border}"/>${bar(100 + i * 92, 139, 48, 7, i === 2 ? C.light : C.muted)}`).join("")}
${[0, 1, 2, 3, 4, 5].map((i) => {
    const x = 84 + (i % 3) * 162;
    const y = 176 + Math.floor(i / 3) * 96;
    return `${card(x, y, 148, 82, C.raised)}<rect x="${x + 12}" y="${y + 14}" width="54" height="54" rx="10" fill="url(#${id}-${["art", "art2", "art3"][i % 3]})"/>${bar(x + 76, y + 24, 56, 8, C.text)}${bar(x + 76, y + 42, 40, 7, C.muted)}<rect x="${x + 76}" y="${y + 56}" width="26" height="12" rx="6" fill="${C.blue}" fill-opacity=".3"/>`;
  }).join("")}`,

  // 6. Devices: TV, phone, laptop
  "apollo-tv-app-supported-devices": (id) => `
${card(70, 70, 320, 200, C.inset, 14)}<rect x="82" y="82" width="296" height="176" rx="8" fill="url(#${id}-art)"/>
<rect x="200" y="270" width="60" height="16" rx="4" fill="${C.raised}"/><rect x="170" y="286" width="120" height="8" rx="4" fill="${C.card}"/>
<circle cx="230" cy="170" r="30" fill="#fff" fill-opacity=".92"/><path d="M222 154l24 16-24 16z" fill="${C.blue}"/>
${card(330, 150, 120, 230, C.inset, 20)}<rect x="340" y="166" width="100" height="198" rx="12" fill="${C.card}"/>
${bar(352, 182, 50, 7, C.muted)}${bar(352, 198, 70, 11, C.text)}<rect x="352" y="220" width="40" height="14" rx="7" fill="${C.success}" fill-opacity=".25"/>
${[0, 1, 2].map((i) => `<rect x="352" y="${250 + i * 32}" width="76" height="22" rx="6" fill="${C.raised}"/>`).join("")}
${card(470, 210, 120, 80, C.inset, 8)}<rect x="478" y="218" width="104" height="64" rx="4" fill="url(#${id}-art3)"/><path d="M455 300h150l-12 14H467z" fill="${C.raised}"/>
${card(440, 70, 150, 56, C.raised)}${dot(464, 98, 12, C.success)}${check(457, 92, 0.85, C.bg)}${bar(484, 90, 86, 8, C.text)}${bar(484, 106, 60, 6, C.muted)}`,

  // 7. Requirements checklist
  "apollo-tv-streaming-requirements": () => `
${card(120, 50, 400, 340, C.card, 18)}
${bar(150, 80, 160, 12, C.text)}
${[0, 1, 2, 3].map((i) => `<rect x="150" y="${120 + i * 62}" width="340" height="48" rx="12" fill="${C.raised}" stroke="${C.border}"/>
<circle cx="178" cy="${144 + i * 62}" r="14" fill="${C.success}" fill-opacity=".2"/>${check(170, 138 + i * 62, 0.85)}
${bar(204, 136 + i * 62, 150 - i * 10, 8, C.text)}${bar(204, 152 + i * 62, 110, 6, C.muted)}`).join("")}
<g transform="translate(500 72) scale(.82)"><circle r="44" fill="${C.raised}" stroke="${C.border}"/>
<path d="M-24 -4a34 34 0 0 1 48 0M-15 6a21 21 0 0 1 30 0M-6 16a8 8 0 0 1 12 0" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/></g>`,

  // 8. Legal & safety shield
  "is-apollo-group-tv-legal-safe": (id) => `
<path d="M320 70l120 44v86c0 80-52 130-120 158-68-28-120-78-120-158v-86z" fill="${C.card}" stroke="${C.blue}" stroke-width="3"/>
<path d="M320 100l92 34v66c0 62-40 100-92 122-52-22-92-60-92-122v-66z" fill="url(#${id}-art)" fill-opacity=".35"/>
${check(286, 196, 3.2, C.text)}
${card(70, 120, 140, 110, C.raised)}${bar(88, 142, 70, 8, C.text)}${[0, 1, 2, 3].map((i) => bar(88, 162 + i * 14, 100 - i * 12, 6)).join("")}
${card(430, 230, 150, 96, C.raised)}<circle cx="460" cy="262" r="14" fill="none" stroke="${C.accent}" stroke-width="3"/><path d="M455 262h10M460 257v10" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>${bar(484, 256, 76, 8, C.text)}${bar(452, 292, 108, 6)}${bar(452, 306, 80, 6)}`,

  // 9. Why choose: comparison checklist
  "why-choose-apollo-group-tv": () => `
${card(80, 50, 480, 340, C.card, 18)}
<rect x="80" y="50" width="480" height="56" rx="18" fill="${C.raised}"/><rect x="80" y="86" width="480" height="20" fill="${C.raised}"/>
${bar(104, 74, 110, 8, C.muted)}${bar(330, 74, 130, 8, C.light)}
${[0, 1, 2, 3, 4].map((i) => `<path d="M80 ${106 + i * 56}H560" stroke="${C.border}"/>
${bar(104, 128 + i * 56, 150 - (i % 3) * 20, 9, C.text)}${check(330, 122 + i * 56, 0.9, C.accent)}${bar(356, 128 + i * 56, 160 - (i % 2) * 40, 8)}`).join("")}`,

  // 10. Reviews
  "apollo-group-tv-customer-reviews": () => `
${[0, 1].map((i) => {
    const x = 70 + i * 260;
    const y = 70 + i * 60;
    return `${card(x, y, 240, 220, C.card, 16)}
${[0, 1, 2, 3, 4].map((s) => `<path d="M${x + 24 + s * 24} ${y + 24}l5 10 11 1.6-8 7.8 1.9 11-9.9-5.2-9.9 5.2 1.9-11-8-7.8 11-1.6z" fill="${s < 4 + i ? C.accent : C.strong}" transform="scale(1)"/>`).join("")}
${bar(x + 24, y + 70, 150, 10, C.text)}${[0, 1, 2].map((j) => bar(x + 24, y + 94 + j * 16, 190 - j * 30, 6, C.muted)).join("")}
<path d="M${x + 24} ${y + 164}H${x + 216}" stroke="${C.border}"/>${dot(x + 44, y + 192, 16, C.blue)}${bar(x + 70, y + 184, 80, 8, C.text)}${bar(x + 70, y + 198, 56, 6)}`;
  }).join("")}
<rect x="430" y="70" width="140" height="34" rx="17" fill="${C.success}" fill-opacity=".15" stroke="${C.success}" stroke-opacity=".5"/>${check(446, 80, 0.75)}${bar(468, 84, 86, 7, C.success)}`,

  // 11. Support chat thread
  "apollo-tv-customer-support": () => `
${card(90, 50, 460, 340, C.card, 18)}
${bar(116, 78, 150, 10, C.text)}<rect x="440" y="72" width="86" height="22" rx="11" fill="${C.blue}" fill-opacity=".25"/>
<path d="M90 110H550" stroke="${C.border}"/>
<rect x="116" y="130" width="250" height="64" rx="14" fill="${C.raised}"/>${bar(132, 148, 180, 7, C.text)}${bar(132, 166, 140, 6)}
<rect x="274" y="210" width="250" height="64" rx="14" fill="${C.blue}" fill-opacity=".2" stroke="${C.blue}" stroke-opacity=".5"/>${bar(290, 228, 200, 7, C.light)}${bar(290, 246, 150, 6, C.accent)}
<rect x="116" y="290" width="200" height="40" rx="14" fill="${C.raised}"/>${dot(140, 310, 4, C.muted)}${dot(156, 310, 4, C.muted)}${dot(172, 310, 4, C.muted)}
<rect x="116" y="344" width="408" height="30" rx="10" fill="${C.inset}" stroke="${C.strong}"/><rect x="474" y="349" width="44" height="20" rx="6" fill="${C.blue}"/>`,

  // 12. Referral
  "apollo-group-tv-referral-program": () => `
<path d="M220 200 C 300 120, 340 120, 420 200" fill="none" stroke="${C.blue}" stroke-opacity=".6" stroke-width="3" stroke-dasharray="6 8"/>
${dot(180, 230, 56, C.card)}<circle cx="180" cy="230" r="56" fill="none" stroke="${C.blue}" stroke-width="3"/>${dot(180, 214, 18, C.accent)}<path d="M150 262a30 26 0 0 1 60 0" fill="${C.accent}"/>
${dot(460, 230, 56, C.card)}<circle cx="460" cy="230" r="56" fill="none" stroke="${C.strong}" stroke-width="3"/>${dot(460, 214, 18, C.light)}<path d="M430 262a30 26 0 0 1 60 0" fill="${C.light}"/>
<g transform="translate(320 120)"><rect x="-34" y="-20" width="68" height="52" rx="8" fill="${C.blue}"/><rect x="-40" y="-32" width="80" height="16" rx="5" fill="${C.accent}"/><rect x="-5" y="-32" width="10" height="64" fill="#fff" fill-opacity=".85"/></g>
${card(190, 320, 260, 54, C.raised)}${bar(212, 342, 150, 10, C.light)}<rect x="384" y="334" width="50" height="26" rx="8" fill="${C.blue}"/>`,

  // 13. FAQ
  "apollo-group-tv-faq": () => `
${card(110, 50, 420, 340, C.card, 18)}
${[0, 1, 2, 3, 4].map((i) => {
    const open = i === 1;
    const y = 76 + i * 58 + (i > 1 ? 40 : 0);
    return `<rect x="134" y="${y}" width="372" height="${open ? 88 : 44}" rx="12" fill="${open ? C.raised : C.inset}" stroke="${open ? C.blue : C.border}" stroke-opacity="${open ? 0.6 : 1}"/>
${bar(154, y + 18, 200 - (i % 3) * 30, 8, C.text)}<circle cx="482" cy="${y + 22}" r="11" fill="none" stroke="${open ? C.accent : C.strong}" stroke-width="2"/><path d="M477 ${y + (open ? 25 : 20)}l5 ${open ? -5 : 5} 5 ${open ? 5 : -5}" fill="none" stroke="${open ? C.accent : C.muted}" stroke-width="2"/>
${open ? `${bar(154, y + 48, 300, 6)}${bar(154, y + 62, 230, 6)}` : ""}`;
  }).join("")}
<g transform="translate(540 70)"><circle r="40" fill="${C.blue}"/><text y="14" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#fff">?</text></g>`,
};

for (const [name, fn] of Object.entries(files)) {
  const id = name.replace(/[^a-z0-9]/g, "").slice(0, 10);
  fs.writeFileSync(`${OUT}/${name}.svg`, frame(id, fn(id)).replace(/\n\s*\n/g, "\n"));
}
console.log(`Wrote ${Object.keys(files).length} illustrations to ${OUT}`);
