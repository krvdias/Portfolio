import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Lock, Upload, CheckCircle, XCircle, X, Eye, EyeOff } from 'lucide-react';

/* ─── env vars ─────────────────────────────────────────────────────── */
const ADMIN_PASSWORD  = import.meta.env.VITE_ADMIN_PASSWORD  as string;
const WORKER_URL      = import.meta.env.VITE_WORKER_URL      as string;
const WORKER_ADMIN_KEY = import.meta.env.VITE_WORKER_ADMIN_KEY as string;

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface Props {
  /** Called with a cache-busted URL when upload succeeds */
  onUploadSuccess: (newUrl: string) => void;
  currentImageUrl: string;
  children?: React.ReactNode;
}

/* ─── component ─────────────────────────────────────────────────────── */
const AdminPhotoUpload: React.FC<Props> = ({ onUploadSuccess, currentImageUrl, children }) => {
  const [isAdminMode, setIsAdminMode]     = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword]           = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [authError, setAuthError]         = useState('');
  const [isHovered, setIsHovered]         = useState(false);
  const [uploadStatus, setUploadStatus]   = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Keyboard shortcut: Ctrl + Shift + A ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (isAdminMode) {
          exitAdmin();
        } else {
          setShowAuthModal(true);
        }
      }
      if (e.key === 'Escape') {
        setShowAuthModal(false);
        setPassword('');
        setAuthError('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAdminMode]);

  const exitAdmin = () => {
    setIsAdminMode(false);
    setUploadStatus('idle');
    setStatusMessage('');
  };

  /* ── Password submit ── */
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setAuthError('VITE_ADMIN_PASSWORD not set in .env');
      return;
    }
    if (password === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowAuthModal(false);
      setPassword('');
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
      setPassword('');
    }
  };

  /* ── File upload ── */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadStatus('error');
      setStatusMessage('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setStatusMessage('File must be under 5MB.');
      return;
    }

    if (!WORKER_URL || !WORKER_ADMIN_KEY) {
      setUploadStatus('error');
      setStatusMessage('Worker URL or Admin Key not configured in .env');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    setStatusMessage('Uploading to Cloudflare R2…');

    // Simulate progress (XHR would give real progress; fetch doesn't)
    const timer = setInterval(() => {
      setUploadProgress(p => Math.min(p + 12, 85));
    }, 200);

    try {
      const res = await fetch(WORKER_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
          'Content-Length': String(file.size),
          'X-Admin-Key': WORKER_ADMIN_KEY,
        },
        body: file,
      });

      clearInterval(timer);
      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      setUploadStatus('success');
      setStatusMessage('Photo updated successfully!');

      // Cache-bust the existing URL so the new image shows immediately
      const baseUrl = currentImageUrl.split('?')[0];
      onUploadSuccess(`${baseUrl}?v=${data.timestamp ?? Date.now()}`);

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setStatusMessage('');
        setUploadProgress(0);
      }, 3000);
    } catch (err: unknown) {
      clearInterval(timer);
      setUploadStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(0);
    }

    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [currentImageUrl, onUploadSuccess]);

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <>
      {/* Admin mode badge */}
      <AnimatePresence>
        {isAdminMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold shadow-xl"
          >
            <Lock className="w-4 h-4" />
            Admin Mode — hover photo to change it
            <button
              onClick={exitAdmin}
              className="ml-2 p-0.5 rounded-full hover:bg-amber-600 transition-colors"
              title="Exit admin mode (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Photo overlay wrapper — only interactive in admin mode */}
      <div
        className="relative w-64 h-64 md:w-96 md:h-96 rounded-full"
        onMouseEnter={() => isAdminMode && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Upload overlay */}
        <AnimatePresence>
          {isAdminMode && (isHovered || uploadStatus !== 'idle') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => uploadStatus === 'idle' && fileInputRef.current?.click()}
              className={`absolute inset-0 rounded-full z-20 flex flex-col items-center justify-center gap-2
                ${uploadStatus === 'idle' ? 'cursor-pointer bg-black/50 hover:bg-black/60' : 'bg-black/70'}
                transition-colors`}
            >
              {uploadStatus === 'idle' && (
                <>
                  <Camera className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-semibold">Change Photo</span>
                </>
              )}

              {uploadStatus === 'uploading' && (
                <>
                  {/* Progress ring */}
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none" stroke="white" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                      className="transition-all duration-200"
                    />
                  </svg>
                  <Upload className="w-5 h-5 text-white absolute" />
                  <span className="text-white text-xs font-medium mt-1">{uploadProgress}%</span>
                </>
              )}

              {uploadStatus === 'success' && (
                <>
                  <CheckCircle className="w-10 h-10 text-green-400" />
                  <span className="text-green-300 text-sm font-semibold">{statusMessage}</span>
                </>
              )}

              {uploadStatus === 'error' && (
                <>
                  <XCircle className="w-10 h-10 text-red-400" />
                  <span className="text-red-300 text-xs font-semibold text-center px-4">{statusMessage}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); }}
                    className="text-white/70 text-xs underline mt-1"
                  >
                    Try again
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small camera badge when admin, not hovering */}
        {isAdminMode && !isHovered && uploadStatus === 'idle' && (
          <div className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center pointer-events-none">
            <Camera className="w-4 h-4 text-white" />
          </div>
        )}

        {/* The actual image rendered inside the overlay wrapper */}
        {children}
      </div>

      {/* ── Auth Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8"
            >
              {/* Close */}
              <button
                onClick={() => { setShowAuthModal(false); setPassword(''); setAuthError(''); }}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
                Admin Access
              </h2>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                Enter your admin password to unlock photo editing.
              </p>

              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Admin password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setAuthError(''); }}
                    autoFocus
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {authError}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                  Unlock Admin Mode
                </button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-4">
                Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">Ctrl+Shift+A</kbd>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPhotoUpload;
