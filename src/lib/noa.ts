export type Category = "קבלן" | "לקוח קבוע" | "הנהלה" | "אישי-פרטי-משפחה";

export interface Profile {
  id: string;
  name: string;
  aliases: string;
  phone: string;
  intlPhone: string;
  lid: string;
  comaxId: string;
  category: Category;
  address: string;
  unloadHours: string;
  notes: string;
  containerDays: string;
  containerSwap: string;
  avatar: string;
}

export interface Msg {
  id: string;
  chatId: string;
  out: boolean;
  text: string;
  time: string;
  read?: boolean;
}

export function formatNoaWhatsAppReply({
  emoji = "👤", headline = "", bullets = [] as string[], body = "", question = "", footer = "",
} = {}) {
  let res = emoji + " *" + headline + "*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  if (body) res += body + "\n";
  if (bullets.length) {
    res += bullets.map((b) => (/^[•📍📞🏢🏷🏗🤝🚚💬📝♻📅⏰]/u.test(b) ? b : "• " + b)).join("\n") + "\n";
  }
  if (footer) res += "\n" + footer + "\n";
  if (question) res += "\n👉 *" + question + "*";
  return res.trim();
}

const mk = (id: string, name: string, category: Category, phone = "", address = ""): Profile => ({
  id, name, aliases: "", phone, intlPhone: phone ? "972" + phone.replace(/^0|-/g, "") : "", lid: "",
  comaxId: "", category, address, unloadHours: "", notes: "", containerDays: "", containerSwap: "", avatar: "",
});

export const DEFAULT_PROFILES: Profile[] = [
  mk("rami", "ראמי מסארווה", "הנהלה", "050-8860896", "החרש 10, הוד השרון"),
  mk("ornil", "אורניל", "קבלן"),
  mk("motskin", "לירן מוצקין", "לקוח קבוע", "", "מוצקין 22, רעננה"),
  mk("buktus", "בוקטוס", "קבלן"),
  mk("netanel", "נתנאל מגד", "לקוח קבוע"),
  mk("vered", "ורד אידלסון", "הנהלה", "050-6662300"),
  mk("harel", "הראל", "הנהלה"),
  mk("julie", "ג'ולי", "אישי-פרטי-משפחה"),
];

export const now = () => new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

const KEY = "noa-profiles-v1";
const SKEY = "noa-settings-v1";
export const loadProfiles = (): Profile[] => {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_PROFILES;
};
export const saveProfiles = (p: Profile[]) => localStorage.setItem(KEY, JSON.stringify(p));
export const loadSettings = () => {
  try { return { serverUrl: "", apiKey: "", ...JSON.parse(localStorage.getItem(SKEY) || "{}") }; } catch { return { serverUrl: "", apiKey: "" }; }
};
export const saveSettings = (s: { serverUrl: string; apiKey: string }) => localStorage.setItem(SKEY, JSON.stringify(s));

/** Local fallback reply when the Noa server isn't reachable. */
export function demoReply(text: string, who: Profile): string {
  if (/מכולה|מכולות/.test(text))
    return formatNoaWhatsAppReply({ emoji: "♻️", headline: "מכולה 8 קוב", bullets: [`📍 ${who.address || "כתובת לא מוגדרת"}`, `📅 ימי שכירות: ${who.containerDays || "—"}`, "🚚 החלפה / פינוי לפי סידור"], question: "להזמין החלפה למחר?" });
  if (/תעוד|משלוח/.test(text))
    return formatNoaWhatsAppReply({ emoji: "📝", headline: "תעודות משלוח — חכמת מנוף", bullets: ["🚚 מרצדס 615-41-002", "🏢 סניף 4 — החרש 10", "סטטוס: ממתין לבדיקת ראמי"], footer: '✅ *נבדק ואושר ע"י ראמי*', question: "לשלוח עדכון לורד?" });
  return formatNoaWhatsAppReply({ emoji: "🏗️", headline: `הזמנה חדשה — ${who.name}`, body: "קלטתי את הבקשה והצלבתי מול מחירון קומקס.", bullets: [`📍 ${who.address || "יש לאשר כתובת"}`, "🚚 משאית מנוף — בדיקת משקל TRUCK_SPECS תקינה", "🏷️ פיקדון משטחים 60002 / 60060 חושב"], question: "לאשר ולהכניס לסידור מחר?" });
}

export async function sendToServer(url: string, apiKey: string, who: Profile, text: string) {
  const r = await fetch(url.replace(/\/$/, "") + "/api/test-message", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiKey ? { "x-api-key": apiKey, Authorization: `Bearer ${apiKey}` } : {}) },
    body: JSON.stringify({ from: (who.intlPhone || "972508860896") + "@c.us", body: text, senderName: who.name }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export function playDing(alert = false) {
  try {
    const ctx = new AudioContext();
    const notes = alert ? [880, 660, 880, 660] : [1046, 1318];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = f; o.type = alert ? "square" : "sine";
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch {}
}
