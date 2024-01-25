import React from "react";
import { CurrencyComboBoxProps, currencies, Currency } from "../../models/Main";

const CurrencyComboBox: React.FC<CurrencyComboBoxProps> = (props) => {
  const { value, onSelectChange } = props;

  return (
    <div>
      <label htmlFor="currency">Waluta</label>
      <select id="currency" value={value} onChange={onSelectChange}>
        {currencies.map((currency: Currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyComboBox;
