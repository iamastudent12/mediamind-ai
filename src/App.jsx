import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Smile,
  Newspaper,
  BarChart3,
  UserCircle2,
  Phone,
  MessageSquare,
  ShieldAlert,
  BookMarked,
  Flame,
  TrendingUp,
  CalendarDays,
  Bell,
  Lock,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------

const MOOD_TAGS = [
  "Anxious",
  "Stressed",
  "Hopeful",
  "Tired",
  "Overwhelmed",
  "Calm",
  "Motivated",
  "Sad",
  "Frustrated",
];

const HISTORY = [
  { day: "Mon", score: 4, tag: "Stressed" },
  { day: "Tue", score: 5, tag: "Anxious" },
  { day: "Wed", score: 3, tag: "Sad" },
  { day: "Thu", score: 6, tag: "Calm" },
  { day: "Fri", score: 7, tag: "Hopeful" },
  { day: "Sat", score: 8, tag: "Calm" },
  { day: "Sun", score: 7, tag: "Hopeful" },
];

const MOOD_BANDS = [
  { id: "struggling", label: "Struggling", range: [1, 3] },
  { id: "low", label: "Low", range: [4, 5] },
  { id: "steady", label: "Steady", range: [6, 7] },
  { id: "thriving", label: "Thriving", range: [8, 10] },
];

function bandForScore(score) {
  return MOOD_BANDS.find((b) => score >= b.range[0] && score <= b.range[1]) || MOOD_BANDS[1];
}

const ARTICLE_LIBRARY = {
  struggling: [
    {
      id: "s1",
      title: "The Physiology of a Panic Response, and How to Interrupt It",
      summary:
        "A breakdown of what happens in the nervous system during acute anxiety, with grounding techniques clinicians use in session.",
      source: "American Psychological Association",
      readTime: "6 min",
      tags: ["Anxious", "Overwhelmed"],
    },
    {
      id: "s2",
      title: "When Sadness Lingers: Telling Grief Apart from Depression",
      summary:
        "Clinical markers that distinguish situational low mood from something that may need professional support.",
      source: "National Institute of Mental Health",
      readTime: "8 min",
      tags: ["Sad"],
    },
    {
      id: "s3",
      title: "Box Breathing: A 4-Step Reset for a Racing Mind",
      summary:
        "How a simple paced-breathing pattern shifts the body out of fight-or-flight, drawn from military and clinical resilience training.",
      source: "Mayo Clinic",
      readTime: "4 min",
      tags: ["Anxious", "Overwhelmed", "Stressed"],
    },
    {
      id: "s4",
      title: "You Are Not in Danger Right Now: A Grounding Script",
      summary:
        "A 5-senses grounding exercise clinicians use to pull the body out of a spiral and back into the present moment.",
      source: "National Institute of Mental Health",
      readTime: "3 min",
      tags: ["Overwhelmed", "Anxious"],
    },
    {
      id: "s5",
      title: "What to Do in the First Hour of a Bad Day",
      summary:
        "A minimal, low-effort checklist designed for days when even small tasks feel like too much.",
      source: "Harvard Health Publishing",
      readTime: "5 min",
      tags: ["Sad", "Tired", "Overwhelmed"],
    },
  ],
  low: [
    {
      id: "l1",
      title: "Cognitive Reframing: Naming the Thought Before It Names You",
      summary:
        "A CBT technique for catching distorted thinking patterns in the moment they happen, not after.",
      source: "Journal of Clinical Psychology",
      readTime: "7 min",
      tags: ["Stressed", "Frustrated", "Sad"],
    },
    {
      id: "l2",
      title: "Behavioral Activation: Using Motivation as a Result, Not a Requirement",
      summary:
        "Research-backed sequencing — action first, motivation follows — for days that feel emotionally flat.",
      source: "Journal of Clinical Psychology",
      readTime: "6 min",
      tags: ["Tired", "Sad", "Stressed"],
    },
    {
      id: "l3",
      title: "The Case for Doing Nothing: Rest as a Clinical Intervention",
      summary:
        "Why unstructured downtime is increasingly prescribed alongside therapy, and how to do it without guilt.",
      source: "Harvard Health Publishing",
      readTime: "5 min",
      tags: ["Tired", "Overwhelmed", "Stressed"],
    },
    {
      id: "l4",
      title: "Managing Frustration Before It Becomes a Bigger Story",
      summary:
        "A short-fuse framework for catching irritation early, before it snowballs into a worse mood or an argument.",
      source: "American Psychological Association",
      readTime: "5 min",
      tags: ["Frustrated", "Stressed"],
    },
    {
      id: "l5",
      title: "Low-Energy Days: What Actually Helps vs. What Just Feels Productive",
      summary:
        "A clinician's guide to telling restorative rest apart from avoidance when your energy is running low.",
      source: "Mayo Clinic",
      readTime: "6 min",
      tags: ["Tired", "Sad"],
    },
  ],
  steady: [
    {
      id: "st1",
      title: "Maintaining a Steady Baseline When Things Feel Okay",
      summary:
        "Stability isn't the absence of work — small daily habits that protect a calm state from eroding.",
      source: "American Psychological Association",
      readTime: "5 min",
      tags: ["Calm"],
    },
    {
      id: "st2",
      title: "The Weekly Check-In: A 10-Minute Habit That Prevents Relapse",
      summary:
        "A structured self-review clinicians recommend for catching small dips before they become bigger ones.",
      source: "National Institute of Mental Health",
      readTime: "6 min",
      tags: ["Calm", "Hopeful"],
    },
    {
      id: "st3",
      title: "Turning 'Fine' Into 'Good': Small Adjustments That Compound",
      summary:
        "Incremental changes — sleep timing, movement, light exposure — that shift a neutral mood upward over weeks.",
      source: "Harvard Health Publishing",
      readTime: "5 min",
      tags: ["Calm", "Hopeful", "Motivated"],
    },
    {
      id: "st4",
      title: "Boredom Isn't a Problem to Solve",
      summary:
        "Why a flat, uneventful mood is often a sign of regulation working correctly, not something to fix.",
      source: "Journal of Clinical Psychology",
      readTime: "4 min",
      tags: ["Calm", "Tired"],
    },
    {
      id: "st5",
      title: "Redirecting Frustration Into Motivation",
      summary:
        "How clinicians reframe mild irritation as useful signal about unmet needs, rather than something to suppress.",
      source: "Mayo Clinic",
      readTime: "5 min",
      tags: ["Frustrated", "Motivated"],
    },
  ],
  thriving: [
    {
      id: "t1",
      title: "Gratitude Journaling: What the Evidence Actually Supports",
      summary:
        "A look at the effect sizes behind gratitude practice, and how to structure one that isn't performative.",
      source: "Harvard Health Publishing",
      readTime: "5 min",
      tags: ["Hopeful", "Calm"],
    },
    {
      id: "t2",
      title: "Channeling High Energy Days Without Burning Out by Thursday",
      summary:
        "How to pace an upswing in mood and energy so it becomes sustainable momentum rather than a crash.",
      source: "Mayo Clinic",
      readTime: "6 min",
      tags: ["Motivated", "Hopeful"],
    },
    {
      id: "t3",
      title: "Building a Relapse Plan While You're Doing Well",
      summary:
        "Clinicians recommend writing your own early-warning signs down during stable periods — here's a template.",
      source: "National Institute of Mental Health",
      readTime: "7 min",
      tags: ["Hopeful", "Calm", "Motivated"],
    },
    {
      id: "t4",
      title: "Turning Motivation Into a System Before It Fades",
      summary:
        "Why relying on a good mood to sustain new habits fails, and how to lock in structure while momentum is high.",
      source: "American Psychological Association",
      readTime: "6 min",
      tags: ["Motivated"],
    },
    {
      id: "t5",
      title: "Sharing the Good Days: Why Talking About Wins Matters Clinically",
      summary:
        "Research on why naming positive moments out loud extends their effect on mood more than journaling alone.",
      source: "Journal of Clinical Psychology",
      readTime: "4 min",
      tags: ["Hopeful", "Calm"],
    },
  ],
};

function matchArticles(score, tags) {
  const band = bandForScore(score);
  const pool = ARTICLE_LIBRARY[band.id];
  return [...pool]
    .map((a) => ({ ...a, overlap: a.tags.filter((t) => tags.includes(t)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 5);
}

const TOKENS = {
  ink: "#0B2136",
  sub: "#4E6478",
  line: "#D8E4EE",
  panel: "#FFFFFF",
  bgTop: "#EAF3FB",
  bgBottom: "#F5F9FC",
  primary: "#1D4E89",
  primaryDark: "#123A66",
  accent: "#2E8B8B",
  crisis: "#B3411E",
  crisisBg: "#FDF1EC",
};

function scoreColor(score) {
  if (score <= 3) return "#B3411E";
  if (score <= 5) return "#C48A1D";
  if (score <= 7) return "#2E8B8B";
  return "#1D6E4B";
}

function scoreLabel(score) {
  if (score <= 2) return "Very low";
  if (score <= 4) return "Low";
  if (score <= 6) return "Moderate";
  if (score <= 8) return "Good";
  return "Very good";
}

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {eyebrow && (
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: TOKENS.accent, marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{ fontFamily: "Georgia, 'Iowan Old Style', serif", fontSize: 24, color: TOKENS.ink, margin: 0, fontWeight: 700 }}>
        {title}
      </h2>
      {sub && <p style={{ color: TOKENS.sub, fontSize: 14, marginTop: 6, maxWidth: 560 }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: TOKENS.panel, border: `1px solid ${TOKENS.line}`, borderRadius: 14, boxShadow: "0 1px 2px rgba(11,33,54,0.04)", ...style }}>
      {children}
    </div>
  );
}

function CheckInTab({ score, setScore, tags, toggleTag, submitted, onSubmit }) {
  return (
    <div>
      <SectionHeading eyebrow="Today" title="How are you, right now?" sub="Your check-in shapes what MediaMind surfaces next — there's no wrong answer, just data your future self can use." />
      <Card style={{ padding: "28px 28px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TOKENS.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>Mood score</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 700, color: scoreColor(score), lineHeight: 1 }}>{score}</span>
            <span style={{ color: TOKENS.sub, fontSize: 14 }}>/ 10 · {scoreLabel(score)}</span>
          </div>
        </div>
        <div style={{ marginTop: 22, marginBottom: 6 }}>
          <input type="range" min={1} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="mm-slider"
            style={{ width: "100%", background: `linear-gradient(90deg, #B3411E 0%, #C48A1D 33%, #2E8B8B 66%, #1D6E4B 100%)` }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: TOKENS.sub, marginTop: 6 }}>
            <span>1 · struggling</span><span>10 · thriving</span>
          </div>
        </div>
        <div style={{ marginTop: 28 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TOKENS.sub, letterSpacing: "0.04em", textTransform: "uppercase" }}>What's driving it? (optional, pick any)</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            {MOOD_TAGS.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)}
                  style={{ padding: "9px 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    border: active ? `1.5px solid ${TOKENS.primary}` : `1.5px solid ${TOKENS.line}`,
                    background: active ? TOKENS.primary : "#fff", color: active ? "#fff" : TOKENS.ink, transition: "all 0.15s ease" }}>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={onSubmit}
          style={{ marginTop: 28, width: "100%", padding: "14px 0", borderRadius: 10, border: "none", background: TOKENS.primary, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Save today's check-in
        </button>
        {submitted && (
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "#EAF6F0", color: "#1D6E4B", fontSize: 13.5, fontWeight: 600 }}>
            Logged. Head to the Content Feed tab — it's already matched to how you're feeling.
          </div>
        )}
      </Card>
    </div>
  );
}

function FeedTab({ submittedScore, submittedTags }) {
  const matched = useMemo(() => (submittedScore == null ? [] : matchArticles(submittedScore, submittedTags)), [submittedScore, submittedTags]);
  if (submittedScore == null) {
    return (
      <div>
        <SectionHeading eyebrow="Content feed" title="Your content feed" />
        <Card style={{ padding: "40px 28px", textAlign: "center" }}>
          <p style={{ color: TOKENS.sub, fontSize: 14.5, margin: 0 }}>Complete today's check-in first — your feed is matched to the mood score and tags you submit.</p>
        </Card>
      </div>
    );
  }
  const band = bandForScore(submittedScore);
  return (
    <div>
      <SectionHeading eyebrow="Matched to today's check-in" title="Your content feed"
        sub={`Ranked for a mood score of ${submittedScore} (${band.label.toLowerCase()})${submittedTags.length ? ` and ${submittedTags.join(", ").toLowerCase()}` : ""}. Every piece is sourced from a clinical or peer-reviewed publisher.`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {matched.map((a, i) => (
          <Card key={a.id} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TOKENS.primary, background: "#EAF3FB", padding: "3px 9px", borderRadius: 999 }}>
                    {i === 0 ? "Best match" : `Match #${i + 1}`}
                  </span>
                  <span style={{ fontSize: 12, color: TOKENS.sub }}>{a.readTime} read</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: TOKENS.ink, lineHeight: 1.35 }}>{a.title}</h3>
                <p style={{ margin: "8px 0 10px", fontSize: 14, color: TOKENS.sub, lineHeight: 1.55 }}>{a.summary}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: TOKENS.accent, fontWeight: 700 }}>
                  <BookMarked size={13} />{a.source}
                </div>
              </div>
              <ChevronRight size={20} color={TOKENS.sub} style={{ marginTop: 4, flexShrink: 0 }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const v = payload[0].value;
  return (
    <div style={{ background: TOKENS.ink, color: "#fff", padding: "8px 12px", borderRadius: 8, fontSize: 12.5 }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div>Mood score: {v}/10</div>
    </div>
  );
}

function DashboardTab({ score }) {
  const data = useMemo(() => [...HISTORY.slice(0, 6), { day: "Today", score }], [score]);
  const avg = (data.reduce((s, d) => s + d.score, 0) / data.length).toFixed(1);
  const best = data.reduce((a, b) => (b.score > a.score ? b : a));
  const streak = 5;
  return (
    <div>
      <SectionHeading eyebrow="Last 7 days" title="Progress dashboard" sub="A weekly view of your logged mood scores, updated live as you check in." />
      <Card style={{ padding: "22px 22px 8px", marginBottom: 18 }}>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={TOKENS.line} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: TOKENS.sub }} axisLine={{ stroke: TOKENS.line }} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: TOKENS.sub }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(29,78,137,0.06)" }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill={scoreColor(d.score)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <StatCard icon={<TrendingUp size={18} color={TOKENS.primary} />} label="7-day average" value={`${avg}/10`} />
        <StatCard icon={<Flame size={18} color={TOKENS.primary} />} label="Check-in streak" value={`${streak} days`} />
        <StatCard icon={<CalendarDays size={18} color={TOKENS.primary} />} label="Best day" value={best.day} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card style={{ padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>{icon}<span style={{ fontSize: 12.5, color: TOKENS.sub, fontWeight: 600 }}>{label}</span></div>
      <div style={{ fontSize: 22, fontWeight: 700, color: TOKENS.ink, fontFamily: "Georgia, serif" }}>{value}</div>
    </Card>
  );
}

function ToggleRow({ icon, title, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${TOKENS.line}` }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ marginTop: 2, color: TOKENS.primary }}>{icon}</div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: TOKENS.ink }}>{title}</div>
          <div style={{ fontSize: 13, color: TOKENS.sub, marginTop: 2, maxWidth: 340 }}>{desc}</div>
        </div>
      </div>
      <button onClick={() => onChange(!value)}
        style={{ width: 44, height: 26, borderRadius: 999, border: "none", background: value ? TOKENS.primary : "#D8E4EE", position: "relative", cursor: "pointer", flexShrink: 0, marginLeft: 12 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 21 : 3, transition: "left 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

function ProfileTab() {
  const [reminders, setReminders] = useState(true);
  const [shareTrends, setShareTrends] = useState(false);
  const [quietTone, setQuietTone] = useState(true);
  return (
    <div>
      <SectionHeading eyebrow="Account" title="Profile & settings" sub="Manage how MediaMind reaches you and reviews your data." />
      <Card style={{ padding: "8px 22px", marginBottom: 22 }}>
        <ToggleRow icon={<Bell size={18} />} title="Daily check-in reminder" desc="A gentle nudge at 8:00 PM if you haven't logged a mood today." value={reminders} onChange={setReminders} />
        <ToggleRow icon={<TrendingUp size={18} />} title="Share trends with my care team" desc="Lets a connected therapist or provider view your 7-day mood dashboard." value={shareTrends} onChange={setShareTrends} />
        <div style={{ borderBottom: "none" }}>
          <ToggleRow icon={<Lock size={18} />} title="Low-stimulation mode" desc="Reduces motion and uses calmer copy across the app on low mood days." value={quietTone} onChange={setQuietTone} />
        </div>
      </Card>
      <Card style={{ padding: "22px 24px", background: TOKENS.crisisBg, border: `1.5px solid #E8C4B4` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <ShieldAlert size={20} color={TOKENS.crisis} />
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: TOKENS.crisis }}>Crisis resources</h3>
        </div>
        <p style={{ fontSize: 13.5, color: "#5C2A16", margin: "0 0 16px", lineHeight: 1.5 }}>
          If you're in immediate danger, call 911. These lines are free, confidential, and staffed around the clock.
        </p>
        <ResourceRow icon={<Phone size={17} color={TOKENS.crisis} />} title="988 Suicide & Crisis Lifeline" desc="Call or text 988 — free and confidential, 24/7." />
        <ResourceRow icon={<MessageSquare size={17} color={TOKENS.crisis} />} title="Crisis Text Line" desc="Text HOME to 741741 to reach a trained counselor." />
        <ResourceRow icon={<Phone size={17} color={TOKENS.crisis} />} title="911" desc="For emergencies where someone's safety is at immediate risk." last />
      </Card>
    </div>
  );
}

function ResourceRow({ icon, title, desc, last }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: last ? "none" : "1px solid #E8C4B4" }}>
      <div style={{ marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#5C2A16" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#7A3B22", marginTop: 1 }}>{desc}</div>
      </div>
    </div>
  );
}

const TABS = [
  { id: "checkin", label: "Daily Check-In", icon: Smile },
  { id: "feed", label: "Content Feed", icon: Newspaper },
  { id: "dashboard", label: "Progress", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserCircle2 },
];

export default function MediaMindAI() {
  const [tab, setTab] = useState("checkin");
  const [score, setScore] = useState(6);
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(null);
  const [submittedTags, setSubmittedTags] = useState([]);

  const toggleTag = (t) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const handleSubmit = () => {
    setSubmittedScore(score);
    setSubmittedTags(tags);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${TOKENS.bgTop} 0%, ${TOKENS.bgBottom} 55%)`,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: TOKENS.ink, padding: "0 0 60px" }}>
      <style>{`
        .mm-slider { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 999px; outline: none; }
        .mm-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid ${TOKENS.primary}; box-shadow: 0 1px 4px rgba(11,33,54,0.3); cursor: pointer; }
        .mm-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid ${TOKENS.primary}; box-shadow: 0 1px 4px rgba(11,33,54,0.3); cursor: pointer; }
        .mm-tab-btn:focus-visible, .mm-slider:focus-visible { outline: 2px solid ${TOKENS.primary}; outline-offset: 2px; }
      `}</style>

      <header style={{ padding: "28px 24px 20px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: TOKENS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Smile size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700 }}>MediaMind <span style={{ color: TOKENS.primary }}>AI</span></div>
            <div style={{ fontSize: 12, color: TOKENS.sub }}>Personalized mental health content</div>
          </div>
        </div>
      </header>

      <nav style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${TOKENS.line}`, borderRadius: 12, padding: 4 }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} className="mm-tab-btn" onClick={() => setTab(t.id)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px", borderRadius: 9,
                  border: "none", cursor: "pointer", background: active ? TOKENS.primary : "transparent", color: active ? "#fff" : TOKENS.sub,
                  fontSize: 11.5, fontWeight: 700, transition: "all 0.15s ease" }}>
                <Icon size={17} />{t.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 0" }}>
        {tab === "checkin" && <CheckInTab score={score} setScore={setScore} tags={tags} toggleTag={toggleTag} submitted={submitted} onSubmit={handleSubmit} />}
        {tab === "feed" && <FeedTab submittedScore={submittedScore} submittedTags={submittedTags} />}
        {tab === "dashboard" && <DashboardTab score={score} />}
        {tab === "profile" && <ProfileTab />}
      </main>
    </div>
  );
}
