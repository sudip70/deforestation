import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiLinkedin, FiGlobe, FiMail } from 'react-icons/fi';
import { useState } from 'react';

interface Developer {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  accentColor: string;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    email?: string;
  };
}

const DEVELOPERS: Developer[] = [
  {
    id: 'dev1',
    name: 'Animesh Basnet',
    role: 'AI & ML Researcher',
    bio: 'I am a programmer specializing in building (and occasionally designing). Currently, I\'m focused on researching and developing Machine Learning and Large Language Models.',
    initials: 'AB',
    accentColor: '#22c55e',
    links: {
      github: 'https://github.com/crypticsy',
      linkedin: 'https://linkedin.com/in/animeshbasnet/',
      portfolio: 'https://animeshbasnet.com.np',
      email: 'contact@animeshbasnet.com.np',

    },
  },
  {
    id: 'dev2',
    name: "Sudip Shrestha",
    role: 'Data Analyst & AI Engineer',
    bio: 'I am a data enthusiast with a background in engineering and a passion for transforming complex datasets into compelling visual stories. I am learing and building ML models.',
    initials: 'SS',
    accentColor: '#38bdf8',
    links: {
      github: 'https://github.com/sudip70',
      linkedin: 'https://linkedin.com/in/sudipshrestha-58/',
      portfolio: 'https://sudip70.github.io',
      email: 'sudipshrestha.ca@gmail.com',
    
    },
  },
];

const LINK_META = [
  { key: 'github',    Icon: FiGithub,   label: 'GitHub' },
  { key: 'linkedin',  Icon: FiLinkedin, label: 'LinkedIn' },
  { key: 'portfolio', Icon: FiGlobe,    label: 'Portfolio' },
  { key: 'email',     Icon: FiMail,     label: 'Mail' },
] as const;

interface Props {
  onClose: () => void;
}

export function AboutModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<string>(DEVELOPERS[0].id);
  const dev = DEVELOPERS.find((d) => d.id === activeTab)!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="relative z-10 w-full max-w-[420px] rounded-2xl border border-white/[0.1] overflow-hidden"
        style={{ background: 'rgba(6,12,20,0.97)', backdropFilter: 'blur(24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.07]">
          <div>
            <div className="font-mono text-[9px] tracking-[3px] text-slate-100/40 uppercase mb-1">
              The Team
            </div>
            <div className="font-display text-[17px] font-bold text-slate-100">
              About the Developers
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-100/50 hover:bg-white/[0.07] hover:text-slate-100/80 transition-colors cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 overflow-x-auto">
          {DEVELOPERS.map((d) => {
            const active = d.id === activeTab;
            return (
              <button
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className={`flex items-center gap-2 px-3 py-[6px] rounded-t-lg cursor-pointer font-mono text-[10px] tracking-[0.5px] whitespace-nowrap transition-all duration-150 border-t border-l border-r ${
                  active
                    ? 'border-white/[0.1] bg-white/[0.06] text-slate-100'
                    : 'border-transparent text-slate-100/40 hover:text-slate-100/65'
                }`}
              >
                {/* Mini avatar in tab */}
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                  style={{
                    background: active ? `${d.accentColor}22` : 'rgba(255,255,255,0.06)',
                    color: active ? d.accentColor : 'rgba(226,232,240,0.4)',
                    border: `1px solid ${active ? d.accentColor + '44' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {d.initials[0]}
                </span>
                <span>{d.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="h-px bg-white/[0.07]" />

        {/* Card content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="px-5 py-6"
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-4 mb-5">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-[20px] font-bold font-display flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${dev.accentColor}18, ${dev.accentColor}08)`,
                  border: `1.5px solid ${dev.accentColor}33`,
                  color: dev.accentColor,
                  boxShadow: `0 0 20px ${dev.accentColor}18`,
                }}
              >
                {dev.initials}
              </div>

              <div>
                <div
                  className="font-display text-[18px] font-bold leading-tight"
                  style={{ color: dev.accentColor }}
                >
                  {dev.name}
                </div>
                <div className="font-mono text-[10px] tracking-[1.5px] text-slate-100/45 mt-[3px]">
                  {dev.role}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="font-display text-[13px] text-slate-100/65 leading-relaxed mb-6">
              {dev.bio}
            </p>

            {/* Links */}
            <div className="grid grid-cols-2 gap-2">
              {LINK_META.map(({ key, Icon, label }) => {
                const href = key === 'email'
                  ? `mailto:${dev.links[key]}`
                  : dev.links[key as keyof typeof dev.links];
                if (!href) return null;
                return (
                  <a
                    key={key}
                    href={href}
                    target={key === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-[8px] px-3 py-[9px] rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.13] transition-all duration-150 group"
                  >
                    <Icon
                      size={13}
                      className="flex-shrink-0 transition-colors"
                      style={{ color: dev.accentColor }}
                    />
                    <span className="font-mono text-[10px] tracking-[0.5px] text-slate-100/55 group-hover:text-slate-100/80 transition-colors">
                      {label}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.07] flex items-center gap-2">
          <div
            className="w-[6px] h-[6px] rounded-full flex-shrink-0"
            style={{
              background: dev.accentColor,
              boxShadow: `0 0 6px ${dev.accentColor}`,
            }}
          />
          <span className="font-mono text-[9px] tracking-[1.5px] text-slate-100/35">
            Built with React, Three.js & Our World in Data.
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}