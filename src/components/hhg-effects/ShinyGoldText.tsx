interface ShinyGoldTextProps {
  text: string;
  className?: string;
}

export function ShinyGoldText({ text, className = '' }: ShinyGoldTextProps) {
  return (
    <span className={`font-display text-[#F3EDE3] drop-shadow-[0_2px_10px_rgba(196,164,106,0.25)] ${className}`}>
      {text}
    </span>
  );
}
