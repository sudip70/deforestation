interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorOverlay({ message, onRetry }: Props) {
  return (
    <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[rgba(2,5,8,0.92)] backdrop-blur-sm gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-red-400/40 bg-red-700/10 flex items-center justify-center text-xl mb-1">
        ✕
      </div>

      <div className="font-mono text-[11px] tracking-[3px] text-red-400 uppercase">
        Data Load Failed
      </div>

      <div className="font-mono text-[10px] text-slate-100/45 max-w-xs text-center leading-relaxed">
        {message}
      </div>

      <button
        onClick={onRetry}
        className="mt-2 bg-green-500/[0.12] border border-green-500/40 text-green-500 py-[9px] px-6 rounded-full cursor-pointer font-mono text-[11px] tracking-[2px] transition-colors hover:bg-green-500/[0.22]"
      >
        RETRY
      </button>
    </div>
  );
}
