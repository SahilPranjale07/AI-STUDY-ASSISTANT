interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function Card({ children, className = '', onClick, glow = false }: CardProps) {
  return (
    <div
      className={`bg-slate-800 rounded-2xl border border-slate-700 p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:bg-slate-750 hover:border-slate-600 hover:shadow-lg' : ''
      } ${glow ? 'shadow-lg shadow-purple-500/10' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
