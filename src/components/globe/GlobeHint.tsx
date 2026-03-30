import { AnimatePresence, motion } from 'framer-motion';

interface Props { visible: boolean; }

export function GlobeHint({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ delay: 1.2 }}
          className="fixed top-[90px] md:top-[110px] left-1/2 z-30 pointer-events-none"
        >
          <div className="bg-[rgba(6,12,20,0.72)] border border-white/[0.07] rounded-[20px] px-4 py-[6px]"
            style={{ backdropFilter: 'blur(12px)' }}>
            <p className="font-mono text-[9px] md:text-[10px] tracking-[2px] text-slate-100/65">
              Click on a country to view details
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
