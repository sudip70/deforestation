import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { LAYER_MAP } from '../../config/layers';
import type { LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
}

function LegendItem({ color, name, range }: { color: string; name: string; range: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
      <div
        style={{
          width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0,
          background: color, border: '1px solid rgba(255,255,255,0.08)',
        }}
      />
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 600,
          color: '#e2e8f0', lineHeight: 1.2,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          color: 'rgba(226,232,240,0.55)', marginTop: '1px',
        }}>
          {range}
        </div>
      </div>
    </div>
  );
}

export function RightPanel({ activeLayer }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  return (
    <div style={{
      position: 'fixed', right: '20px', top: '50%',
      transform: 'translateY(-50%)', zIndex: 20,
    }}>
      <motion.aside
        key={activeLayer}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PanelShell style={{ width: '178px' }}>
          <div style={{ marginBottom: '16px' }}>
            <PanelLabel>{config.legendTitle}</PanelLabel>
            <div style={{ marginTop: '8px' }}>
              <SectionDivider gradient />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {config.legendItems.map((item) => (
              <LegendItem key={item.name} {...item} />
            ))}
          </div>

          {/* No-data indicator */}
          <div style={{ marginTop: '14px' }}>
            <SectionDivider />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0,
              background: 'rgba(20,32,42,0.55)', border: '1px solid rgba(255,255,255,0.08)',
            }} />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              color: 'rgba(226,232,240,0.4)',
            }}>
              No data
            </div>
          </div>
        </PanelShell>
      </motion.aside>
    </div>
  );
}