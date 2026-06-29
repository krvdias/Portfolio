import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  usePortfolioData, API_URL, PortfolioData, defaultPortfolioData
} from '../contexts/PortfolioDataContext';
import {
  Plus, Trash2, Save, RotateCcw, LogOut, BarChart2, LayoutDashboard,
  Briefcase, Code2, Image, User, ChevronDown, ChevronUp, X, Check,
  Eye, EyeOff
} from 'lucide-react';

// ─── Reusable Input & Textarea ──────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}> = ({ label, value, onChange, placeholder, multiline }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</label>
    {multiline ? (
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    ) : (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    )}
  </div>
);

// ─── Section Card Wrapper ────────────────────────────────────────────────────
const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
      <span className="text-blue-500">{icon}</span>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { data, refreshData } = usePortfolioData();
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState<PortfolioData>(defaultPortfolioData);
  const [stats, setStats] = useState<{ total: number; visitors: any[] } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'analytics'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [visitorFilter, setVisitorFilter] = useState<'today' | '7d' | '14d' | '1m' | '1y' | 'old' | 'all'>('all');

  // New entry states
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', type: 'full-time' as const, highlights: '', tags: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', language: '' });
  const [newDesign, setNewDesign] = useState({ src: '', alt: '' });
  const [designAddTab, setDesignAddTab] = useState<'url' | 'upload'>('upload');
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [uploadDesignProgress, setUploadDesignProgress] = useState(0);
  const [uploadDesignError, setUploadDesignError] = useState('');
  const [uploadDesignSuccess, setUploadDesignSuccess] = useState('');

  // ── Visitor filter logic ─────────────────────────────────────────────────────
  const filteredVisitors = (stats?.visitors ?? []).filter(v => {
    const now = Date.now();
    const ts = v.timestamp;
    const msDay = 86400000;
    if (visitorFilter === 'today')  return now - ts < msDay;
    if (visitorFilter === '7d')     return now - ts < 7  * msDay;
    if (visitorFilter === '14d')    return now - ts < 14 * msDay;
    if (visitorFilter === '1m')     return now - ts < 30 * msDay;
    if (visitorFilter === '1y')     return now - ts < 365 * msDay;
    if (visitorFilter === 'old')    return now - ts >= 365 * msDay;
    return true; // 'all'
  });

  // ── Upload design image to Cloudflare R2 ────────────────────────────────────
  const uploadDesignFile = async (file: File, altText: string) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadDesignError('Only JPEG, PNG, or WebP images allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadDesignError('File must be under 10MB.');
      return;
    }
    setUploadingDesign(true);
    setUploadDesignError('');
    setUploadDesignSuccess('');
    setUploadDesignProgress(10);

    // Generate a clean filename from the alt text or timestamp
    const safeName = (altText || 'design-' + Date.now())
      .toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40);

    const timer = setInterval(() => setUploadDesignProgress(p => Math.min(p + 8, 85)), 250);
    try {
      const res = await fetch(`${API_URL}/api/upload-design`, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'Content-Length': String(file.size),
          'X-Admin-Key': adminKey,
          'X-Filename': safeName,
        },
        body: file,
      });
      clearInterval(timer);
      setUploadDesignProgress(100);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Upload failed');
      }

      const result = await res.json();
      const publicUrl = result.publicUrl || '';

      if (publicUrl) {
        const maxId = formData.graphicDesigns.reduce((acc, d) => Math.max(acc, d.id), 0);
        setFormData(prev => ({
          ...prev,
          graphicDesigns: [...prev.graphicDesigns, { id: maxId + 1, src: publicUrl, alt: altText || safeName }]
        }));
        setUploadDesignSuccess(`Uploaded! URL: ${publicUrl}`);
        setNewDesign({ src: '', alt: '' });
        setTimeout(() => { setUploadDesignSuccess(''); setUploadDesignProgress(0); }, 4000);
      } else {
        throw new Error('No public URL returned from worker. Check R2_PUBLIC_URL in wrangler.toml.');
      }
    } catch (err: unknown) {
      clearInterval(timer);
      setUploadDesignError(err instanceof Error ? err.message : 'Upload failed');
      setUploadDesignProgress(0);
    } finally {
      setUploadingDesign(false);
    }
  };

  useEffect(() => { setFormData(data); }, [data]);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/stats`, { headers: { 'X-Admin-Key': adminKey } });
      if (res.ok) {
        const s = await res.json();
        setStats(s);
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Invalid Admin Key. Try again.');
      }
    } catch {
      setLoginError('Cannot connect to backend. Is the worker deployed?');
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/portfolio-data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaveSuccess(true);
        refreshData();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch { /* silent */ }
    setIsSaving(false);
  };

  // ── Experience helpers ──────────────────────────────────────────────────────
  const updateExp = (i: number, key: string, value: any) => {
    const updated = [...formData.experience];
    updated[i] = { ...updated[i], [key]: value };
    setFormData({ ...formData, experience: updated });
  };
  const deleteExp = (i: number) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, idx) => idx !== i) });
    if (expandedExp === i) setExpandedExp(null);
  };
  const addExp = () => {
    if (!newExp.role.trim()) return;
    const entry = {
      ...newExp,
      highlights: newExp.highlights.split('\n').map(s => s.trim()).filter(Boolean),
      tags: newExp.tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    setFormData({ ...formData, experience: [...formData.experience, entry] });
    setNewExp({ role: '', company: '', period: '', type: 'full-time', highlights: '', tags: '' });
  };

  // ── Project helpers ─────────────────────────────────────────────────────────
  const updateProject = (i: number, key: string, value: string) => {
    const updated = [...formData.projects];
    updated[i] = { ...updated[i], [key]: value };
    setFormData({ ...formData, projects: updated });
  };
  const deleteProject = (i: number) => setFormData({ ...formData, projects: formData.projects.filter((_, idx) => idx !== i) });
  const addProject = () => {
    if (!newProject.title.trim()) return;
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
    setNewProject({ title: '', description: '', link: '', language: '' });
  };

  // ── Graphic Design helpers ──────────────────────────────────────────────────
  const updateDesign = (i: number, key: string, value: string) => {
    const updated = [...formData.graphicDesigns];
    updated[i] = { ...updated[i], [key]: value };
    setFormData({ ...formData, graphicDesigns: updated });
  };
  const deleteDesign = (i: number) => setFormData({ ...formData, graphicDesigns: formData.graphicDesigns.filter((_, idx) => idx !== i) });

  // ── Login Screen ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Enter your secret key to continue</p>
          </div>
          <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Admin Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={adminKey}
                    onChange={e => setAdminKey(e.target.value)}
                    placeholder="••••••••••••••••••"
                    className="w-full p-3 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {loginError && (
                <p className="text-red-500 text-sm flex items-center gap-1.5"><X className="w-4 h-4" />{loginError}</p>
              )}
              <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20">
                Login
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Tab switcher */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'content' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Content
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <BarChart2 className="w-4 h-4" /> Analytics
            </button>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="sm:hidden flex gap-2 px-4 pt-4">
        <button onClick={() => setActiveTab('content')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${activeTab === 'content' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Content</button>
        <button onClick={() => setActiveTab('analytics')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>Analytics</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ─── ANALYTICS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Visitors</p>
                  <p className="text-3xl font-black text-blue-600">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unique Logs Stored</p>
                  <p className="text-3xl font-black text-purple-600">{stats.visitors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Header + filter pills */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Visitor Log</p>
                  <p className="text-xs text-gray-400 mt-0.5">{filteredVisitors.length} of {stats.visitors.length} entries shown</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: 'today', label: 'Today' },
                    { key: '7d',   label: '7 Days' },
                    { key: '14d',  label: '14 Days' },
                    { key: '1m',   label: '1 Month' },
                    { key: '1y',   label: '1 Year' },
                    { key: 'old',  label: '> 1 Year' },
                    { key: 'all',  label: 'All Time' },
                  ] as const).map(f => (
                    <button
                      key={f.key}
                      onClick={() => setVisitorFilter(f.key)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        visitorFilter === f.key
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">IP</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-left">Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredVisitors.map((v, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        <td className="py-3 px-4 text-gray-500">{new Date(v.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 font-mono">{v.ip}</td>
                        <td className="py-3 px-4">{v.city !== 'unknown' ? `${v.city}, ${v.country}` : v.country}</td>
                        <td className="py-3 px-4 text-gray-400 truncate max-w-xs" title={v.userAgent}>{v.userAgent?.split(' ').slice(-1)[0] || v.userAgent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredVisitors.length === 0 && (
                  <p className="text-center text-gray-400 py-8">
                    No visitors found for the selected period.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CONTENT TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'content' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Save bar */}
            <div className="flex gap-3 sticky top-[73px] z-40 py-2">
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition active:scale-[0.97]">
                {isSaving ? <><span className="animate-spin">⟳</span> Saving…</> : saveSuccess ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save as Default</>}
              </button>
              <button onClick={() => setFormData(defaultPortfolioData)} className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold rounded-xl transition">
                <RotateCcw className="w-4 h-4" /> Reset to Built-in Defaults
              </button>
            </div>

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <Card title="Hero Section" icon={<User className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" value={formData.hero.firstName} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, firstName: v } })} />
                <Field label="Last Name" value={formData.hero.lastName} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, lastName: v } })} />
                <Field label="GitHub URL" value={formData.hero.githubUrl} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, githubUrl: v } })} />
                <Field label="LinkedIn URL" value={formData.hero.linkedinUrl} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, linkedinUrl: v } })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-2">Roles (one per line)</label>
                <textarea
                  rows={3}
                  value={formData.hero.roles.join('\n')}
                  onChange={e => setFormData({ ...formData, hero: { ...formData.hero, roles: e.target.value.split('\n') } })}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </Card>

            {/* ── About ────────────────────────────────────────────────────── */}
            <Card title="About Section" icon={<User className="w-5 h-5" />}>
              <Field label="Description" value={formData.about.description} onChange={v => setFormData({ ...formData, about: { description: v } })} multiline placeholder="Write your bio here…" />
            </Card>

            {/* ── Experience ───────────────────────────────────────────────── */}
            <Card title="Experience" icon={<Briefcase className="w-5 h-5" />}>
              {/* Existing entries */}
              <div className="space-y-3">
                {formData.experience.map((exp, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedExp(expandedExp === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      <div>
                        <p className="font-semibold text-sm">{exp.role || 'Untitled Role'}</p>
                        <p className="text-xs text-gray-500">{exp.company} · {exp.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); deleteExp(i); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expandedExp === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedExp === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Field label="Role" value={exp.role} onChange={v => updateExp(i, 'role', v)} />
                              <Field label="Company" value={exp.company} onChange={v => updateExp(i, 'company', v)} />
                              <Field label="Period" value={exp.period} onChange={v => updateExp(i, 'period', v)} />
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Type</label>
                                <select value={exp.type} onChange={e => updateExp(i, 'type', e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <option value="full-time">Full-time</option>
                                  <option value="intern">Internship</option>
                                </select>
                              </div>
                            </div>
                            <Field label="Highlights (one per line)" value={exp.highlights.join('\n')} onChange={v => updateExp(i, 'highlights', v.split('\n').map(s => s.trim()).filter(Boolean))} multiline />
                            <Field label="Tags (comma-separated)" value={exp.tags.join(', ')} onChange={v => updateExp(i, 'tags', v.split(',').map(s => s.trim()).filter(Boolean))} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Add new */}
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Role" value={newExp.role} onChange={v => setNewExp({ ...newExp, role: v })} placeholder="e.g. Software Engineer" />
                  <Field label="Company" value={newExp.company} onChange={v => setNewExp({ ...newExp, company: v })} placeholder="e.g. Google" />
                  <Field label="Period" value={newExp.period} onChange={v => setNewExp({ ...newExp, period: v })} placeholder="e.g. 2024 – Present" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Type</label>
                    <select value={newExp.type} onChange={e => setNewExp({ ...newExp, type: e.target.value as any })} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="full-time">Full-time</option>
                      <option value="intern">Internship</option>
                    </select>
                  </div>
                </div>
                <Field label="Highlights (one per line)" value={newExp.highlights} onChange={v => setNewExp({ ...newExp, highlights: v })} multiline placeholder="Bullet point 1&#10;Bullet point 2" />
                <Field label="Tags (comma-separated)" value={newExp.tags} onChange={v => setNewExp({ ...newExp, tags: v })} placeholder="React, Node.js, TypeScript" />
                <button onClick={addExp} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            </Card>

            {/* ── Projects ─────────────────────────────────────────────────── */}
            <Card title="Projects" icon={<Code2 className="w-5 h-5" />}>
              {/* Existing */}
              <div className="space-y-4">
                {formData.projects.map((proj, i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 relative group">
                    <button onClick={() => deleteProject(i)} className="absolute top-3 right-3 p-1.5 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Title" value={proj.title} onChange={v => updateProject(i, 'title', v)} />
                      <Field label="Language / Tech" value={proj.language || ''} onChange={v => updateProject(i, 'language', v)} placeholder="e.g. Flutter, React" />
                    </div>
                    <Field label="Description" value={proj.description} onChange={v => updateProject(i, 'description', v)} multiline />
                    <Field label="Link (GitHub / Demo)" value={proj.link} onChange={v => updateProject(i, 'link', v)} placeholder="https://github.com/…" />
                  </div>
                ))}
              </div>

              {/* Add new */}
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Project</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title" value={newProject.title} onChange={v => setNewProject({ ...newProject, title: v })} placeholder="My Awesome App" />
                  <Field label="Language / Tech" value={newProject.language} onChange={v => setNewProject({ ...newProject, language: v })} placeholder="React, Flutter…" />
                </div>
                <Field label="Description" value={newProject.description} onChange={v => setNewProject({ ...newProject, description: v })} multiline placeholder="What does this project do?" />
                <Field label="Link" value={newProject.link} onChange={v => setNewProject({ ...newProject, link: v })} placeholder="https://github.com/…" />
                <button onClick={addProject} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </Card>

            {/* ── Graphic Designs ───────────────────────────────────────────── */}
            <Card title="Graphic Designs" icon={<Image className="w-5 h-5" />}>
              <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Add images by URL. Upload images to your Cloudflare R2 bucket first, then paste the public URL here.</p>

              {/* Grid of existing */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.graphicDesigns.map((d, i) => (
                  <div key={d.id} className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={d.src} alt={d.alt} className="w-full h-28 object-cover" onError={e => (e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23374151" width="100" height="100"/><text fill="%23fff" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">Error</text></svg>')} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 gap-1">
                      <input value={d.alt} onChange={e => updateDesign(i, 'alt', e.target.value)} className="text-xs bg-white/20 text-white placeholder-white/60 rounded p-1 w-full" placeholder="Alt text" onClick={e => e.stopPropagation()} />
                      <button onClick={() => deleteDesign(i)} className="flex items-center justify-center gap-1 text-xs text-red-300 hover:text-red-200 transition">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new design – tabbed: Upload File | Paste URL */}
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-500 flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Design Image</p>
                  <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                    <button
                      onClick={() => setDesignAddTab('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        designAddTab === 'upload' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      ⬆ Upload File
                    </button>
                    <button
                      onClick={() => setDesignAddTab('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        designAddTab === 'url' ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>
                </div>

                {/* Alt text – shared between both tabs */}
                <Field
                  label="Alt Text / Label"
                  value={newDesign.alt}
                  onChange={v => setNewDesign({ ...newDesign, alt: v })}
                  placeholder="e.g. Logo Design 5"
                />

                {/* ── UPLOAD TAB ── */}
                {designAddTab === 'upload' && (
                  <div className="space-y-3">
                    <label
                      htmlFor="design-file-input"
                      className={`flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition ${
                        uploadingDesign
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      {uploadingDesign ? (
                        <>
                          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-blue-500 font-medium">Uploading to Cloudflare R2…</p>
                          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${uploadDesignProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Image className="w-10 h-10 text-gray-400" />
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Click to choose a file</p>
                            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 10 MB</p>
                          </div>
                        </>
                      )}
                      <input
                        id="design-file-input"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        disabled={uploadingDesign}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) await uploadDesignFile(file, newDesign.alt);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Feedback messages */}
                    {uploadDesignError && (
                      <p className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                        <X className="w-4 h-4 flex-shrink-0" /> {uploadDesignError}
                      </p>
                    )}
                    {uploadDesignSuccess && (
                      <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                        <Check className="w-4 h-4 flex-shrink-0" /> {uploadDesignSuccess}
                      </p>
                    )}
                  </div>
                )}

                {/* ── URL TAB ── */}
                {designAddTab === 'url' && (
                  <div className="space-y-3">
                    <Field
                      label="Image URL"
                      value={newDesign.src}
                      onChange={v => setNewDesign({ ...newDesign, src: v })}
                      placeholder="https://pub-xxx.r2.dev/portfolio/assets/images/posts/new.jpg"
                    />
                    {newDesign.src && (
                      <img
                        src={newDesign.src}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        onError={e => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <button
                      onClick={() => {
                        if (!newDesign.src.trim()) return;
                        const maxId = formData.graphicDesigns.reduce((acc, d) => Math.max(acc, d.id), 0);
                        setFormData({ ...formData, graphicDesigns: [...formData.graphicDesigns, { id: maxId + 1, ...newDesign }] });
                        setNewDesign({ src: '', alt: '' });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition"
                    >
                      <Plus className="w-4 h-4" /> Add Image
                    </button>
                  </div>
                )}
              </div>
            </Card>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
