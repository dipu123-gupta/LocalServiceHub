const InputField = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  minLength,
  required = true,
  extra,
  className = "",
  error = "",
  ...rest
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-sm outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-900/10 focus:border-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${error ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : ""}`}
        {...rest}
      />
      {extra && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {extra}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
  </div>
);

export default InputField;
