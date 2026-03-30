import { LAYER_CONFIGS } from '../../config/layers';
import type { LayerId } from '../../types';

interface Props {
  activeLayer: LayerId;
  onChange: (layer: LayerId) => void;
  horizontal?: boolean;
}

export function LayerSwitcher({ activeLayer, onChange, horizontal = false }: Props) {
  return (
    <div
      className={`flex gap-1 ${
        horizontal
          ? 'flex-row overflow-x-auto pb-1 scrollbar-none'
          : 'flex-col items-stretch'
      }`}
    >
      {LAYER_CONFIGS.map((layer) => {
        const active = layer.id === activeLayer;
        return (
          <button
            key={layer.id}
            onClick={() => onChange(layer.id)}
            className={`flex items-center gap-[7px] px-3 md:px-[14px] py-[6px] md:py-[7px] rounded-[10px] cursor-pointer font-mono text-[11px] md:text-[12px] tracking-[0.5px] whitespace-nowrap transition-all duration-150 border ${
              active
                ? 'border-green-500/55 bg-green-500/[0.13] text-green-400'
                : 'border-white/[0.09] bg-white/[0.04] text-slate-100/50 hover:bg-white/[0.08] hover:text-slate-100/80'
            }`}
          >
            <layer.Icon size={13} />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
