import { useState } from "react";
import {
  DNA_KNOWLEDGE,
  HAREL_TASKS,
  INJECTED_INQUIRIES,
  SPEECH_STYLE,
  type KnowledgeItem,
} from "@/lib/knowledgeData";
import { BookOpen, CheckCircle2, Clock, MessageSquare, Search, Sparkles, X } from "lucide-react";

export function KnowledgeModal({
  isOpen,
  onClose,
  onSelectCustomerPhone,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomerPhone?: (phone: string) => void;
}) {
  const [tab, setTab] = useState<"dna" | "tasks" | "inquiries" | "style">("dna");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("הכל");

  if (!isOpen) return null;

  const categories = [
    "הכל",
    ...Array.from(new Set(DNA_KNOWLEDGE.map((k) => k.category || "כללי"))),
  ];

  const filteredDna = DNA_KNOWLEDGE.filter((k) => {
    const matchCat = selectedCategory === "הכל" || (k.category || "כללי") === selectedCategory;
    const matchText =
      !search ||
      k.text.toLowerCase().includes(search.toLowerCase()) ||
      k.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchText;
  });

  const filteredInquiries = INJECTED_INQUIRIES.filter(
    (iq) =>
      !search ||
      iq.customerName.toLowerCase().includes(search.toLowerCase()) ||
      iq.site.toLowerCase().includes(search.toLowerCase()) ||
      iq.details.toLowerCase().includes(search.toLowerCase()) ||
      iq.phone.includes(search),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="glass flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-header px-5 py-4 text-header-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">מאגר הידע המבצעי של נועה AI</h2>
              <p className="text-xs opacity-80">ח. סבן חומרי בניין (1994) בע"מ · ידע מוזרק חי</p>
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

        {/* Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-5 py-2.5">
          <div className="flex gap-1.5">
            <button
              onClick={() => setTab("dna")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === "dna"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              חוקי ברזל ו-DNA ({DNA_KNOWLEDGE.length})
            </button>
            <button
              onClick={() => setTab("tasks")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === "tasks"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              משימות ומעקב מכולות ({HAREL_TASKS.length})
            </button>
            <button
              onClick={() => setTab("inquiries")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === "inquiries"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              פניות לקוחות אחרונות ({INJECTED_INQUIRIES.length})
            </button>
            <button
              onClick={() => setTab("style")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === "style"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              סגנון דיבור ופקודות
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש במאגר..."
              className="w-full rounded-lg border border-input bg-card py-1.5 pr-8 pl-3 text-xs outline-none focus:ring-1 focus:ring-ring"
            />
            <Search className="absolute top-2 right-2.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "dna" && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                      selectedCategory === c
                        ? "bg-primary text-primary-foreground font-medium"
                        : "bg-card border border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredDna.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 shadow-xs transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                          {item.id.toUpperCase()} · {item.category || "כללי"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          מאת: {item.author}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
                📌 משימות פעילות ומעקבי מכולות שמוזרקים לנועה, כולל התראות סיום שכירות (10 ימים).
              </div>
              <div className="space-y-2.5">
                {HAREL_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className={`flex flex-col gap-2 rounded-xl border p-3.5 shadow-xs ${
                      task.status === "pending"
                        ? "border-amber-500/40 bg-amber-500/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">
                        {task.customerName ? `${task.customerName} · ` : ""}
                        {task.id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          task.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {task.status === "pending" ? "בטיפול / ממתין לפעולה" : "הושלם"}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground">{task.text}</p>
                    {task.endDate && (
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>תאריך יעד: {task.endDate}</span>
                        {task.site && <span>· אתר: {task.site}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "inquiries" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
                פניות לקוחות אחרונות שהוזרקו לנועה AI. ניתן ללחוץ על פנייה כדי לראות את ההקשר המלא.
              </div>
              <div className="space-y-2.5">
                {filteredInquiries.map((iq) => (
                  <div
                    key={iq.id}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{iq.customerName}</span>
                        <span className="text-xs text-muted-foreground" dir="ltr">
                          {iq.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">{iq.displayTime}</span>
                        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          {iq.urgency}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      📍 <b>אתר:</b> {iq.site}
                    </div>
                    <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-foreground whitespace-pre-wrap">
                      {iq.details}
                    </div>
                    {onSelectCustomerPhone && (
                      <div className="mt-1 flex justify-end">
                        <button
                          onClick={() => {
                            onSelectCustomerPhone(iq.phone);
                            onClose();
                          }}
                          className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          מעבר לצ'אט עם הלקוח ←
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "style" && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <h3 className="mb-2 font-bold text-sm text-foreground">
                  הוראות סגנון ודיבור (Speech Style):
                </h3>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>
                      <b>סגנון פינג-פונג:</b> מענה קצר, חד ותמציתי ביותר, ללא הקדמות וללא מילים
                      מיותרות.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>
                      <b>מקסימום 2 משפטים:</b> הגבלת אורך תגובה לשני משפטים לכל היותר.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>
                      <b>שאלה אחת בסוף:</b> תמיד לסיים בשאלה אחת ממוקדת לסגירת פרטי האספקה או
                      ההזמנה.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>
                      <b>מצב פקודות:</b> manual_on (שליטה ידנית של ראמי, אישור בספרה 1).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>
                      <b>השתקה אנושית (Human Mute):</b> כאשר ראמי מקליד בשיחה פרטית, נועה משתתקת
                      באותו צ'אט למשך שעתיים.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-3.5">
                  <h4 className="mb-1 font-bold text-xs text-foreground">
                    מחסן 4 (החרש 10, הוד השרון)
                  </h4>
                  <p className="text-muted-foreground">
                    ניהול: <b>אורן</b>. חומרים כבדים, מלט, אגרגטים, טיט, מכולות פסולת 8 קוב. משאית:{" "}
                    <b>חכמת (מרצדס מנוף 12 טון, 615-41-002)</b>.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5">
                  <h4 className="mb-1 font-bold text-xs text-foreground">
                    מחסן 1 (התלמיד 6, הוד השרון)
                  </h4>
                  <p className="text-muted-foreground">
                    ניהול: <b>תמיר ודורון</b>. גבס, פרופילים (חבילות 10 יח'), צבעים, שפכטל וכלי
                    עבודה. משאית: <b>עלי (איסוזו פלטה 5.5 טון, 651-51-701)</b>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t bg-card px-5 py-3">
          <div className="text-[11px] text-muted-foreground">
            מוזרק ומופעל בתוך מנוע נועה AI · סה"כ {DNA_KNOWLEDGE.length} חוקי DNA,{" "}
            {HAREL_TASKS.length} משימות, {INJECTED_INQUIRIES.length} פניות
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
