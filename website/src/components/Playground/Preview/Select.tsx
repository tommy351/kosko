import React, { FunctionComponent } from "react";
import styles from "./styles.module.scss";

const Select: FunctionComponent<{
  label: string;
  options: readonly string[];
  value: string;
  onChange(value: string): void;
}> = ({ label, options, value, onChange }) => {
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
