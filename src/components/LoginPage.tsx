import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (userId: string) => void;
  onSkip?: () => void;
}

const VALID_USER_IDS = [
  'vik01', 'cric01', 'pro02', 'gem03', 'dho04', 'ace05', 'zen06', 'max07', 'neo08', 'sky09',
  'fox10', 'hub11', 'app12', 'joy13', 'run14', 'win15', 'top16', 'go17', 'box18', 'lab19',
  'one20', 'two21', 'red22', 'sun23', 'star24', 'job25', 'eng26', 'ask27', 'talk28', 'speak29',
  'role30', 'test31', 'demo32', 'learn33', 'hi34', 'hey35', 'ok36', 'skill37', 'otg38', 'qsr39',
  'hotel40', 'food41', 'team42', 'play43', 'fast44', 'easy45', 'smart46', 'work47', 'daily48', 'friend49'
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSkip }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickDemo = () => {
    setUserId('vik01');
    setPassword('Hello123');
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess('vik01');
    }, 300);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = userId.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('कृपया User ID और Password दोनों दर्ज करें।');
      return;
    }

    if (trimmedPass !== 'Hello123' && trimmedPass !== 'hello123' && trimmedPass !== '123456') {
      setError('गलत Password। कृपया "Hello123" का उपयोग करें।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(trimmedUser);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAFA] text-black px-4 py-8 overflow-y-auto select-none"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-neutral-200/80 p-8 sm:p-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.3em] text-black mb-2"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            HELLO ENGLISH
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
            टेस्टिंग एक्सेस पोर्टल
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col space-y-5">
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="userId"
              className="text-xs uppercase tracking-[0.15em] font-semibold text-neutral-700"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="अपना User ID दर्ज करें"
              autoComplete="off"
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.15em] font-semibold text-neutral-700"
              style={{ fontFamily: "'Syncopate', sans-serif" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड दर्ज करें"
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200 text-black text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-3 rounded-xl bg-black text-white font-semibold text-xs uppercase tracking-[0.25em] hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer shadow-lg shadow-black/10 disabled:opacity-50"
            style={{ fontFamily: "'Syncopate', sans-serif" }}
          >
            {isLoading ? 'जाँच हो रही है...' : 'Login'}
          </button>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 text-neutral-800 font-semibold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>⚡ Quick Demo Login (vik01)</span>
          </button>
        </form>

        {/* Credentials guide note */}
        <div className="mt-6 text-center flex flex-col items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">
            Demo Credentials:
          </span>
          <span className="text-[11px] text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full font-mono">
            User ID: <strong className="text-black">vik01</strong> &nbsp;|&nbsp; Pass: <strong className="text-black">Hello123</strong>
          </span>
          {onSkip && (
            <button
              onClick={onSkip}
              className="mt-3 text-xs text-neutral-400 hover:text-black transition-colors cursor-pointer underline underline-offset-4"
            >
              Skip & Continue as Guest
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
