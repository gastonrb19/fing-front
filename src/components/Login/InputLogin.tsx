import React from "react";

interface InputLoginProps {
  label?: string;
  name: string;
  placeholderVal: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

export default function InputLogin({
  label,
  name,
  placeholderVal,
  type = "text",
  value,
  onChange,
  required = false,
  autoComplete,
  disabled = false,
}: InputLoginProps) {
  return (
    <label className="flex flex-col font-semibold text-slate-700 text-sm gap-1">
      <span>{label || name}</span>
      <input
        className="font-normal px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
        type={type}
        placeholder={placeholderVal}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
      />
    </label>
  );
}
