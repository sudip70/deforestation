interface Props {
  children: React.ReactNode;
}

export function PanelLabel({ children }: Props) {
  return (
    <div className="font-mono text-[8.5px] tracking-[3px] text-slate-100/55 uppercase">
      {children}
    </div>
  );
}
