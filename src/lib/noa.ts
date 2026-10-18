export type Category = "קבלן" | "לקוח קבוע" | "הנהלה" | "אישי-פרטי-משפחה" | "לקוח חדש";

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
  company?: string;
  preferredVehicle?: string;
  aiKnowledge?: string;
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
  emoji = "👤",
  headline = "",
  bullets = [] as string[],
  body = "",
  question = "",
  footer = "",
} = {}) {
  let res = emoji + " *" + headline + "*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
  if (body) res += body + "\n";
  if (bullets.length) {
    res +=
      bullets.map((b) => (/^[•📍📞🏢🏷🏗🤝🚚💬📝♻📅⏰🏀]/u.test(b) ? b : "• " + b)).join("\n") + "\n";
  }
  if (footer) res += "\n" + footer + "\n";
  if (question) res += "\n👉 *" + question + "*";
  return res.trim();
}

const mk = (
  id: string,
  name: string,
  category: Category,
  phone = "",
  address = "",
  comaxId = "",
  notes = "",
  preferredVehicle = "חכמת (מרצדס מנוף 12 טון)",
  containerDays = "",
  containerSwap = "",
  aiKnowledge = "",
): Profile => ({
  id,
  name,
  aliases: "",
  phone,
  intlPhone: phone ? "972" + phone.replace(/^0|-/g, "") : "",
  lid: "",
  comaxId,
  category,
  address,
  unloadHours: "07:00–12:00",
  notes,
  containerDays,
  containerSwap,
  avatar: "",
  preferredVehicle,
  aiKnowledge: aiKnowledge || notes,
});

export const DEFAULT_PROFILES: Profile[] = [
  // הנהלה וצוות
  mk(
    "rami",
    "ראמי מסארווה",
    "הנהלה",
    "050-8860896",
    "החרש 10, הוד השרון",
    "סדרן ראשי",
    "מנהל ההזמנות והסידור המבצעי של ח. סבן. נועה היא יד ימינו.",
  ),
  mk(
    "vered",
    "ורד אידלסון",
    "הנהלה",
    "050-6662300",
    "הנהלה בכירה",
    "הנהלה",
    "הנהלה בכירה ופיקוח תעודות משלוח וסגירת מעגל. בנה עידן שחקן כדורסל מוכשר 🏀 (VERED_SUPERVISION_NUDGE_V1).",
  ),
  mk(
    "harel",
    "הראל אידלסון",
    "הנהלה",
    "050-5227724",
    "משרדי סבן",
    'מנכ"ל',
    'מנכ"ל והנהלה בכירה. בקבוצת הסידור מפנים אליו ישירות לראמי 🫡.',
  ),

  // לקוחות מפתח ומאסטר
  mk(
    "netanel_meged",
    "נתנאל מגל (מגד שיפוצים)",
    "קבלן",
    "054-9644335",
    "העוגב 15, קרני שומרון",
    "614132",
    "סוכן ריימונד ביטון. תיאום יציאה מוקדם 06:30. סל נפוץ: טיט שק גדול, סומסום, מלט, דבק 116, מכולה 8 קוב.",
    "משאית רמסע מכולות (8 קוב) / מנוף חכמת (קו שומרון)",
  ),
  mk(
    "ehud_behar",
    "אהוד בהר (אודי)",
    "קבלן",
    "052-6988989",
    "הורד 29, אלישמע",
    "520117",
    "מעקב שכירות מכולה 8 קוב פעילה (10 ימים עד 28/10/2026, משימה TASK-RENTAL-1239).",
    "משאית רמסע מכולות (8 קוב) / מנוף חכמת",
    "10 ימים (עד 28/10)",
    "28/10/2026",
  ),
  mk(
    "li_ran",
    "לי-רן יזום והשקעות (לירן)",
    "לקוח קבוע",
    "050-5669924",
    "מוצקין 22, רעננה",
    "612108",
    "איש קשר: יהודה כהן. זמני פריקה 25 דק'. פריקה עם סל כבד.",
    "מנוף חכמת (סל כבד) / איסוזו עלי",
  ),
  mk(
    "ornil",
    "אורניל / אבי לוי גור (תחסין)",
    "קבלן",
    "054-5998111",
    "סטרומה 4, הרצליה (וגם לוחמי גליפולי 8, אביחיל)",
    "601992",
    "איש קשר: תחסין / אבי לוי. סל קבוע: בלות חול, סומסום, מלט נשר.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "ratab",
    "ראתב עקאש (אומנות בצבע)",
    "קבלן",
    "052-7263988",
    "רבוצקי 50, רעננה / מ ריצפות צבע לבן 80",
    "616078",
    "הזמנה שוטפת: לוחות גבס לבן 280, בלוק 20 ו-10, טיט ודבק 109.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "dudi_ozana",
    "דודי אוזנה (שטיכמוס)",
    "קבלן",
    "052-4404222",
    "שיבת ציון 30 / 12, תל אביב",
    "602100",
    'הזמנות קבועות בלוק שטראבה, בלוק יו, פומיס 22, מלט וטיח ממ"ד.',
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "buktus",
    "שלום בוקטוס (עמית)",
    "קבלן",
    "050-6707779",
    "הנרייטה סולד 20, הוד השרון",
    "602568",
    "אספקות שוטפות של מלט, בטון מוכן ושקי חול.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "zivulun_adiran",
    'זבולון-עדירן בע"מ',
    "לקוח קבוע",
    "052-5062750",
    'ביל"ו 58, תל אביב / ביל"ו 53, רעננה',
    "612603",
    "לוחות גבס, מלט נשר ודבק כרמית 109.",
    "חכמת (מרצדס מנוף) / עלי (איסוזו)",
  ),
  mk(
    "d_niv",
    'ד.ניב שיפוצים (ב"ס חינוך/יגאל)',
    "לקוח קבוע",
    "054-2108810",
    "הבנות 16 / משאבים 45, הוד השרון",
    "604368",
    "רוני / ניב שיפוצים.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "bereshit",
    "חברת הכל מבראשית (טל ארביב)",
    "קבלן",
    "052-5689416",
    "שער 14, אוניברסיטת תל אביב",
    "604380",
    "מכולות והצבות כפולות לאוניברסיטה.",
    "משאית רמסע מכולות (8 קוב)",
  ),
  mk(
    "solberg",
    "עמית ושרית סולברג (איתי)",
    "קבלן",
    "054-8373707",
    "פעמונית 47, רעננה / רח' מגדל 30",
    "616161",
    "מלט אפור נשר, בונד 200, טיט מוכן.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "bunk_asaf",
    "בונק אסף",
    "קבלן",
    "052-7445777",
    "השרון 10 / הסחלב 8, מודיעין-רעות",
    "632237",
    "בלות סומסום, מלט נשר, לוחות גבס כחול, דבק סיקה.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "ben_gai",
    "בן-גיא סלומון השקעות",
    "קבלן",
    "050-5544332",
    "שרת 59, תל אביב",
    "920535",
    "פרויקטי גמר והשקעות.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "ofer_katz",
    "עופר כץ",
    "קבלן",
    "052-6655443",
    "בית העם 3, רמות השבים",
    "616166",
    "ריצופית 181 במשטחים (1.0 טון).",
    "עלי (משאית איסוזו פלטה)",
  ),
  mk(
    "liat_asayag",
    "ליאת אסייג יהושוע",
    "לקוח קבוע",
    "054-8899001",
    "ציפמן 50",
    "632216",
    "לקוח קבוע ח. סבן.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "bloom_nadlan",
    'א.ש. בלום נדל"ן',
    "לקוח קבוע",
    "052-1122334",
    "מרכז שרונה, תל אביב",
    "601939",
    "הזמנות מרכז שרונה.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "golan_avi",
    "גולן (אבי גולן שיפוצים)",
    "קבלן",
    "054-2233445",
    "חוחית 8",
    "632088",
    "גולן שיפוצים.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "haimovich_tal",
    "חיימוביץ טל ויקטור",
    "קבלן",
    "054-6677889",
    "שער הגיא 12",
    "632024",
    "קבלן קבוע.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "ben_inbar",
    "בן ענבר (ליידי)",
    "לקוח קבוע",
    "050-7766554",
    "בעל התאנה 26",
    "602497",
    "חומרי גמר ושיפוץ.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "nakash_naaman",
    "נקש את נעמן",
    "לקוח קבוע",
    "052-8877665",
    "זוויתן 1",
    "632145",
    "קבלן / לקוח קבוע.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "eylati_avraham",
    "אילתי אברהם",
    "לקוח קבוע",
    "054-3344556",
    "מגדל הלבנון 14",
    "614063",
    "קבלן קבוע.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "green_projects",
    "נ.ע. גרין פרויקטים",
    "לקוח קבוע",
    "050-3344112",
    "הטווס 3",
    "614063",
    "פרויקטים באזור השרון.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "hasson_group",
    "קבוצת חסון",
    "לקוח קבוע",
    "050-7813361",
    "החשמונאים 1",
    "519977",
    "הזמנות קבועות.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "bazelet_mezar",
    'בזלת מזר בע"מ',
    "לקוח קבוע",
    "054-3322110",
    "פישמן מימון 7",
    "602115",
    "קבלן / לקוח קבוע.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "haim_amram",
    "חיים אמרם (אלנבי על הים)",
    "קבלן",
    "052-6688768",
    "חורגין 22, רמת גן",
    "616079",
    "החלפת מכולה 8 קוב וחומרי בניין.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "eran_azulay",
    'ערן אזולאי בע"מ',
    "לקוח חדש",
    "052-4664666",
    "לוק 7",
    "טרם שויך",
    "30 סומסום, 10 מלט, בלוקים, גלקסי 10 וקזנובה.",
    "חכמת (מרצדס מנוף)",
  ),
  mk(
    "mishlohim_plus",
    "משלוחים פלוס (עדי)",
    "לקוח חדש",
    "050-940-5631",
    "אזור מרכז",
    "טרם שויך",
    "סידור עבודה ומשמרות שליחים.",
    "איסוזו עלי",
  ),
  mk(
    "netanel_estricher",
    "נתנאל אסטריכר",
    "לקוח חדש",
    "054-0000000",
    "כלים וציוד",
    "טרם שויך",
    "התייעצות קלוד קוד וסוכני בינה מלאכותית.",
    "איסוזו עלי",
  ),
  mk(
    "julie",
    "ג'ולי",
    "אישי-פרטי-משפחה",
    "050-8898001",
    "שיחה פרטית",
    "לא לקוח",
    "אישתו לשעבר של ראמי (פרודים). שיחות אישיות בלבד, מסוננת אוטומטית מסידור העבודה ומגיליונות סבן.",
    "—",
  ),
];

export const now = () =>
  new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

const KEY = "noa-profiles-v3";
const SKEY = "noa-settings-v1";

export const loadProfiles = (): Profile[] => {
  try {
    const r = localStorage.getItem(KEY);
    if (r) {
      const parsed = JSON.parse(r) as Profile[];
      // If cached profiles list is smaller than injected knowledge profiles, merge them
      if (parsed.length >= DEFAULT_PROFILES.length) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage errors and return default profiles
  }
  // Store default enriched knowledge profiles
  try {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_PROFILES));
  } catch {
    // Ignore storage write errors
  }
  return DEFAULT_PROFILES;
};

export const saveProfiles = (p: Profile[]) => localStorage.setItem(KEY, JSON.stringify(p));

export const loadSettings = () => {
  try {
    return { serverUrl: "", apiKey: "", ...JSON.parse(localStorage.getItem(SKEY) || "{}") };
  } catch {
    return { serverUrl: "", apiKey: "" };
  }
};

export const saveSettings = (s: { serverUrl: string; apiKey: string }) =>
  localStorage.setItem(SKEY, JSON.stringify(s));

/**
 * Intelligent local fallback reply powered by the injected Saban DNA knowledge base.
 * Follows speechStyle: pingpong, max 2 sentences, no preamble, always one focused question.
 */
export function demoReply(text: string, who: Profile): string {
  const lower = text.toLowerCase();

  // 1. אישי / משפחה — ג'ולי
  if (who.category === "אישי-פרטי-משפחה" || who.id === "julie" || who.name.includes("ג'ולי")) {
    return "היי ג'ולי, קלטתי את ההודעה ואני מעבירה אותה ישירות לראמי שיחזור אלייך. יש משהו דחוף נוסף שתרצי שאמסור לו?";
  }

  // 2. הנהלה — ורד אידלסון (פרוטוקול VERED_SUPERVISION_NUDGE_V1)
  if (who.id === "vered" || who.name.includes("ורד")) {
    return "שלום ורד, מעקב תעודות וסגירת מעגל מתנהל כסדרו, וברכות חמות לעידן על משחק הכדורסל 🏀! האם לעבור עכשיו על התעודות של חכמת מאתמול?";
  }

  // 3. הנהלה — הראל אידלסון (נוהל סידור: להפנות לראמי)
  if (who.id === "harel" || who.name.includes("הראל")) {
    return "שלום הראל. 🫡 הודעתך נקלטה והועברה ישירות לראמי והוא חוזר אליך כעת ישירות. תרצה שאסמן עבורו עדיפות עליונה?";
  }

  // 4. מעקב שכירות מכולה ספציפי — אהוד בהר (אודי)
  if (who.id === "ehud_behar" || who.name.includes("אהוד בהר") || who.name.includes("אודי")) {
    if (/מכולה|מכולות|החלפה|פינוי|הוצאה/.test(text)) {
      return formatNoaWhatsAppReply({
        emoji: "♻️",
        headline: "מכולה 8 קוב — אהוד בהר",
        body: "מכולה 8 קוב בהורד 29 מגיעה לתום 10 ימי שכירות (28/10/2026).",
        bullets: [
          "📍 אתר: הורד 29, אלישמע",
          "📅 סיום 10 ימי שכירות: 28/10/2026 (משימה TASK-RENTAL-1239)",
          "🚚 משאית: רמסע מכולות ח. סבן",
        ],
        question: "תרצה שנתאם הוצאה סופית או החלפה במכולה חדשה?",
      });
    }
  }

  // 5. מכולות פסולת 8 קוב וחוקי שישי
  if (/מכולה|מכולות|רמסע|פינוי|פסולת/.test(text)) {
    const isFridayNotice = /שישי|סופ"ש/.test(text);
    return formatNoaWhatsAppReply({
      emoji: "♻️",
      headline: "מכולה 8 קוב — ח. סבן",
      body: isFridayNotice
        ? "שיבוץ מכולות 8 קוב למילוי עד קו אפס בלבד, ללא חריגת דפנות. אין החלפות מכולה בימי שישי לאחר השעה 11:00!"
        : "מכולת פסולת 8 קוב תקנית, מילוי עד גובה אפס בלבד וגישה פנויה לרמסע.",
      bullets: [
        `📍 אתר: ${who.address || "לפי כרטיס לקוח"}`,
        "📏 נפח מורשה: 8 קוב בלבד (קו דפנות אפס)",
        "⏰ ימי שישי: פינוי עד 11:00 בלבד",
      ],
      question: "לשבץ לך הצבה או החלפה בסידור של מחר בבוקר?",
    });
  }

  // 6. תעודות משלוח, טכוגרף, גליה, איתוראן
  if (/תעוד|משלוח|חתימ|גליה|טכוגרף|איתוראן/.test(text)) {
    return formatNoaWhatsAppReply({
      emoji: "📝",
      headline: "סגירת מעגל תעודות משלוח",
      body: "סריקות יומיות מגליה מאומתות מול חתימות לקוח, דיסקיות טכוגרף ושעות מנוף באיתוראן.",
      bullets: [
        "🚚 משאית מנוף: חכמת (615-41-002)",
        "🚛 משאית חלוקה קלה: עלי (651-51-701)",
        "📁 תיוק אוטומטי בתיקיות Google Drive סבן",
      ],
      footer: "✅ *אימות שעות מנוף וסגירת מעגל*",
      question: "לאתר תעודה ספציפית לבדיקה מול ראמי?",
    });
  }

  // 7. חוקי פקדונות 1:1, בלות ומשטחי מלט/בלוקים
  if (/פקדון|פקדונות|בלה|בלות|משטח|משטחים|60002|60060/.test(text)) {
    return formatNoaWhatsAppReply({
      emoji: "🏷️",
      headline: "חוקי פקדונות 1:1 — ח. סבן",
      body: "בלה (60002) מחויבת ביחס 1:1 על כל בלת חול/סומסום/טיט/חמרה. משטח מלט (60060) מחושב לכל 40 שקים (1.0 טון).",
      bullets: [
        "📦 בלה פקדון (60002): 1:1 אוטומטי",
        "🪵 משטח עץ סבן (60060): לכל 40 שקי מלט/דבק",
        "🧱 משטח בלוקים (60006): לפי מנת בלוק",
        "🚚 הובלה ללא פריקה (818050-818118): פטורה מפקדונות",
      ],
      question: "לחשב את הפקדונות המדויקים להזמנה הנוכחית?",
    });
  }

  // 8. מחסנים, רכבים ונהגים (מחסן 4 החרש 10, מחסן 1 התלמיד 6, חכמת, עלי)
  if (/מחסן|החרש|התלמיד|אורן|תמיר|חכמת|עלי|איסוזו|מרצדס/.test(text)) {
    return formatNoaWhatsAppReply({
      emoji: "🏭",
      headline: "מקורות אספקה וצי רכב סבן",
      bullets: [
        "🏭 מחסן 4 (החרש 10, אורן): כבד, מלט, אגרגטים ומכולות -> חכמת מנוף 12 טון (615-41-002)",
        "🏟️ מחסן 1 (התלמיד 6, תמיר ודורון): גבס, צבע, פרזול וגמר -> עלי איסוזו 5.5 טון (651-51-701)",
        '📍 מוצא קבוע לחישוב ק"מ: החרש 10, הוד השרון',
      ],
      question: "מאיזה מחסן לתכנן את יציאת הסבב עבורך?",
    });
  }

  // 9. תמחור והובלות (סדרת 18000 מנוף וסדרת 818000 קלה)
  if (/מחיר|הובלה|מנוף|קומקס|עלות|תעריף/.test(text)) {
    return formatNoaWhatsAppReply({
      emoji: "💰",
      headline: "תמחור הובלות וניתוב — ח. סבן",
      body: "מוצא קבוע: החרש 10 הוד השרון. תמחור לפי מחירון קומקס וברקודי אזור.",
      bullets: [
        '🏗️ מנוף (סדרת 18000): הוד השרון 280 ₪, כ"ס-רעננה 320 ₪, הרצליה-רמה"ש 350 ₪ (+12 ₪/ק"מ חורג)',
        '🚛 קלה (סדרת 818000): הוד השרון 200 ₪, כ"ס-רעננה 230 ₪, הרצליה-רמה"ש 250 ₪ (+8 ₪/ק"מ חורג)',
      ],
      question: "לסגור מול ראמי את תעריף האספקה לאתר שלך?",
    });
  }

  // 10. הזמנה רגילה עם פריטים / חומרי בניין (מלט, חול, בלוקים, גבס, דבק)
  const bullets = [
    `📍 אתר יעד: ${who.address || "נא לוודא כתובת מדויקת"}`,
    `🚚 שיוך משאית מומלץ: ${who.preferredVehicle || "חכמת (מרצדס מנוף)"}`,
    "🏷️ חישוב פקדונות 1:1 (בלות 60002 / משטחי מלט 60060) בוצע",
  ];

  if (who.aiKnowledge) {
    bullets.push(`🧠 ידע פונה שמור: ${who.aiKnowledge}`);
  }

  bullets.push("📋 מועבר ישירות לאישור ראמי בספרה 1 להזרקה לסידור");

  return formatNoaWhatsAppReply({
    emoji: "🏗️",
    headline: `קליטת הזמנה — ${who.name}`,
    body: "קלטתי את פרטי ההזמנה ומצליבה מול מחירון קומקס, מחסן המוצא (1 או 4) ומשקלי TRUCK_SPECS.",
    bullets,
    question: "לאשר ולהכניס לסידור העבודה למחר בבוקר?",
  });
}

export async function sendToServer(url: string, apiKey: string, who: Profile, text: string) {
  const r = await fetch(url.replace(/\/$/, "") + "/api/test-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey, Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      from: (who.intlPhone || "972508860896") + "@c.us",
      body: text,
      senderName: who.name,
    }),
  });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export function playDing(alert = false) {
  try {
    const ctx = new AudioContext();
    const notes = alert ? [880, 660, 880, 660] : [1046, 1318];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = alert ? "square" : "sine";
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch {
    // Ignore audio context autoplay or unsupported environment errors
  }
}
