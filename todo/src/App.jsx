import { useState, useEffect, useRef } from "react";

const API = "https://todoapp-2qrt.onrender.com";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0c0e;
    --surface: #141518;
    --surface2: #1c1e23;
    --border: #2a2d35;
    --accent: #d4f04a;
    --accent2: #4af09a;
    --accent3: #f04a7a;
    --text: #f0ede6;
    --muted: #6b6f7a;
    --high: #f04a7a;
    --med: #f0a44a;
    --low: #4af09a;
    --radius: 12px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── NOISE OVERLAY ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  /* ── NAVBAR ── */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem;
    height: 64px;
    background: rgba(11,12,14,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: -0.03em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-logo span {
    display: inline-block;
    width: 8px; height: 8px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.6; }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
  }

  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--text); }

  .nav-cta {
    background: var(--accent);
    color: #0b0c0e !important;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    transition: opacity 0.2s !important;
  }

  .nav-cta:hover { opacity: 0.85; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }

  .hero-glow {
    position: absolute;
    top: 20%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(212,240,74,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.3;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  }

  .hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 0.35rem 1rem;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2rem;
    animation: fadeUp 0.6s ease both;
  }

  .hero-tag::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
  }

  h1.hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.95;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s 0.1s ease both;
    position: relative;
  }

  h1.hero-title em {
    font-style: normal;
    color: var(--accent);
    position: relative;
  }

  h1.hero-title em::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    border-radius: 2px;
  }

  .hero-sub {
    color: var(--muted);
    font-size: 0.95rem;
    max-width: 420px;
    line-height: 1.7;
    margin-bottom: 2.5rem;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    animation: fadeUp 0.6s 0.3s ease both;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    background: var(--accent);
    color: #0b0c0e;
    border: none;
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius);
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212,240,74,0.25);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    padding: 0.75rem 1.75rem;
    border-radius: var(--radius);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }

  .btn-ghost:hover {
    border-color: var(--accent);
    background: rgba(212,240,74,0.05);
  }

  .hero-stats {
    display: flex;
    gap: 3rem;
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .stat {
    text-align: center;
  }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--accent);
    display: block;
  }

  .stat-label {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── SCROLL INDICATOR ── */
  .scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: var(--muted);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    animation: fadeUp 1s 0.8s ease both;
  }

  .scroll-hint .arrow {
    width: 1px; height: 40px;
    background: linear-gradient(var(--border), transparent);
    animation: scrollArrow 1.5s ease-in-out infinite;
  }

  @keyframes scrollArrow {
    0% { transform: scaleY(0); transform-origin: top; }
    50% { transform: scaleY(1); transform-origin: top; }
    51% { transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }

  /* ── TODO SECTION ── */
  .todo-section {
    padding: 5rem 1rem 6rem;
    max-width: 760px;
    margin: 0 auto;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 3rem;
  }

  .section-label h2 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .section-label .line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── INPUT BOX ── */
  .add-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: border-color 0.2s;
  }

  .add-box:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(212,240,74,0.08);
  }

  .add-row {
    display: flex;
    gap: 0.75rem;
  }

  .add-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .add-input::placeholder { color: var(--muted); }
  .add-input:focus { border-color: var(--accent); }

  .priority-select {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.7rem 0.75rem;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .priority-select:focus { border-color: var(--accent); }

  .add-btn {
    background: var(--accent);
    color: #0b0c0e;
    border: none;
    border-radius: 8px;
    padding: 0.7rem 1.25rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.15s, transform 0.15s;
  }

  .add-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── FILTERS & CONTROLS ── */
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .filter-tabs {
    display: flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .filter-tab {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .filter-tab.active {
    background: var(--surface2);
    color: var(--accent);
  }

  .clear-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .clear-btn:hover {
    border-color: var(--accent3);
    color: var(--accent3);
  }

  /* ── PROGRESS ── */
  .progress-bar {
    height: 3px;
    background: var(--surface2);
    border-radius: 2px;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── TODO LIST ── */
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .todo-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: border-color 0.2s, transform 0.15s, box-shadow 0.15s;
    animation: itemIn 0.3s ease both;
    position: relative;
    overflow: hidden;
  }

  .todo-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
  }

  .todo-item.priority-high::before  { background: var(--high); }
  .todo-item.priority-medium::before { background: var(--med); }
  .todo-item.priority-low::before   { background: var(--low); }

  .todo-item:hover {
    border-color: rgba(212,240,74,0.2);
    transform: translateX(3px);
    box-shadow: -3px 0 16px rgba(212,240,74,0.06);
  }

  .todo-item.done-item {
    opacity: 0.5;
  }

  @keyframes itemIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .todo-check {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s;
    color: #0b0c0e;
  }

  .todo-check:hover { border-color: var(--accent); }

  .todo-check.checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .todo-text {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.5;
    transition: color 0.2s;
    word-break: break-word;
  }

  .todo-text.crossed {
    text-decoration: line-through;
    color: var(--muted);
  }

  .todo-edit-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--accent);
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    outline: none;
  }

  .priority-badge {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .badge-high   { background: rgba(240,74,122,0.15); color: var(--high); }
  .badge-medium { background: rgba(240,164,74,0.15); color: var(--med); }
  .badge-low    { background: rgba(74,240,154,0.15); color: var(--low); }

  .todo-actions {
    display: flex;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .icon-btn {
    width: 30px; height: 30px;
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    font-size: 0.8rem;
  }

  .icon-btn:hover { border-color: var(--border); color: var(--text); background: var(--surface2); }
  .icon-btn.del:hover { border-color: var(--accent3); color: var(--accent3); }
  .icon-btn.save:hover { border-color: var(--accent); color: var(--accent); }

  /* ── EMPTY STATE ── */
  .empty {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--muted);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  .empty h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    color: var(--muted);
    margin-bottom: 0.5rem;
  }

  /* ── TOAST ── */
  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    color: var(--text);
    z-index: 200;
    animation: toastIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toast.success { border-color: var(--accent); color: var(--accent); }
  .toast.error   { border-color: var(--accent3); color: var(--accent3); }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── LOADER ── */
  .loader {
    display: flex;
    justify-content: center;
    padding: 2rem;
    gap: 6px;
  }

  .loader span {
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: bounce 0.6s ease-in-out infinite;
  }

  .loader span:nth-child(2) { animation-delay: 0.15s; }
  .loader span:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); opacity: 0.3; }
    50% { transform: translateY(-8px); opacity: 1; }
  }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }

  footer span { color: var(--accent); }
`;

// ── ICONS ──────────────────────────────────────────────────────────
const CheckIcon  = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const EditIcon   = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2L4 10H2V8l6.5-6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const TrashIcon  = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3h9M4 3V2h4v1M5 5.5v3M7 5.5v3M2.5 3l.7 7h5.6l.7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SaveIcon   = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const XIcon      = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;

// ── TOAST HOOK ─────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = (msg, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(() => setToast(null), 2800);
  };

  return [toast, show];
}

// ── MAIN APP ───────────────────────────────────────────────────────
export default function App() {
  const [todos, setTodos]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [completed, setCompleted] = useState(0);
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(false);

  const [newText, setNewText]   = useState("");
  const [newPri, setNewPri]     = useState("medium");
  const [adding, setAdding]     = useState(false);

  const [editId, setEditId]     = useState(null);
  const [editText, setEditText] = useState("");

  const [toast, showToast] = useToast();
  const todoRef = useRef(null);

  // ── API calls ────────────────────────────────────────────────────
  const fetchTodos = async (f = filter) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/get-todos?filter=${f}`);
      const json = await res.json();
      if (json.success) {
        setTodos(json.data);
        setTotal(json.total);
        setCompleted(json.completed);
      }
    } catch {
      showToast("Cannot reach server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(filter); }, [filter]);

  const addTodo = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    try {
      const res  = await fetch(`${API}/add-todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText.trim(), priority: newPri }),
      });
      const json = await res.json();
      if (json.success) {
        setNewText(""); fetchTodos(filter);
        showToast("Task added");
      } else showToast(json.message, "error");
    } catch {
      showToast("Error adding task", "error");
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (todo) => {
    try {
      const res  = await fetch(`${API}/update-todos/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      const json = await res.json();
      if (json.success) fetchTodos(filter);
    } catch {
      showToast("Error updating task", "error");
    }
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res  = await fetch(`${API}/update-todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText.trim() }),
      });
      const json = await res.json();
      if (json.success) { setEditId(null); fetchTodos(filter); showToast("Task updated"); }
    } catch {
      showToast("Error saving", "error");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res  = await fetch(`${API}/delete-todos/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchTodos(filter); showToast("Task deleted"); }
    } catch {
      showToast("Error deleting", "error");
    }
  };

  const clearDone = async () => {
    try {
      const res  = await fetch(`${API}/delete-todos/done/clear`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { fetchTodos(filter); showToast(`Cleared ${json.removed} tasks`); }
    } catch {
      showToast("Error clearing", "error");
    }
  };

  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <style>{style}</style>

      {/* ── NAVBAR ── */}
      <nav>
        <div className="nav-logo">
          <span /> taskr
        </div>
        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#todos">Tasks</a></li>
          <li><a href="#todos" className="nav-cta">Open App</a></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="hero-tag">Productivity Redefined</div>

        <h1 className="hero-title">
          Get things<br /><em>done.</em>
        </h1>

        <p className="hero-sub">
          A minimal, fast task manager. No clutter — just your work, organized and moving forward.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => todoRef.current?.scrollIntoView({ behavior: "smooth" })}>
            Start tracking →
          </button>
          <button className="btn-ghost">
            View source
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-num">{completed}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat">
            <span className="stat-num">{total - completed}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-num">{progress}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="arrow" />
          scroll
        </div>
      </section>

      {/* ── TODO SECTION ── */}
      <section className="todo-section" id="todos" ref={todoRef}>
        <div className="section-label">
          <h2>Your Tasks</h2>
          <div className="line" />
        </div>

        {/* Add input */}
        <div className="add-box">
          <div className="add-row">
            <input
              className="add-input"
              placeholder="What needs to be done?"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
            />
            <select className="priority-select" value={newPri} onChange={e => setNewPri(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="add-btn" onClick={addTodo} disabled={adding || !newText.trim()}>
              {adding ? "…" : "+ Add"}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="filter-tabs">
            {["all", "active", "done"].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          {completed > 0 && (
            <button className="clear-btn" onClick={clearDone}>
              Clear done ({completed})
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* List */}
        {loading ? (
          <div className="loader">
            <span /><span /><span />
          </div>
        ) : todos.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <h3>No tasks here</h3>
            <p>Add your first task above to get started.</p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map(todo => (
              <div
                key={todo._id}
                className={`todo-item priority-${todo.priority} ${todo.done ? "done-item" : ""}`}
              >
                {/* Checkbox */}
                <button
                  className={`todo-check ${todo.done ? "checked" : ""}`}
                  onClick={() => toggleDone(todo)}
                  title={todo.done ? "Mark active" : "Mark done"}
                >
                  {todo.done && <CheckIcon />}
                </button>

                {/* Text or edit input */}
                {editId === todo._id ? (
                  <input
                    className="todo-edit-input"
                    value={editText}
                    autoFocus
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") saveEdit(todo._id);
                      if (e.key === "Escape") setEditId(null);
                    }}
                  />
                ) : (
                  <span className={`todo-text ${todo.done ? "crossed" : ""}`}>
                    {todo.text}
                  </span>
                )}

                {/* Priority badge */}
                <span className={`priority-badge badge-${todo.priority}`}>
                  {todo.priority}
                </span>

                {/* Actions */}
                <div className="todo-actions">
                  {editId === todo._id ? (
                    <>
                      <button className="icon-btn save" title="Save" onClick={() => saveEdit(todo._id)}>
                        <SaveIcon />
                      </button>
                      <button className="icon-btn" title="Cancel" onClick={() => setEditId(null)}>
                        <XIcon />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => { setEditId(todo._id); setEditText(todo.text); }}
                      >
                        <EditIcon />
                      </button>
                      <button className="icon-btn del" title="Delete" onClick={() => deleteTodo(todo._id)}>
                        <TrashIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer>
        built with <span>♥</span> using React + MongoDB Express API
      </footer>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </>
  );
}