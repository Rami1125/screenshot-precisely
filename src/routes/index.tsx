import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings, MapPin } from "lucide-react";
import noaImg from "@/assets/noa.jpg";
import { ChatWindow } from "@/components/ChatWindow";
import { Avatar, ProfileModal } from "@/components/ProfileModal";
import { DEFAULT_PROFILES, loadProfiles, loadSettings, saveProfiles, saveSettings, type Msg, type Profile } from "@/lib/noa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "נועה AI — סידור ח. סבן חומרי בניין" },
      { name: "description", content: "ממשק וואטסאפ לנועה AI: הזמנות, תעודות משלוח, מכולות ופרופילי לקוחות." },
      { property: "og:title", content: "נועה AI — סידור ח. סבן" },
      { property: "og:description", content: "ממשק שיחה לוגיסטי עם נועה AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [settings, setSettings] = useState({ serverUrl: "", apiKey: "" });
  const [active, setActive] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [status, setStatus] = useState<string>("מקומי");

  useEffect(() => { setProfiles(loadProfiles()); setSettings(loadSettings()); }, []);
  useEffect(() => {
    if (!settings.serverUrl) { setStatus("מצב מקומי"); return; }
    fetch(settings.serverUrl.replace(/\/$/, "") + "/status").then((r) => r.json())
      .then((s) => setStatus(s.whatsappConnected ? "וואטסאפ מחובר" : "מתחבר...")).catch(() => setStatus("שרת לא זמין"));
  }, [settings.serverUrl]);

  const who = profiles.find((p) => p.id === active);
  const save = (p: Profile) => { const n = profiles.map((x) => (x.id === p.id ? p : x)); setProfiles(n); saveProfiles(n); setEditing(null); };
  const addMsg = (m: Msg) => setMsgs((prev) => {
    const marked = m.out ? prev : prev.map((x) => (x.chatId === m.chatId && x.out ? { ...x, read: true } : x));
    return [...marked, m];
  });

  return (
    <div dir="rtl" className="mx-auto flex h-[100dvh] max-w-6xl overflow-hidden bg-card md:my-0 md:shadow-xl">
      <aside className={`${who ? "hidden md:flex" : "flex"} w-full flex-col border-l bg-sidebar md:w-[360px]`}>
        <header className="flex items-center gap-3 bg-header px-4 py-3 text-header-foreground">
          <div className="relative">
            <img src={noaImg} alt="נועה" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
            <span className="online-pulse absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-header bg-online" />
          </div>
          <div className="flex-1">
            <div className="font-bold">נועה AI</div>
            <div className="text-xs opacity-80">ח. סבן · {status}</div>
          </div>
          <button onClick={() => setShowSettings(true)} aria-label="הגדרות"><Settings className="h-5 w-5" /></button>
        </header>
        <div className="px-4 py-2 text-[11px] text-muted-foreground">לחיצה כפולה על תמונה לעריכת כרטיס פונה</div>
        <ul className="flex-1 overflow-y-auto">
          {profiles.map((p) => {
            const last = [...msgs].reverse().find((m) => m.chatId === p.id);
            return (
              <li key={p.id} onClick={() => setActive(p.id)} onDoubleClick={() => setEditing(p)}
                className={`flex cursor-pointer items-center gap-3 border-b px-4 py-3 hover:bg-muted ${active === p.id ? "bg-accent" : ""}`}>
                <Avatar p={p} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="truncate font-semibold">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{last?.time}</span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {last ? last.text.replace(/\*/g, "").split("\n")[0] : <><span className={p.category === "אישי-פרטי-משפחה" ? "text-destructive" : ""}>{p.category}</span>{p.address && <> · <MapPin className="inline h-3 w-3" /> {p.address}</>}</>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <a href="https://waze.com/ul?q=%D7%94%D7%97%D7%A8%D7%A9%2010%20%D7%94%D7%95%D7%93%20%D7%94%D7%A9%D7%A8%D7%95%D7%9F" target="_blank" rel="noreferrer"
          className="m-3 rounded-xl bg-accent px-4 py-3 text-sm text-accent-foreground">
          📍 מחסן 4 — החרש 10, הוד השרון · ניווט ב-Waze
        </a>
      </aside>

      <main className={`${who ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        {who ? (
          <ChatWindow who={who} settings={settings} messages={msgs.filter((m) => m.chatId === who.id)} onAdd={addMsg}
            onBack={() => setActive(null)} onOpenProfile={() => setEditing(who)} />
        ) : (
          <div className="chat-doodle flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <img src={noaImg} alt="נועה" width={120} height={120} className="h-28 w-28 rounded-full shadow-lg" />
            <h1 className="text-2xl font-bold">נועה AI</h1>
            <p className="text-sm text-muted-foreground">בחרו שיחה כדי להתחיל</p>
          </div>
        )}
      </main>

      {editing && <ProfileModal profile={editing} onSave={save} onClose={() => setEditing(null)} />}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-3" onClick={() => setShowSettings(false)}>
          <div dir="rtl" className="glass w-full max-w-md space-y-3 rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">חיבור לשרת נועה</h2>
            <input value={settings.serverUrl} onChange={(e) => setSettings({ ...settings, serverUrl: e.target.value })} placeholder="https://noa-server.example.com"
              dir="ltr" className="w-full rounded-lg border bg-card px-3 py-2 text-sm" />
            <input value={settings.apiKey} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} placeholder="API key (אופציונלי)"
              dir="ltr" type="password" className="w-full rounded-lg border bg-card px-3 py-2 text-sm" />
            <p className="text-xs text-muted-foreground">השרת צריך להיות זמין בכתובת ציבורית (HTTPS) ולאפשר גישה מהדפדפן.</p>
            <button onClick={() => { saveSettings(settings); setShowSettings(false); }} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">שמירה</button>
          </div>
        </div>
      )}
    </div>
  );
}
