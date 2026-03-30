interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PanelShell({ children, className = '', style }: Props) {
  return (
    <div
      className={`bg-[rgba(6,12,20,0.72)] border border-white/[0.07] rounded-2xl p-4 md:p-5 ${className}`}
      style={{ backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', ...style }}
    >
      {children}
    </div>
  );
}
