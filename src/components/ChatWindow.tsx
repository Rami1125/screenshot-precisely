import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCheck, Check, Send, Truck, History } from "lucide-react";
import noaImg from "@/assets/noa.jpg";
import { Avatar } from "./ProfileModal";
import { MessageHistoryModal } from "./MessageHistoryModal";
import { demoReply, now, playDing, sendToServer, type Msg, type Profile } from "@/lib/noa";

const STEPS = ["הצלבת מחירון קומקס", "בדיקת משקלי משאיות TRUCK_SPECS", "חישוב פקדונות 60002/60060"];

function renderWa(text: string) {
  return text.split("\n").map((line, i) => (
    <div
      key={i}
      className={
        line.startsWith("━")
          ? "my-0.5 overflow-hidden whitespace-nowrap text-muted-foreground/60"
          : ""
      }
    >
      {line
        .split(/(\*[^*]+\*)/g)
        .map((s, j) =>
          s.startsWith("*") && s.endsWith("*") && s.length > 2 ? (
            <b key={j}>{s.slice(1, -1)}</b>
          ) : (
            s
          ),
        )}
      {line === "" && "\u00a0"}
    </div>
  ));
}

export function ChatWindow({
  who,
  messages,
  onAdd,
  onBack,
  onOpenProfile,
  settings,
  onClearChat,
}: {
  who: Profile;
  messages: Msg[];
  onAdd: (m: Msg) => void;
  onBack: () => void;
  onOpenProfile: () => void;
  settings: { serverUrl: string; apiKey: string };
  onClearChat?: () => void;
}) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "thinking" | "typing">("idle");
  const [showHistory, setShowHistory] = useState(false);
  const [typed, setTyped] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase, typed]);

  const send = async () => {
    const t = text.trim();
    if (!t || phase !== "idle") return;
    setText("");
    const mine: Msg = {
      id: crypto.randomUUID(),
      chatId: who.id,
      out: true,
      text: t,
      time: now(),
      read: false,
    };
    onAdd(mine);
    setPhase("thinking");
    let reply = demoReply(t, who, [...messages, mine]);
    if (settings.serverUrl) {
      try {
        await sendToServer(settings.serverUrl, settings.apiKey, who, t);
        reply = "✅ *ההודעה נקלטה בשרת נועה*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" + reply;
      } catch (e) {
        reply = `⚠️ שרת נועה לא זמין (${(e as Error).message}) — מענה מקומי:\n\n` + reply;
      }
    }
    await new Promise((r) => setTimeout(r, 2400));
    setPhase("typing");
    await new Promise((r) => setTimeout(r, 900));
    for (let i = 0; i <= reply.length; i += 3) {
      setTyped(reply.slice(0, i));
      await new Promise((r) => setTimeout(r, 12));
    }
    setTyped(null);
    setPhase("idle");
    onAdd({ id: crypto.randomUUID(), chatId: who.id, out: false, text: reply, time: now() });
    playDing(/818\d{3}|סטייה/.test(t));
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 bg-header px-3 py-2.5 text-header-foreground">
        <button onClick={onBack} className="md:hidden" aria-label="חזרה">
          <ArrowRight />
        </button>
        <div className="relative">
          <img
            src={noaImg}
            alt="נועה"
            width={42}
            height={42}
            className="h-[42px] w-[42px] rounded-full object-cover"
          />
          <span className="online-pulse absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-header bg-online" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate font-semibold">נועה AI · {who.name}</span>
            {who.comaxId && (
              <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
                #{who.comaxId}
              </span>
            )}
            {who.containerDays && (
              <span className="rounded bg-amber-400/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
                מכולה: {who.containerDays}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={phase !== "idle" ? "font-medium text-online" : "opacity-80"}>
              {phase === "thinking" ? "חושבת..." : phase === "typing" ? "מקלידה..." : "מחוברת"}
            </span>
            {who.preferredVehicle && (
              <span className="hidden sm:inline text-white/70">· {who.preferredVehicle}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs text-header-foreground transition-colors hover:bg-black/30"
            title="יומן היסטוריית אינטראקציות והקשר לשאילתות"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">הקשר</span>
            <span className="rounded-full bg-primary px-1.5 py-0.2 text-[10px] font-bold text-primary-foreground">
              {messages.length}
            </span>
          </button>
          <button onDoubleClick={onOpenProfile} title="לחיצה כפולה לעריכת כרטיס">
            <Avatar p={who} size={36} />
          </button>
        </div>
      </header>

      {who.aiKnowledge && (
        <div
          onClick={onOpenProfile}
          className="flex cursor-pointer items-center justify-between border-b bg-accent/60 px-3.5 py-1.5 text-xs text-accent-foreground transition-colors hover:bg-accent/80"
          title="לחץ לעריכת כרטיס פונה וידע נועה"
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0 font-bold text-primary">🧠 ידע נועה:</span>
            <span className="truncate text-foreground/90">{who.aiKnowledge}</span>
          </div>
          <span className="mr-2 shrink-0 text-[10px] text-muted-foreground">עריכה ✏️</span>
        </div>
      )}

      <div className="chat-doodle flex-1 space-y-1.5 overflow-y-auto px-3 py-4 sm:px-8">
        {messages.length === 0 && (
          <div className="mx-auto w-fit rounded-lg bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            🔒 שיחה עם נועה בשם {who.name}. כתבו הזמנה, "מכולה" או "תעודות".
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {phase === "thinking" && (
          <div className="max-w-[80%] rounded-xl rounded-tr-none bg-bubble-in px-3 py-2 shadow-sm">
            <div className="shimmer-text text-sm font-medium">נועה חושבת ומצליבה נתונים...</div>
            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              {STEPS.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
            <div className="mt-2 h-1 overflow-hidden rounded bg-muted">
              <div className="progress-bar h-full bg-primary" />
            </div>
          </div>
        )}
        {phase === "typing" && typed === null && (
          <div className="flex w-fit gap-1 rounded-xl rounded-tr-none bg-bubble-in px-4 py-3 shadow-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="dot-bounce h-2 w-2 rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        {typed !== null && (
          <Bubble m={{ id: "t", chatId: "", out: false, text: typed, time: now() }} />
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 bg-secondary px-3 py-2">
        <Truck className="h-5 w-5 text-muted-foreground" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="הקלידו הודעה"
          className="flex-1 rounded-full bg-card px-4 py-2.5 text-sm outline-none"
        />
        <button
          onClick={send}
          aria-label="שליחה"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Send className="h-5 w-5 -scale-x-100" />
        </button>
      </div>

      <MessageHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        who={who}
        messages={messages}
        onSelectContextPrompt={(p) => setText(p)}
        onClearHistory={() => {
          if (onClearChat) onClearChat();
          setShowHistory(false);
        }}
      />
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  return (
    <div className={`flex ${m.out ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 pb-1 pt-1.5 text-sm leading-relaxed shadow-sm sm:max-w-[65%] ${m.out ? "rounded-tr-none bg-bubble-out" : "rounded-tl-none bg-bubble-in"}`}
      >
        <div className="break-words">{renderWa(m.text)}</div>
        <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
          {m.time}
          {m.out &&
            (m.read ? (
              <CheckCheck className="h-3.5 w-3.5 text-read" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            ))}
        </div>
      </div>
    </div>
  );
}
