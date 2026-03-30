import { FiPlay, FiPause } from 'react-icons/fi';

interface Props {
  playing: boolean;
  onClick: () => void;
}

export function PlayButton({ playing, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-[7px] w-[90px] md:w-[108px] py-[9px] rounded-full cursor-pointer font-mono text-[10px] md:text-[11px] tracking-[2px] whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
        playing
          ? 'bg-red-400/10 border border-red-400/40 text-red-400'
          : 'bg-green-500/[0.12] border border-green-500/40 text-green-500'
      }`}
    >
      {playing ? <FiPause size={12} /> : <FiPlay size={12} />}
      <span>{playing ? 'PAUSE' : 'PLAY'}</span>
    </button>
  );
}
