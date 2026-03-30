import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { LAYER_MAP } from '../../config/layers';
import type { LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
}

export function RightPanel({ activeLayer }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  return (
    <motion.aside
      key={activeLayer}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <PanelShell className="w-[148px] md:w-[178px]">
        {/* Title */}
        <div className="mb-3">
          <PanelLabel>{config.legendTitle}</PanelLabel>
          <div className="mt-2">
            <SectionDivider gradient />
          </div>
        </div>

        {/* Legend items */}
        <div className="flex flex-col gap-[7px]">
          {config.legendItems.map((item) => (
            <div key={item.name} className="flex items-center gap-[7px]">
              <div
                className="w-3 h-3 rounded-[2px] flex-shrink-0 border border-white/[0.08]"
                style={{ background: item.color }}
              />
              <span className="font-display text-[10px] font-semibold text-slate-100 flex-1">
                {item.name}
              </span>
              <span className="font-mono text-[9px] text-slate-100/45 whitespace-nowrap">
                {item.range}
              </span>
            </div>
          ))}
        </div>

        {/* No-data indicator */}
        <div className="mt-3">
          <SectionDivider />
        </div>
        <div className="flex items-center gap-[6px] mt-[10px]">
          <div
            className="w-3 h-3 rounded-[2px] flex-shrink-0 border border-white/[0.08]"
            style={{ background: 'rgba(20,32,42,0.55)' }}
          />
          <span className="font-mono text-[9px] text-slate-100/40">
            No data
          </span>
        </div>
      </PanelShell>
    </motion.aside>
  );
}
