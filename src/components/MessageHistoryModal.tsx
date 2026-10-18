import { useState } from "react";
import {
  History,
  Search,
  Sparkles,
  Clock,
  Trash2,
  CornerDownLeft,
  X,
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";
import type { Msg, Profile } from "@/lib/noa";

export function MessageHistoryModal({
  isOpen,
  onClose,
  who,
  messages,
  onSelectContextPrompt,
  onClearHistory,
}: {
  isOpen: boolean;
  onClose: () => void;
  who: Profile;
  messages: Msg[];
  onSelectContextPrompt: (promptText: string) => void;
  onClearHistory: () => void;
}) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const chatMessages = messages.filter((m) => m.chatId === who.id);

  // Extract detected context entities from message history
  const recentTexts = chatMessages.map((m) => m.text).join(" ");
  const hasContainer = /מכולה|מכולות|רמסע|פסולת/.test(recentTexts);
  const hasDelivery = /תעוד|משלוח|גליה|טכוגרף/.test(recentTexts);
  const hasOrder = /בלה|מלט|חול|גבס|בלוק|דבק|טיט|אספקה|סבב/.test(recentTexts);

  let currentTopic = "פנייה כללית / שירות";
  if (hasContainer) currentTopic = "מכולת פסולת 8 קוב (הצבה/החלפה/פינוי)";
  else if (hasDelivery) currentTopic = "מעגל תעודות משלוח וטכוגרף";
  else if (hasOrder) currentTopic = "הזמנת חומרי בניין ושיבוץ אספקה";

  const filtered = chatMessages.filter(
    (m) => !search.trim() || m.text.toLowerCase().includes(search.toLowerCase()),
  );

  const copyTranscript = () => {
    const transcript = chatMessages
      .map((m) => `[${m.time}] ${m.out ? who.name : "נועה AI"}:\n${m.text}\n`)
      .join("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const smartPrompts = [
    hasContainer
      ? "מה הסטטוס של המכולה ומועד ההחלפה המתוכנן?"
      : "מה סטטוס שיבוץ ההזמנה בסידור העבודה של ראמי?",
    `לשבץ אספקה מוקדמת מחר עבור ${who.name}`,
    "האם ראמי כבר אישר את ההזמנה בספרה 1?",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="glass flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-header px-5 py-3.5 text-header-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">
                יומן היסטוריה והקשר שיחה — {who.name}
              </h2>
              <p className="text-xs opacity-80">
                {chatMessages.length} אינטראקציות מתועדות · נשמרות בזיכרון המערכת
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Context Summary Banner */}
        <div className="border-b bg-accent/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>תמונת מצב והקשר לשאילתות חדשות</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyTranscript}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                title="העתקת תמלול השיחה"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? "הועתק!" : "העתק תמלול"}</span>
              </button>
              {chatMessages.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  title="מחיקת היסטוריית השיחה"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>איפוס יומן</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
            <div className="rounded-lg bg-card p-2.5 border border-border shadow-2xs">
              <span className="text-[11px] text-muted-foreground block">נושא אחרון שזוהה:</span>
              <span className="font-semibold text-foreground truncate block">{currentTopic}</span>
            </div>
            <div className="rounded-lg bg-card p-2.5 border border-border shadow-2xs">
              <span className="text-[11px] text-muted-foreground block">אתר פעיל ברקע:</span>
              <span className="font-semibold text-foreground truncate block">
                {who.address || "לפי כרטיס לקוח"}
              </span>
            </div>
            <div className="rounded-lg bg-card p-2.5 border border-border shadow-2xs">
              <span className="text-[11px] text-muted-foreground block">משאית מועדפת:</span>
              <span className="font-semibold text-foreground truncate block">
                {who.preferredVehicle || "חכמת (מרצדס מנוף 12 טון)"}
              </span>
            </div>
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">
              ⚡ הזרקת הקשר מוכן ישירות לשאילתה חדשה:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {smartPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectContextPrompt(p);
                    onClose();
                  }}
                  className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <CornerDownLeft className="h-3 w-3" />
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b bg-card px-4 py-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש בהיסטוריית ההודעות לפי מילות מפתח (מלט, בלה, מכולה...)..."
              className="w-full rounded-lg border border-input bg-card py-1.5 pr-8 pl-3 text-xs outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="absolute top-2 right-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Message Log Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <History className="h-10 w-10 opacity-30 mb-2" />
              <p className="text-sm font-medium">אין היסטוריית אינטראקציות להצגה</p>
              <p className="text-xs mt-1">
                כל שיחה חדשה שמתבצעת עם הפונה נרשמת ונשמרת כאן אוטומטית.
              </p>
            </div>
          ) : (
            filtered.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col rounded-xl border p-3 text-xs shadow-2xs transition-shadow hover:shadow-xs ${
                  m.out
                    ? "border-primary/20 bg-primary/5 mr-0 ml-6"
                    : "border-border bg-card ml-0 mr-6"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between border-b pb-1 border-border/40">
                  <div className="flex items-center gap-1.5 font-bold">
                    {m.out ? (
                      <>
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>פונה: {who.name}</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 dark:text-emerald-400">נועה AI</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{m.time}</span>
                  </div>
                </div>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">{m.text}</div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t bg-card px-5 py-3">
          <div className="text-[11px] text-muted-foreground">
            אינטראקציות נשמרות בדפדפן ומזינות את נועה AI בזמן אמת לשיחות המשך.
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            סגור
          </button>
        </footer>
      </div>
    </div>
  );
}
