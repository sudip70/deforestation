interface Props {
  gradient?: boolean;
}

export function SectionDivider({ gradient }: Props) {
  return (
    <div
      className={`h-px ${
        gradient
          ? 'bg-gradient-to-r from-white/[0.14] to-transparent'
          : 'bg-white/[0.07]'
      }`}
    />
  );
}
