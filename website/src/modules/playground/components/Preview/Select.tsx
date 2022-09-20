import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

interface SelectProps {
  label: ReactNode;
  value: string;
  options: readonly string[];
  onChange(value: string): void;
}

export default function Select({
  label,
  value,
  options,
  onChange
}: SelectProps) {
  return (
    <label className={styles.selectContainer}>
      <div className={styles.selectLabel}>{label}</div>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
