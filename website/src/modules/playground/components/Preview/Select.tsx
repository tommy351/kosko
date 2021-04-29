import React, { FunctionComponent, ReactNode } from "react";
import styles from "./styles.module.scss";

interface SelectProps {
  label: ReactNode;
  value: string;
  options: readonly string[];
  onChange(value: string): void;
}

const Select: FunctionComponent<SelectProps> = ({
  label,
  value,
  options,
  onChange
}) => {
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
};

export default Select;
