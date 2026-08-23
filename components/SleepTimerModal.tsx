'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Check, X, Clock, Music } from 'lucide-react';
import { usePlayerStore } from '@/lib/store';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMER_OPTIONS = [
  { label: '5 Menit', minutes: 5 },
  { label: '10 Menit', minutes: 10 },
  { label: '15 Menit', minutes: 15 },
  { label: '30 Menit', minutes: 30 },
  { label: '45 Menit', minutes: 45 },
  { label: '60 Menit', minutes: 60 },
];

export function SleepTimerModal({ isOpen, onClose }: SleepTimerModalProps) {
  const sleepTimerTarget = usePlayerStore((state) => state.sleepTimerTarget);
  const sleepTimerEndOfTrack = usePlayerStore((state) => state.sleepTimerEndOfTrack);
  const setSleepTimerMinutes = usePlayerStore((state) => state.setSleepTimerMinutes);
  const setSleepTimerEndOfTrack = usePlayerStore((state) => state.setSleepTimerEndOfTrack);
  const clearSleepTimer = usePlayerStore((state) => state.clearSleepTimer);

  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectMinutes = (minutes: number) => {
    setSleepTimerMinutes(minutes);
    onClose();
  };

  const handleSelectEndOfTrack = () => {
    setSleepTimerEndOfTrack(true);
    onClose();
  };

  const handleClearTimer = () => {
    clearSleepTimer();
    onClose();
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 720) {
      setSleepTimerMinutes(val);
      setCustomMinutes('');
      setShowCustomInput(false);
      onClose();
    }
  };

  const isTimerActive = !!(sleepTimerTarget || sleepTimerEndOfTrack);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-3xl liquid-glass p-6 text-white shadow-2xl border border-white/15 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl liquid-glass-icon flex items-center justify-center text-[#81B29A] shadow-inner">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Timer Tidur</h3>
                  <p className="text-xs text-white/50">Hentikan musik secara otomatis</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full liquid-glass-icon flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Options List */}
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto no-scrollbar">
              {TIMER_OPTIONS.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => handleSelectMinutes(option.minutes)}
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-subtle hover:bg-white/15 transition-all text-left flex items-center justify-between text-xs font-semibold group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-white/50 group-hover:text-[#81B29A] transition-colors" />
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}

              {/* End of Track Option */}
              <button
                onClick={handleSelectEndOfTrack}
                className={`w-full px-4 py-3 rounded-2xl transition-all text-left flex items-center justify-between text-xs font-semibold ${
                  sleepTimerEndOfTrack
                    ? 'liquid-glass-green text-zinc-950 font-bold shadow-md'
                    : 'liquid-glass-subtle hover:bg-white/15 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Music className={`w-4 h-4 ${sleepTimerEndOfTrack ? 'text-zinc-950' : 'text-white/50'}`} />
                  <span>Di Akhir Lagu Ini</span>
                </div>
                {sleepTimerEndOfTrack && <Check className="w-4 h-4" />}
              </button>

              {/* Custom Minutes Option */}
              {showCustomInput ? (
                <form onSubmit={handleApplyCustom} className="p-2 rounded-2xl liquid-glass-subtle border border-white/10 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="720"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      placeholder="Menit (misal: 25)"
                      autoFocus
                      className="flex-1 px-3 py-2 bg-white/10 rounded-xl text-white text-xs placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#81B29A]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#81B29A] text-zinc-950 font-bold rounded-xl text-xs hover:bg-[#81B29A]/90 transition"
                    >
                      Setel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-subtle hover:bg-white/15 transition-all text-left flex items-center justify-between text-xs font-semibold text-white/70 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span>Kustomisasi Menit...</span>
                  </div>
                </button>
              )}

              {/* Turn Off Timer Button */}
              {isTimerActive && (
                <div className="pt-2 border-t border-white/10 mt-2">
                  <button
                    onClick={handleClearTimer}
                    className="w-full px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all text-center text-xs font-bold"
                  >
                    Matikan Timer Tidur
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
