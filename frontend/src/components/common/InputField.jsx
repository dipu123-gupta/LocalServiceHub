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
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-sm font-semibold text-gray-700">
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
        className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-gray-400 ${error ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : ""}`}
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
