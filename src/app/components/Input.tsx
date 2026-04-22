interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block mb-2 text-sm text-slate-300">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-slate-700 border border-slate-600 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  );
}
