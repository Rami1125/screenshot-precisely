import { useState } from "react";
import type { Category, Profile } from "@/lib/noa";

const CATS: Category[] = ["קבלן", "לקוח קבוע", "הנהלה", "אישי-פרטי-משפחה"];

export function ProfileModal({ profile, onSave, onClose }: { profile: Profile; onSave: (p: Profile) => void; onClose: () => void }) {
  const [p, setP] = useState(profile);
  const set = (k: keyof Profile) => (e: { target: { value: string } }) => setP({ ...p, [k]: e.target.value });
  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader(); r.onload = () => setP({ ...p, avatar: String(r.result) }); r.readAsDataURL(f);
  };
  const field = (label: string, k: keyof Profile, ph = "") => (
    <label className="flex flex-col gap-1 text-xs text-muted-foreground">
      {label}
      <input value={p[k] as string} onChange={set(k)} placeholder={ph}
        className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-3 sm:items-center" onClick={onClose}>
      <div className="glass max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-bold">כרטיס פונה — {p.name}</h2>
        <div className="mb-4 flex items-center gap-4">
          <Avatar p={p} size={72} />
          <div className="flex flex-1 flex-col gap-2">
            <label className="cursor-pointer rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
              העלאת תמונה
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <input value={p.avatar.startsWith("data:") ? "" : p.avatar} onChange={set("avatar")} placeholder="או כתובת URL לתמונה"
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {field("שם מלא", "name")}
          {field("כינויים", "aliases", "מופרדים בפסיק")}
          {field("טלפון ראשי", "phone")}
          {field("טלפון בינלאומי", "intlPhone")}
          {field("WhatsApp LID", "lid", "xxxx@lid")}
          {field("מספר לקוח קומקס", "comaxId")}
          <label className="flex flex-col gap-1 text-xs text-muted-foreground sm:col-span-2">
            סיווג
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button key={c} type="button" onClick={() => setP({ ...p, category: c })}
                  className={`rounded-full border px-3 py-1 text-xs ${p.category === c ? (c === "אישי-פרטי-משפחה" ? "border-destructive bg-destructive text-destructive-foreground" : "border-primary bg-primary text-primary-foreground") : "bg-card text-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
            {p.category === "אישי-פרטי-משפחה" && <span className="text-destructive">מסונן מהסידור</span>}
          </label>
          <div className="sm:col-span-2">{field("כתובת אתר קבועה", "address")}</div>
          {field("זמני פריקה", "unloadHours", "07:00–12:00")}
          {field("הערות גישה (איתוראן)", "notes")}
          {field("מכולה 8 קוב — ימי שכירות", "containerDays")}
          {field("תאריך פינוי/החלפה", "containerSwap")}
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => onSave(p)} className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground">שמירה</button>
          <button onClick={onClose} className="rounded-lg border bg-card px-4 py-2.5">ביטול</button>
        </div>
      </div>
    </div>
  );
}

export function Avatar({ p, size = 44, src }: { p: { name: string; avatar?: string }; size?: number; src?: string }) {
  const img = src || p.avatar;
  return img ? (
    <img src={img} alt={p.name} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground" style={{ width: size, height: size, fontSize: size / 2.6 }}>
      {p.name.slice(0, 1)}
    </div>
  );
}
