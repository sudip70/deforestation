import { motion } from 'framer-motion';
import { FiInfo, FiUsers } from 'react-icons/fi';

interface Props {
  year: number;
  onInfoClick: () => void;
  onAboutClick: () => void;
}

export function Header({ year, onInfoClick, onAboutClick }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-30 pt-4 md:pt-5 px-5 md:px-7"
    >
      <div className="flex items-start justify-between">
        {/* Brand */}
        <div className="flex items-center gap-[9px] font-mono text-[10px] md:text-[11px] tracking-[2px] text-slate-100/55 uppercase pt-[6px]">
          <span
            className="pulse-dot w-[7px] h-[7px] rounded-full bg-green-500 flex-shrink-0"
            style={{ boxShadow: '0 0 8px #22c55e' }}
          />
          <span className="hidden sm:inline">Earth Observatory</span>
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-3 pt-[4px]">
          {/* Data Sources */}
          <button
            onClick={onInfoClick}
            className="flex items-center gap-[6px] font-mono text-[9px] tracking-[2px] text-slate-100/40 uppercase hover:text-slate-100/70 transition-colors cursor-pointer group"
            title="About the data"
          >
            <FiInfo
              size={13}
              className="group-hover:text-green-400 transition-colors flex-shrink-0"
            />
            <span className="hidden sm:inline">Data Sources</span>
          </button>

          {/* Divider */}
          <div className="w-px h-3 bg-white/[0.12] hidden sm:block" />

          {/* About */}
          <button
            onClick={onAboutClick}
            className="flex items-center gap-[6px] font-mono text-[9px] tracking-[2px] text-slate-100/40 uppercase hover:text-slate-100/70 transition-colors cursor-pointer group"
            title="About the developers"
          >
            <FiUsers
              size={13}
              className="group-hover:text-sky-400 transition-colors flex-shrink-0"
            />
            <span className="hidden sm:inline">About Us</span>
          </button>
        </div>
      </div>

      {/* Year — truly centered */}
      <div className="absolute top-4 md:top-5 left-0 right-0 flex flex-col items-center pointer-events-none">
        <div className="font-mono text-[9px] tracking-[4px] text-slate-100/55 mb-[2px]">
          MONITORING YEAR
        </div>
        <div
          className="font-display text-[40px] md:text-[64px] font-bold leading-none tracking-[-2px] bg-clip-text text-transparent"
          style={{
            background: 'linear-gradient(160deg, #ffffff 30%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {year}
        </div>
      </div>
    </motion.header>
  );
}